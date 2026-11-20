// Writes bricks.js: bricks.css as a string, for pages with no build step.
//
// Load it after Tailwind's browser build and it adds bricks.css as a
// <style type="text/tailwindcss">, so the tokens, the type scale and every
// Bricks utility (bg-primary-hover, text-panel-title, rounded-row-group...)
// compile in the page. It also links Inter and Sentient unless the script tag
// has data-fonts="none". No network request is made for the CSS itself.

import fs from "node:fs"
import path from "node:path"

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"))
// The browser build only compiles what's in its style tags, so Tailwind itself
// is imported here. Pages using bricks.js shouldn't import it again.
const css = '@import "tailwindcss";\n\n' + fs.readFileSync(path.join(root, "bricks.css"), "utf8")

const js = `/*! Bricks ${pkg.version} | MIT | https://github.com/ShoreditchDesignStudio/bricks */
/* Generated from bricks.css by scripts/build-cdn.mjs. Don't edit by hand. */
(function () {
  var script = document.currentScript;
  var css = ${JSON.stringify(css)};
  var head = document.head || document.getElementsByTagName("head")[0];

  if (!script || script.getAttribute("data-fonts") !== "none") {
    [
      "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap",
      "https://api.fontshare.com/v2/css?f[]=sentient@400,500&display=swap"
    ].forEach(function (href) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      head.appendChild(link);
    });
  }

  var style = document.createElement("style");
  style.type = "text/tailwindcss";
  style.setAttribute("data-bricks", "${pkg.version}");
  style.textContent = css;
  head.appendChild(style);
})();
`

fs.writeFileSync(path.join(root, "bricks.js"), js)
console.log(`bricks.js: ${(js.length / 1024).toFixed(1)} KB`)
