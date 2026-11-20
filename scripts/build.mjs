// Writes registry.json from bricks.css and the files in registry/bricks.
//
// bricks.css is the one source for tokens: its :root block becomes the theme
// item's cssVars.light, .dark becomes cssVars.dark, both @theme blocks become
// cssVars.theme, and every other rule goes into css. Each component's npm and
// registry dependencies are read from its imports, so nothing is listed twice.
//
// BRICKS_URL sets where the registry is served (default: the GitHub repo's
// main branch). Items point at each other by full URL, which is how shadcn
// resolves dependencies inside a custom registry.

import fs from "node:fs"
import path from "node:path"
import postcss from "postcss"

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const BASE = (process.env.BRICKS_URL ?? "https://raw.githubusercontent.com/ShoreditchDesignStudio/bricks/main/public/r").replace(/\/$/, "")
const OUT = process.env.BRICKS_REGISTRY_OUT ?? path.join(root, "registry.json")
const url = (name) => `${BASE}/${name}.json`

// ---- Theme item, from bricks.css -------------------------------------------

const css = postcss.parse(fs.readFileSync(path.join(root, "bricks.css"), "utf8"))
const cssVars = { theme: {}, light: {}, dark: {} }
const extraCss = {}

const declsOf = (node) => {
  const out = {}
  node.each((child) => {
    if (child.type === "decl") out[child.prop] = child.value.replace(/\s+/g, " ").trim()
  })
  return out
}
const varsOf = (node) =>
  Object.fromEntries(Object.entries(declsOf(node)).map(([k, v]) => [k.replace(/^--/, ""), v]))
const rulesOf = (node) => {
  const out = {}
  node.each((child) => {
    if (child.type === "rule") out[child.selector.replace(/\s*\n\s*/g, " ")] = declsOf(child)
  })
  return out
}

css.each((node) => {
  if (node.type === "atrule" && node.name === "theme") Object.assign(cssVars.theme, varsOf(node))
  else if (node.type === "atrule" && node.name === "custom-variant") return // shadcn init adds it
  else if (node.type === "atrule" && node.name === "layer") extraCss[`@layer ${node.params}`] = rulesOf(node)
  else if (node.type === "rule" && node.selector === ":root") Object.assign(cssVars.light, varsOf(node))
  else if (node.type === "rule" && node.selector === ".dark") Object.assign(cssVars.dark, varsOf(node))
  else if (node.type === "rule") extraCss[node.selector.replace(/\s*,\s*\n?\s*/g, ", ")] = declsOf(node)
})

// ---- Component items, from their imports ------------------------------------

const PINS = {
  "radix-ui": "radix-ui@^1.4.3",
  "@phosphor-icons/react": "@phosphor-icons/react@^2.1.10",
  "class-variance-authority": "class-variance-authority@^0.7.1",
  sonner: "sonner@^2.0.8",
  "next-themes": "next-themes@^0.4.6",
}

const TITLES = {
  "state-message": "State message",
  "detail-panel": "Details panel",
  "info-blocks": "Information blocks",
  "data-rows": "Data rows",
  "page-header": "Page header",
  "page-footer": "Page footer",
  "toggle-group": "Segmented control",
  "dropdown-menu": "Dropdown menu",
  "radio-group": "Radio group",
  "scroll-area": "Scroll area",
  sonner: "Toaster",
}

const DESCRIPTIONS = JSON.parse(fs.readFileSync(path.join(root, "registry/descriptions.json"), "utf8"))

const titleCase = (name) => name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ")

function scan(file) {
  const src = fs.readFileSync(path.join(root, file), "utf8")
  const deps = new Set()
  const reg = new Set([url("utils"), url("theme")])
  for (const [, spec] of src.matchAll(/from\s+["']([^"']+)["']/g)) {
    const m = spec.match(/^@\/registry\/bricks\/(ui|blocks)\/(.+)$/)
    if (m) reg.add(url(m[2]))
    else if (spec.startsWith("@/") || spec === "react") continue
    else {
      const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]
      deps.add(PINS[pkg] ?? pkg)
    }
  }
  if (/\banimate-(in|out)\b/.test(src)) deps.add("tw-animate-css")
  return { dependencies: [...deps].sort(), registryDependencies: [...reg] }
}

const items = []

items.push({
  name: "bricks",
  type: "registry:style",
  title: "Bricks",
  description:
    "Everything to start a Bricks project: the tokens, the cn() helper, and the core components (button, input, badge, segmented control, dialog, sheet, empty state, separator, tooltip).",
  dependencies: ["tw-animate-css", PINS["@phosphor-icons/react"]],
  registryDependencies: ["utils", "theme", "button", "input", "badge", "toggle-group", "dialog", "sheet", "empty", "separator", "tooltip", "skeleton"].map(url),
  docs: "Bricks expects Inter and Sentient. See https://github.com/ShoreditchDesignStudio/bricks#fonts to load them.",
})

items.push({
  name: "theme",
  type: "registry:theme",
  title: "Bricks theme",
  description: "Bricks' tokens: colours for light and dark, the type scale, one 4px radius, elevation, and the scoped rules for menus, dialogs and toasts.",
  cssVars,
  css: extraCss,
})

items.push({
  name: "utils",
  type: "registry:lib",
  title: "cn()",
  description: "cn() with tailwind-merge taught Bricks' type tokens, so text-ui and text-muted-foreground don't cancel out.",
  dependencies: ["clsx", "tailwind-merge"],
  files: [{ path: "registry/bricks/lib/utils.ts", type: "registry:lib" }],
})

for (const [dir, type] of [["ui", "registry:ui"], ["blocks", "registry:component"]]) {
  for (const file of fs.readdirSync(path.join(root, "registry/bricks", dir)).sort()) {
    const name = file.replace(/\.tsx?$/, "")
    const rel = `registry/bricks/${dir}/${file}`
    const { dependencies, registryDependencies } = scan(rel)
    items.push({
      name,
      type,
      title: TITLES[name] ?? titleCase(name),
      description: DESCRIPTIONS[name] ?? "",
      ...(dependencies.length ? { dependencies } : {}),
      registryDependencies: registryDependencies.filter((d) => d !== url(name)),
      files: [{ path: rel, type }],
    })
  }
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "bricks",
  homepage: "https://github.com/ShoreditchDesignStudio/bricks",
  items,
}

fs.writeFileSync(OUT, JSON.stringify(registry, null, 2) + "\n")
console.log(`registry.json: ${items.length} items, base ${BASE}`)
