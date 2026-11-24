// Keeps Bricks' greys on the scale. Every grey is defined once, in the grey
// scale block near the top of bricks.css: one scale per theme, each built for
// that theme's jobs, --grey-light-1 … --grey-light-13 and --grey-dark-1 …
// --grey-dark-12. Semantic tokens name a light step on :root and a dark step
// under .dark; they and components never carry a raw grey of their own.
// Adapted from the Hub's scripts/check-tokens.ts, which follows the same rules.
//
//   npm run check:tokens                    bricks.css, registry/bricks, preview/src/app.tsx
//   node scripts/check-tokens.mjs <path>    just that file or folder
//
// It fails (exit 1) on:
//   - a grey colour literal outside the scale block: a hex, rgb()/rgba(),
//     hsl() or oklch() whose OKLCH chroma is under 0.02. That catches stock
//     greys (r = g = b) and hand-tinted ones copied from an old value alike.
//     Pure black and white (#000, #fff, rgb(0 0 0 / a), rgb(255 255 255 / a))
//     are allowed everywhere.
//   - a scale that breaks the rule: a theme without exactly its steps (light
//     1-13, dark 1-12), a step that isn't tinted (hue 230-265, chroma 0.0012+
//     in light, 0.003+ in dark, since a tint reads stronger on light), or
//     steps out of order (light gets darker from 1 up, dark gets lighter).
//   - a token set on :root from the light scale that .dark never sets again,
//     which would leak a light grey into dark mode.
//   - a var(--grey-…) that names a step that doesn't exist.
//
// In .ts/.tsx, a line that has to keep a flat grey (content that must stay
// fixed whatever the theme) carries `tokens-allow` in a comment on that line
// or the one above it. Tests (*.test.ts) and comments are skipped.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const args = process.argv.slice(2)
const targets = args.length > 0 ? args : ["bricks.css", "registry/bricks", "preview/src/app.tsx"]
const GLOBALS = join(ROOT, "bricks.css")
const FILES = /\.(tsx?|jsx?|mjs|css)$/
const MARKER = "tokens-allow"
const problems = []

/** Every var(--grey-…) seen, checked once the scale is read. */
const references = []

// sRGB (0-255) to OKLCH, Björn Ottosson's matrices.
function oklch(r, g, b) {
  const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  const [lr, lg, lb] = [lin(r), lin(g), lin(b)]
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return { L, C: Math.hypot(A, B), H: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 }
}

