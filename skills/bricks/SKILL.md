---
name: bricks
description: Build a tool, internal app, prototype or artifact in Shoreditch Design's Bricks style (shadcn/ui on Bricks tokens - monochrome surfaces, one 4px radius, one 32px control height, Inter and Sentient, light and dark). Use when asked for something "in Bricks", "Bricks-style", "in the Hub style", or styled like Shoreditch Design's tools, in a repo or in a Claude.ai artifact.
---

# Building with Bricks

Bricks is shadcn/ui with Shoreditch Design's tokens on top. The rules live in `DESIGN.md` at https://github.com/ShoreditchDesignStudio/bricks. Read it before you design a screen, and follow it over any habit of your own. If you can't fetch it, the essentials are below.

## Pick the route

| Where you're building | Use |
| --- | --- |
| A React repo with Tailwind v4 and shadcn | The registry (below) |
| A Tailwind v4 project without shadcn | `bricks.css`, imported after Tailwind |
| A Claude.ai HTML artifact, CodePen, a single HTML file | `bricks.js` from jsDelivr, with Tailwind's browser build |
| Plain CSS, no Tailwind | `bricks.css` as a `<link>`, then `var(--token)` in your own CSS |

### In a repo: the registry

```bash
npx shadcn@latest init            # if the project has no components.json yet
npx shadcn@latest add https://raw.githubusercontent.com/ShoreditchDesignStudio/bricks/main/public/r/bricks.json --overwrite
npx shadcn@latest add https://raw.githubusercontent.com/ShoreditchDesignStudio/bricks/main/public/r/data-rows.json
```

- The base `bricks` item installs the tokens, `cn()` and the core components. Add others by name: `select`, `switch`, `checkbox`, `radio-group`, `slider`, `popover`, `dropdown-menu`, `sonner`, `page-header`, `page-footer`, `detail-panel`, `info-blocks`, `data-rows`, `state-message` and more (see `registry.json`).
- Use the installed components. Don't hand-roll a button, a segmented control or a row list.
- Load the fonts (see Fonts).

