// Builds a copy of the registry whose items point at a local server, for
// testing installs before anything is pushed:
//
//   npm run build:local            # writes .local/r, base http://localhost:4455/r
//   npx serve .local -l 4455       # or any static server
//   npx shadcn@4.23.0 add http://localhost:4455/r/bricks.json
//
// Nothing here is committed; .local is gitignored.

import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const port = process.env.PORT ?? "4455"
const base = `http://localhost:${port}/r`
fs.mkdirSync(path.join(root, ".local"), { recursive: true })
const out = path.join(root, ".local/registry.json")

execSync(`node scripts/build.mjs`, {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, BRICKS_URL: base, BRICKS_REGISTRY_OUT: out },
})
execSync(`npx shadcn build ${out} --output .local/r`, { cwd: root, stdio: "inherit" })
console.log(`Local registry in .local/r, served at ${base}`)