function hexRgb(hex) {
  let value = hex.slice(1)
  if (value.length <= 4) value = [...value.slice(0, 3)].map((c) => c + c).join("")
  const n = parseInt(value.slice(0, 6), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const pure = ([r, g, b]) => (r === 0 && g === 0 && b === 0) || (r === 255 && g === 255 && b === 255)
const HEX = /(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g
const RGB = /\brgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)/g
const HSL = /\bhsla?\(\s*[\d.]+(?:deg)?[\s,]+(\d+(?:\.\d+)?)%/g
const OKLCH = /\boklch\(\s*([\d.]+%?)\s+([\d.]+)/g

/** The grey literals on one line of code, as [literal, reason]. */
function greys(text) {
  const found = []
  for (const match of text.matchAll(HEX)) {
    const rgb = hexRgb(match[0])
    if (pure(rgb)) continue
    if (oklch(...rgb).C < 0.02) found.push([match[0], "raw grey hex"])
  }
  for (const match of text.matchAll(RGB)) {
    const rgb = [match[1], match[2], match[3]].map(Number)
    if (pure(rgb)) continue
    if (oklch(...rgb).C < 0.02) found.push([match[0] + "…)", "raw grey rgb()"])
  }
  for (const match of text.matchAll(HSL)) {
    if (Number(match[1]) < 3) found.push([match[0] + "…)", "raw grey hsl()"])
  }
  for (const match of text.matchAll(OKLCH)) {
    const L = match[1].endsWith("%") ? parseFloat(match[1]) / 100 : Number(match[1])
    if (Number(match[2]) < 0.02 && L > 0 && L < 1) found.push([match[0] + "…)", "raw grey oklch()"])
  }
  return found
}

/** Blanks out comments, keeping line breaks so line numbers hold. */
function stripComments(source, css) {
  const blank = (text) => text.replace(/[^\n]/g, " ")
  // Block comments in both; line comments only in JS, where a // inside a
  // string (a URL) is left alone by requiring it at a line start or after space.
  let out = source.replace(/\/\*[\s\S]*?\*\//g, blank)
  if (!css) out = out.replace(/(^|\s)\/\/[^\n]*/g, (all, lead) => lead + blank(all.slice(lead.length)))
  return out
}

/** The [start, end) offsets of the scale's :root block in bricks.css. */
function rampBlock(css) {
  const first = css.search(/--grey-(?:light|dark)-\d+\s*:/)
  if (first < 0) return null
  const start = css.lastIndexOf("{", first)
  const end = css.indexOf("}", first)
  return [start, end]
}

const STEPS = { light: 13, dark: 12 }
const MIN_CHROMA = { light: 0.0012, dark: 0.003 }

/** Every step name the scale defines, so a var(--grey-…) can be checked against it. */
const defined = new Set()

function checkRamp(path, css, [start, end]) {
  const lineOf = (offset) => css.slice(0, offset).split("\n").length
  const body = css.slice(start, end)
  const scales = {
    light: new Map(),
    dark: new Map(),
  }
  for (const match of body.matchAll(/--grey-(light|dark)-(\d+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    const [text, theme, step, hex] = match
    const { L, C, H } = oklch(...hexRgb(hex))
    const line = lineOf(start + (match.index ?? 0))
    const n = Number(step)
    defined.add(`--grey-${theme}-${n}`)
    const t = theme
    if (n < 1 || n > STEPS[t] || scales[theme].has(n)) {
      problems.push({
        path,
        line,
        text,
        why: `${theme} steps run 1-${STEPS[t]}, once each`,
      })
    }
    scales[theme].set(n, L)
    if (C < MIN_CHROMA[t] || H < 230 || H > 265) {
      problems.push({
        path,
        line,
        text,
        why: `not tinted: chroma ${C.toFixed(4)}, hue ${H.toFixed(0)} (wants ${MIN_CHROMA[t]}+, 230-265)`,
      })
    }
  }
  for (const theme of ["light", "dark"]) {
    const scale = scales[theme]
    if (scale.size !== STEPS[theme]) {
      problems.push({
        path,
        line: lineOf(start),
        text: `--grey-${theme}-…`,
        why: `has ${scale.size} steps, wants ${STEPS[theme]}`,
      })
      continue
    }
    for (let n = 2; n <= STEPS[theme]; n++) {
      const [a, b] = [scale.get(n - 1) ?? 0, scale.get(n) ?? 0]
      if (theme === "light" ? b >= a : b <= a) {
        problems.push({
          path,
          line: lineOf(start),
          text: `--grey-${theme}-${n}`,
          why: `out of order: ${theme} steps get ${theme === "light" ? "darker" : "lighter"} from 1 to ${STEPS[theme]}`,
        })
      }
    }
  }
}

/**
 * The scales don't share step numbers, so a token :root sets from the light
 * scale has to be set again under .dark, or dark mode shows the light grey.
 */
function checkThemes(path, css) {
  const lineOf = (offset) => css.slice(0, offset).split("\n").length
  const light = new Map()
  const dark = new Set()
  for (const block of css.matchAll(/(^|\n)(:root|\.dark)\s*\{([^}]*)\}/g)) {
    const offset = (block.index ?? 0) + block[0].indexOf("{")
    for (const match of block[3].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      if (block[2] === ".dark") dark.add(match[1])
      else if (/var\(--grey-light-\d+\)/.test(match[2]) && !light.has(match[1]))
        light.set(match[1], lineOf(offset + (match.index ?? 0)))
    }
  }
  for (const [name, line] of light) {
    if (!dark.has(name))
      problems.push({ path, line, text: name, why: "set from the light scale on :root but never under .dark" })
  }
}

function checkFile(full) {
  const path = relative(ROOT, full)
  const css = full.endsWith(".css")
  const source = readFileSync(full, "utf8")
  let code = stripComments(source, css)
  if (full === GLOBALS) {
    const ramp = rampBlock(code)
    if (!ramp) problems.push({ path, line: 1, text: "", why: "no grey scale block (--grey-light-…) found" })
    else {
      checkRamp(path, code, ramp)
      checkThemes(path, code)
      code = code.slice(0, ramp[0]) + code.slice(ramp[0], ramp[1]).replace(/[^\n]/g, " ") + code.slice(ramp[1])
    }
  }
  const raw = source.split("\n")
  code.split("\n").forEach((line, index) => {
    if (raw[index].includes(MARKER) || (index > 0 && raw[index - 1].includes(MARKER))) return
    for (const [literal, why] of greys(line)) {
      problems.push({ path, line: index + 1, text: literal, why: `${why}; use a semantic token or a --grey-… step` })
    }
    for (const match of line.matchAll(/var\(\s*(--grey-[\w-]+)/g)) {
      references.push({ path, line: index + 1, name: match[1] })
    }
  })
}

function walk(full) {
  if (!existsSync(full)) return
  if (statSync(full).isDirectory()) {
    for (const name of readdirSync(full)) {
      if (name === "node_modules" || name.startsWith(".")) continue
      walk(join(full, name))
    }
  } else if (FILES.test(full) && !/\.test\.[jt]sx?$/.test(full)) {
    checkFile(full)
  }
}

const seen = new Set()

// The scale is read from bricks.css even when only one folder is checked.

if (!targets.includes("bricks.css") && existsSync(GLOBALS)) {
  const code = stripComments(readFileSync(GLOBALS, "utf8"), true)
  const ramp = rampBlock(code)
  if (ramp) {
    // Only the step names are wanted here; the scale's own problems are reported on a full run.
    const before = problems.length
    checkRamp(relative(ROOT, GLOBALS), code, ramp)
    problems.length = before
  }
}

for (const target of targets) {
  const full = join(ROOT, target)
  if (!existsSync(full)) {
    console.error(`check:tokens: ${target} doesn't exist`)
    process.exit(2)
  }
  walk(full)
}

for (const { path, line, name } of references) {
  if (!defined.has(name))
    problems.push({
      path,
      line,
      text: name,
      why: "no such grey step; use --grey-light-1 … --grey-light-13 or --grey-dark-1 … --grey-dark-12",
    })
}

const unique = problems.filter((problem) => {
  const key = `${problem.path}:${problem.line}:${problem.text}:${problem.why}`
  return seen.has(key) ? false : (seen.add(key), true)
})

if (unique.length === 0) {
  console.log(`check:tokens: no raw greys in ${targets.join(", ")}`)
} else {
  for (const problem of unique) console.log(`✗ ${problem.path}:${problem.line}  ${problem.text}  ${problem.why}`)
  console.log(`check:tokens: ${unique.length} ${unique.length === 1 ? "problem" : "problems"}`)
  process.exit(1)
}