### In an artifact: the CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.3.5"></script>
<script src="https://cdn.jsdelivr.net/gh/ShoreditchDesignStudio/bricks@v0.1.0/bricks.js"></script>
```

- Put both in `<head>`, in that order. `bricks.js` compiles the Bricks tokens into the page and links Inter and Sentient. Don't add another `@import "tailwindcss"`.
- Pin the tag. Never use `@main` (cached for hours).
- Then write Tailwind classes against the tokens. The recipes below match the registry components exactly.
- For dark mode, toggle `dark` on `<html>`.

## The rules that matter most

- **Monochrome.** Ink on grey surfaces. The only colours: coral (`accent-brand`) for a selected card's ring and a field's focus edge, a rare peach chip, red for error text and for the one button that deletes.
- **Tokens, never hex.** `bg-background`, `bg-card`, `bg-listing`, `bg-field`, `text-muted-foreground`, `border-border`. No `bg-white`, `bg-black`, `bg-[#...]`.
- **One radius**, 4px (`rounded-md`). Row groups are the one exception, at 6px (`rounded-row-group`).
- **One control height: 32px.** Buttons, selects, search fields and the segmented control are all `h-8`. Icon actions in rows and panel headers are 28px (`size-7`). Never put `h-*` or `py-*` on a Button.
- **Type scale only:** `text-page-title` (with `font-display`), `text-panel-title`, `text-section`, `text-body`, `text-ui`, `text-meta`, `text-eyebrow`. `tabular-nums` for numbers.
- **Calls to action:** one primary per header, panel or state, and it sits last on the right. Secondary is `outline`; dense toolbars use `ghost`. Destructive (solid red) only on the confirm button in a dialog.
- **Layout:** a page header (breadcrumb, display-face title, controls on the right), a `data-listing` content area on `bg-listing`, settings in a 288px left rail, details in a 320px right panel. Panels pad 20px and space groups 24px apart with a hairline between.
- **Lists are row groups:** one bordered block, 48px rows split by a divider, column headers outside in `text-meta`. Never a card per row.
- **States:** empty, error and locked screens are centred both ways, a title, at most one short line and one primary action with no icon. Errors read "Couldn’t load …" with **Try again**.
- **Copy:** terse, British English, sentence case, curly apostrophes, buttons are verbs. Don't explain implementation.
- **Check light and dark.**

## Class recipes (for artifacts and plain HTML)

These are what the registry components render, so artifact output matches repo output.

```html
<!-- App frame: ground behind, the page surface raised on it -->
<body class="bg-ground p-2">
  <main class="flex min-h-[calc(100vh-1rem)] flex-col overflow-hidden rounded-md border border-surface-edge bg-background shadow-sm">

<!-- Page header -->
<header class="border-b px-4">
  <nav class="mt-3 flex h-7 items-center gap-1 text-meta text-muted-foreground">Tools <span>›</span> <span class="text-foreground">Converter</span></nav>
  <div class="mt-3 flex min-h-8 flex-wrap items-center justify-between gap-4 pb-5">
    <h1 class="font-display text-page-title">Converter</h1>
    <div class="flex items-center gap-2"><!-- ghost, outline, then primary --></div>
  </div>
</header>

<!-- Buttons: 32px, primary last -->
<button class="inline-flex h-8 items-center gap-1.5 rounded-md border border-transparent px-3 text-sm font-medium hover:bg-accent active:bg-row-pressed">Clear</button>
<button class="inline-flex h-8 items-center gap-1.5 rounded-md border border-input bg-button-outline px-3 text-sm font-medium hover:bg-accent active:bg-row-pressed">Add images</button>
<button class="inline-flex h-8 items-center gap-1.5 rounded-md border border-transparent bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed">Download</button>
<button class="inline-flex h-8 items-center gap-1.5 rounded-md border border-transparent bg-destructive-fill px-3 text-sm font-medium text-white hover:bg-destructive-fill-hover">Delete</button>
<!-- Focus, on every button: focus-visible:ring-2 focus-visible:ring-ring-control focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none -->

<!-- Text field: filled, no stroke, coral on focus -->
<input class="h-8 w-64 rounded-md border border-transparent bg-field px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-accent-brand focus-visible:ring-1 focus-visible:ring-accent-brand" placeholder="Search">

<!-- Segmented control: 32px track, 24px thumbs -->
<div class="inline-flex items-center gap-1 rounded-md bg-segment-track p-1 shadow-[inset_0_0_0_1px_var(--color-segment-track-edge)]">
  <button class="h-6 rounded-sm border border-segment-thumb-border bg-segment-thumb px-4 text-sm font-medium shadow-segment-thumb">List</button>
  <button class="h-6 rounded-sm border border-transparent px-4 text-sm font-medium text-muted-foreground hover:bg-segment-hover hover:text-foreground">Grid</button>
</div>

<!-- Badges -->
<span class="inline-flex rounded-md px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground">Default</span>
<span class="inline-flex rounded-md border border-border px-2 py-0.5 text-xs font-medium">Outline</span>
<span class="inline-flex rounded-md px-2 py-0.5 text-xs font-medium bg-chip-peach text-chip-peach-foreground">No conversion</span>

<!-- Content area and a row group -->
<section data-listing class="flex-1 overflow-y-auto bg-listing p-4">
  <div class="flex h-8 items-center gap-4 pl-[11px] pr-[7px] text-meta text-muted-foreground"><div class="flex-1">Name</div><div class="w-20">Size</div></div>
  <ul class="flex flex-col overflow-hidden rounded-row-group border border-row-group-edge bg-row-group">
    <li class="flex h-12 items-center gap-4 border-b border-row-group-divider pl-2.5 pr-1.5 tabular-nums last:border-b-0 hover:bg-row-group-hover"><div class="min-w-0 flex-1 truncate">Brand guidelines</div><div class="w-20 text-muted-foreground">4.2 MB</div></li>
    <li class="flex h-12 items-center gap-4 border-b border-row-group-divider bg-row-group-selected pl-2.5 pr-1.5 last:border-b-0">…selected…</li>
  </ul>
</section>

<!-- Details panel, 320px on the right -->
<aside class="flex w-80 shrink-0 flex-col border-l bg-background">
  <div class="flex items-start gap-2 border-b py-3 pr-3 pl-5"><div class="min-w-0 flex-1"><h2 class="truncate text-panel-title">Homepage hero</h2><div class="text-meta text-muted-foreground">PNG · 1.1 MB</div></div></div>
  <div class="flex-1 overflow-y-auto p-5"><!-- groups: border-t py-6, first without border --></div>
  <div class="flex flex-col gap-2 border-t p-5"><!-- outline, then primary, full width --></div>
</aside>

<!-- Empty state, centred in the content area -->
<div class="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
  <h2 class="text-panel-title">No files yet</h2>
  <p class="text-body text-muted-foreground">Add files to see them here.</p>
  <button class="… primary button classes …">Add files</button>
</div>

<!-- Dialog card (over a bg-black/30 dark:bg-black/60 overlay) -->
<div class="flex w-[calc(100%-2rem)] max-w-[440px] flex-col gap-5 rounded-md border bg-popover p-5 text-popover-foreground shadow-md">
  <div class="flex flex-col gap-2"><h2 class="text-panel-title">Delete 3 files?</h2><p class="text-body text-muted-foreground">You can restore them later.</p></div>
  <div class="flex justify-end gap-2"><!-- Cancel (outline), then Delete (destructive) --></div>
</div>
```

Fields inside a dialog, sheet or popover (`data-slot="dialog-content"` and friends) take the lifted `--popover-field` fill automatically. In plain HTML, add `bg-popover-field` yourself.

## Fonts

- Inter (OFL): Google Fonts with the `opsz` axis, `family=Inter:opsz,wght@14..32,100..900`; in Next.js, `next/font/google` with `axes: ["opsz"], variable: "--font-inter"`.
- Sentient (Fontshare): link `https://api.fontshare.com/v2/css?f[]=sentient@400,500&display=swap`. Never download, commit or inline its files.
- `bricks.js` links both for you.

## Before you hand it over

- One primary per header, panel and state, last in its row.
- Every control in a row is 32px; no stray `h-*` on buttons.
- No hex colours in components; every new colour is a token with light and dark values.
- Looked at it in light and dark, and at a phone width.
