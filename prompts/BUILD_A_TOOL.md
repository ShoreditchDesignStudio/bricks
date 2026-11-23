# Build a Hub tool

You’re building a tool for the Hub, Shoreditch Design’s internal toolkit. The studio’s designers, developers and producers use it every day, mostly on laptops and sometimes on phones. Hub tools are small and focused: one job, done well, with nothing to set up.

## The tool

{{idea}}

Before you write any code, confirm three things with me: the tool’s name, a one-line description, and what the main screen shows.

## Build it with Bricks

Bricks is the Hub’s design system: shadcn/ui on the studio’s tokens. Use it for every part of the interface, and don’t hand-roll a component Bricks already has.

- **In a Claude artifact:** load Tailwind’s browser build, then [cdn.jsdelivr.net/gh/ShoreditchDesignStudio/bricks@{{ref}}/bricks.js](https://cdn.jsdelivr.net/gh/ShoreditchDesignStudio/bricks@{{ref}}/bricks.js), both in the head.
- **In a code project:** npx shadcn@latest add [raw.githubusercontent.com/ShoreditchDesignStudio/bricks/main/public/r/bricks.json](https://raw.githubusercontent.com/ShoreditchDesignStudio/bricks/main/public/r/bricks.json), then add other components by name from the registry.
- Read the Bricks [DESIGN.md](https://github.com/ShoreditchDesignStudio/bricks/blob/main/DESIGN.md) and [SKILL.md](https://github.com/ShoreditchDesignStudio/bricks/blob/main/skills/bricks/SKILL.md) before you design a screen, and follow them over your own habits.

## Design rules

- **Tokens, never raw colours.** Use the Bricks utilities, such as bg-background, bg-listing, text-muted-foreground and border-border. No hex, rgb(), hsl() or oklch() values, and no bg-white or bg-black.
- **Monochrome.** Ink on grey surfaces. Coral is only for the focus ring and a selected item; red is only for error text and a destructive confirm.
- **One control height: 32px.** Buttons, inputs, selects and segmented controls use the Bricks sizes. Never put h-, py- or size- classes on a Button.
- **Calls to action.** One primary action per header, panel or state, placed last on the right. Secondary actions are outline; dense toolbars use ghost.
- **Layout.** A page header with the title and its actions, content on the listing surface, settings in a left rail and details in a right panel, where the tool needs them.
- **Type and shape.** The Bricks type scale only, tabular figures for numbers, and one 4px radius.
- **Light and dark.** Build in dark first, then check every screen in light.
- **Copy.** British English, sentence case and short. Buttons are verbs. Don’t explain how the tool works under the hood.

## Quality

- **Accessible.** Every control works by keyboard with a visible focus ring, icon-only buttons have an aria-label, and text meets WCAG AA contrast.
- **Responsive.** Works at 1440px and 375px wide, with no horizontal scroll.
- **Every state.** Design the empty, loading and error states, not only the happy path.
- **Private by default.** No secrets, API keys or .env files. No calls to external services unless the tool needs them; if it does, name each one and say why in the README.

## What to hand back

One .zip holding a single tool folder, with everything inside it:

- tools/<tool-name>/, in kebab-case, for example tools/contrast-checker/
- page.tsx from a code project, or index.html from an artifact
- screenshot.png of the tool in use, 1440px wide
- README.md: what it does, who it’s for, how to use it, and any external services it calls

## Before you hand it back

Run this checklist and fix anything that fails. The Hub runs the same checks when the .zip is uploaded.

- The .zip opens and holds exactly one folder under tools/, named in kebab-case.
- That folder has page.tsx or index.html, plus screenshot.png and README.md.
- Every colour is a Bricks token: no hex, rgb(), hsl() or oklch() values and no bg-white or bg-black in components.
- No h-, py- or size- classes on any Button.
- No .env files, API keys, tokens or passwords anywhere in the .zip.
- Every screen checked in light and dark, at 1440px and 375px.
- Finish with two lines: what you built, and anything you couldn’t do.
