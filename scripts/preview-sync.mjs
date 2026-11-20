// Installs every Bricks item into preview/ from the built registry output,
// the same way a consumer would, so the preview shows exactly what ships.
//
// It builds a local copy of the registry (.local/r), serves it on a free port
// for the length of the install, and runs `shadcn add` against it.

import { execSync, spawn } from "node:child_process"
import fs from "node:fs"
import http from "node:http"
import path from "node:path"

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const port = 4455

execSync("node scripts/build-local.mjs", { cwd: root, stdio: "inherit", env: { ...process.env, PORT: String(port) } })

const server = http
  .createServer((req, res) => {
    const file = path.join(root, ".local", decodeURIComponent(new URL(req.url, "http://x").pathname))
    if (!file.startsWith(path.join(root, ".local")) || !fs.existsSync(file)) {
      res.writeHead(404).end()
      return
    }
    res.writeHead(200, { "content-type": "application/json" }).end(fs.readFileSync(file))
  })
  .listen(port)

// The install runs async: a blocking exec would stall this server mid-request.
const registry = JSON.parse(fs.readFileSync(path.join(root, ".local/registry.json"), "utf8"))
const urls = registry.items.map((item) => `http://localhost:${port}/r/${item.name}.json`)
const child = spawn("npx", ["shadcn", "add", ...urls, "--yes", "--overwrite"], {
  cwd: path.join(root, "preview"),
  stdio: "inherit",
})
child.on("exit", (code) => {
  server.close()
  process.exit(code ?? 1)
})
