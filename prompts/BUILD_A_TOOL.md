# Build a Hub tool

You’re building a tool for the Shoreditch Design Hub, the studio’s own toolkit.

## What to build

{{idea}}

## How to build it

- Build with **Bricks** UI only.
- **In a Claude artifact:** load Tailwind’s browser build and [cdn.jsdelivr.net/gh/ShoreditchDesignStudio/bricks@{{ref}}/bricks.js](https://cdn.jsdelivr.net/gh/ShoreditchDesignStudio/bricks@{{ref}}/bricks.js)
- **In a code project:** npx shadcn@latest add [raw.githubusercontent.com/ShoreditchDesignStudio/bricks/main/public/r/bricks.json](https://raw.githubusercontent.com/ShoreditchDesignStudio/bricks/main/public/r/bricks.json)
- Follow the Bricks [DESIGN.md](https://github.com/ShoreditchDesignStudio/bricks/blob/main/DESIGN.md) and [SKILL.md](https://github.com/ShoreditchDesignStudio/bricks/blob/main/skills/bricks/SKILL.md). Dark first, then check light.

## What to hand back

- One tool folder, zipped, with a screenshot.png: tools/<tool-name>/ holding page.tsx (or index.html from an artifact)
- No .env files, keys or secrets
