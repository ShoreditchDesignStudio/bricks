# Bricks design rules

The rules every Bricks screen follows. `bricks.css` and the components in `registry/bricks/` are the source of truth. If the code and this file disagree, fix one of them; don't let them drift.

Audience: designers, developers and Claude, building a tool or an internal app with Bricks.

## Principles

- **One shell, many tools.** A page is a header, a content area, and optionally a settings rail on the left and a details panel on the right. A new tool shouldn't need a new layout primitive.
- **Tokens, not values.** Every colour, radius, shadow and type style comes from `bricks.css`. A reskin changes token values only.
- **Monochrome by default.** Ink on cool grey surfaces. Colour is rare and every use is named below.
- **Coral is the signature, and it's rare.** It marks two things only: the keyboard focus ring and the selected card or row (see The coral rule).
- **Quiet copy.** A short title and at most one short line.

## Theme

- Every token has a light value on `:root` and a dark value on `.dark`. **Check every screen in both.**
- Dark mode is a `dark` class on `<html>` (`@custom-variant dark (&:is(.dark *))`). Set it before first paint (a small inline script in `<head>`) so there's no flash.
- Pick one default for your product and stick to it. `next-themes` works; so does a two-line script.

## Colour tokens

Use the Tailwind utility (`bg-listing`, `text-muted-foreground`), never the hex.

### Cool neutrals

The greys are one blue-grey family (OKLCH hue ~248) at two strengths: light carries C 0.0017 on backgrounds and borders (about a third of dark's ~0.009), because a tint reads far stronger at high lightness and next to pure white. Pure white and pure black stay pure.

| Token | Light | Dark |
| --- | --- | --- |
| `--ground` | `--grey-light-4` `#ecedee` | `--grey-dark-1` `#0c0f13` |
| `--surface` | `#ffffff` | `--grey-dark-2` `#14171b` |
| `--listing` | `--grey-light-3` `#f1f2f3` | `--surface` |
| `--nested` | `--grey-light-3` `#f1f2f3` | `--grey-dark-4` `#23272b` |
| `--card` | `#ffffff` (`--surface`) | `--nested` |
| `--row-group` | `#ffffff` (`--surface`) | `--grey-dark-3` `#1c1f23` |
| `--field` | `#ffffff`, edged `--grey-light-8` | `--grey-dark-4`, no edge |
| `--hairline` | `--grey-light-7` `#d9dadb` | `--grey-dark-6` `#3d4145` |
| `--ink` | `--grey-light-13` `#101214` | `--grey-dark-12` `#e0e5eb` |
| `--ink-secondary` | `--grey-light-12` `#57595b` | `--grey-dark-11` `#9fa4a9` |

### Greys

Every grey lives once, in the grey scale near the top of `bricks.css`: one scale per theme, each built for how that theme makes depth. They don't mirror each other step for step.

**Light is white content on a tinted page.** The page (the listing) is tinted, and content sits on it in pure white: rows and row groups, cards, text fields, popovers and the details panel. Separation comes from hairlines on white and the tinted page, not from fills. Hover and selected on white are the faintest steps, a breath off white toward the page's tint, so they never read as a different, darker grey.

| Step | Role | Hex | L | Tokens |
|---|---|---|---|---|
| `--grey-light-1` | Row, card hover on white | `#f9fafb` | 0.985 | `--row-group-hover`, `--listing-row` |
| `--grey-light-2` | Row, card selected on white | `#f5f6f7` | 0.973 | `--row-group-selected` |
| `--grey-light-3` | Page; control hover on white | `#f1f2f3` | 0.961 | `--listing`, `--nested` (`--muted`, `--thumb`), `--row` (`--accent`, `--secondary`), `--popover-row`, `--segment-track` |
| `--grey-light-4` | Ground; control pressed | `#ecedee` | 0.946 | `--ground`, `--row-pressed`, `--segment-hover` |
| `--grey-light-5` | Ground hover; row divider | `#e4e5e6` | 0.921 | `--ground-row`, `--row-group-divider` |
| `--grey-light-6` | Ground pressed, selected | `#dddedf` | 0.900 | `--ground-pressed` |
| `--grey-light-7` | Hairline | `#d9dadb` | 0.888 | `--hairline` (`--border`, `--input`), `--row-group-edge`, `--segment-thumb-border` |
| `--grey-light-8` | Input, field edge | `#d2d3d4` | 0.866 | `--field-edge`, `--surface-edge`; dark's `--primary-hover` |
| `--grey-light-9` | Strong border | `#bcbec0` | 0.801 | `--switch-edge`; dark's `--primary-pressed` |
| `--grey-light-10` | Solid | `#a6a8aa` | 0.731 | – |
| `--grey-light-11` | Hovered solid | `#999b9d` | 0.688 | – |
| `--grey-light-12` | Secondary text | `#57595b` | 0.463 | `--ink-secondary`, `--edge-strong` |
| `--grey-light-13` | Text | `#101214` | 0.181 | `--ink` |

**Dark builds depth with steps.** Rows sit a step lighter than what's under them, after Radix Colors.

| Step | Role | Hex | L | Tokens |
|---|---|---|---|---|
| `--grey-dark-1` | App background | `#0c0f13` | 0.167 | `--ground`, `--button-outline`, `--thumb`, `--segment-track` |
| `--grey-dark-2` | Subtle background | `#14171b` | 0.203 | `--surface`, `--listing`, `--ink-inverse` |
| `--grey-dark-3` | Element, row | `#1c1f23` | 0.238 | `--row-group`, `--segment-hover` |
| `--grey-dark-4` | Hovered element | `#23272b` | 0.270 | `--row`, `--nested`, `--popover-surface`, `--field`, `--ground-row`, `--row-group-hover`, `--listing-row` |
| `--grey-dark-5` | Pressed, selected element | `#2f3337` | 0.319 | `--row-pressed`, `--row-group-selected`, `--popover-row`, `--ground-pressed`, `--popover-field`, `--segment-thumb`, `--toast`; light's `--primary-hover` |
| `--grey-dark-6` | Hairline | `#3d4145` | 0.373 | `--hairline`, `--surface-edge`, `--segment-thumb-border`; light's `--primary-pressed` |
| `--grey-dark-7` | Border, input | `#4f5357` | 0.440 | `--input` |
| `--grey-dark-8` | Strong border | `#5a5e63` | 0.480 | `--switch-edge` |
| `--grey-dark-9` | Solid | `#71767b` | 0.563 | – |
| `--grey-dark-10` | Hovered solid | `#82878b` | 0.621 | – |
| `--grey-dark-11` | Low-contrast text | `#9fa4a9` | 0.716 | `--ink-secondary`, `--edge-strong` |
| `--grey-dark-12` | High-contrast text | `#e0e5eb` | 0.920 | `--ink` |

- **Every grey token is set twice**: `--grey-light-N` on `:root`, `--grey-dark-N` under `.dark`. The step numbers don't line up across themes, so nothing carries over.
- **Pick the step by its role, not its look.** In light, content is white; hover is 1, selected 2; the page is 3; text is 12 or 13; hairlines 7, field edges 8, a strong edge 9. In dark, a row is 3, its hover 4, pressed or selected 5.
- **Light: white on tint. Dark: a step lighter.** Light rows, cards and fields are white on the tinted listing, split by hairlines, with hover and selected keeping to the page's temperature. Dark rows sit lighter than the surface (3 on 2) and hover and selected keep climbing (4, 5).
- **A token that has to stay one theme's grey names the other scale.** The primary button is ink, so light's hover and pressed take `--grey-dark-5` and `--grey-dark-6`, and dark's take `--grey-light-8` and `--grey-light-9`.
- **No new steps.** A new token aliases an existing semantic token or a step. If nothing fits, the scale is wrong, and that's a design change, not a new grey.
- **No greys in components either.** No `bg-[#…]`, `rgb()` or inline-style greys. Content that has to stay flat whatever the theme carries a `tokens-allow` comment on the line.
- Pure `#ffffff` and `#000000` (and their alpha overlays), coral, peach and the destructive reds aren't greys, so they stay as they are. White is light's content surface.
- `npm run check:tokens` (`scripts/check-tokens.mjs`, run by `npm run check`) fails on any raw grey in `bricks.css`, `registry/bricks` or the preview, on a scale without exactly its steps (light 1 to 13, dark 1 to 12), on a step that's untinted (hue 230 to 265; chroma 0.0012+ in light, 0.003+ in dark) or out of order, on a light-scale token `:root` sets that `.dark` never sets again, and on a `var(--grey-…)` naming a step that doesn't exist. Point it at your own folder too: `node scripts/check-tokens.mjs path/to/tool`.

### Base palette

| Token | Role |
| --- | --- |
| `--ground` | The sunken layer behind the page: app background, sidebar |
| `--surface` | The raised page surface (`--background`) |
| `--nested` | Wells inside the surface (`--muted`, and `--card` in dark) |
| `--row` | Hover step on the surface (`--accent`, `--secondary`) |
| `--row-pressed` | Pressed step on the surface |
| `--ground-row` / `--ground-pressed` | Hover and pressed steps on the ground |
| `--ink` / `--ink-inverse` / `--ink-secondary` | Text: primary, on primary, secondary (`--muted-foreground`) |
| `--hairline` | Borders and inputs (`--border`, `--input`) |
| `--surface-edge` | The page surface's edge against the ground |
| `--listing` / `--listing-row` | The content area under rows and tiles, and its hover step |
| `--field` / `--field-edge` | Text fields: white with an edge in light, filled with no edge in dark |
| `--popover-field` | Fields on a dialog, sheet or popover. White in light; lifted a step in dark, where `--field` matches `--popover-surface` |
| `--popover-surface` | Menus and popovers |
| `--popover-row` | Hover step on menu and select items |

Scoped rules in `bricks.css` do the rescoping for you: inside `[data-listing]` the hover step becomes `--listing-row`, menus and select lists take `--popover-row`, and fields on a dialog, sheet or popover take `--popover-field`.

### State ladder

Every interactive surface uses the same three steps: rest, hover (`--row` or `--ground-row`), pressed (`--row-pressed` or `--ground-pressed`).

- Selected rows sit on the hover step. Selected controls sit on the pressed step.
- Primary buttons have their own steps: `--primary`, `--primary-hover`, `--primary-pressed`.
- Focus rings are the signature coral (`--ring-signature`; `--ring` and `--ring-control` both point at it), on buttons, toggles, fields and rows alike. They show for keyboard users only.

### Named colour uses

Each of these has one job. Don't borrow them for anything else.

| Token | Only used for |
| --- | --- |
| `--signature` (coral), via `--ring-signature` and `--ring-selected` | The coral rule below. `--accent-brand` is a v0.1 alias for it |
| `--edge-strong` | A firm monochrome edge that isn't focus: a selected swatch, a drop hint, the slider's hover halo |
| `--chip-peach`, `--chip-peach-foreground` | A rare peach chip (`Badge variant="peach"`), for one standout status |
| `--destructive` | Error text. Dark uses a lighter red for contrast |
| `--destructive-fill` (`-hover`, `-pressed`) | The solid red behind destructive buttons, with white text. Never on the trigger that opens a confirm |

### The coral rule

Coral (`--signature`: `#e8452c` light, `#ff6955` dark) is the signature. It appears in exactly two places, and nothing else turns coral:

1. **The keyboard focus ring** (`--ring-signature`), on every control: buttons, toggles, fields, rows.
2. **The selected card or row**: a 1px inset ring (`SELECTED_RING` in `data-rows`, on `--ring-selected`). Rows in `DataRows` take it on top of the selected fill.

- Light uses the deeper coral so a 1–2px line clears 3:1 against white, the listing and every hover step; dark uses the brighter one.
- **Don't** use coral for a hover, a badge, a link, an icon or an illustration frame. The peach chip (`--chip-peach`) is a separate, rarer use.

### Component tokens

| Group | Tokens |
| --- | --- |
| Segmented controls | `--segment-track`, `--segment-track-edge`, `--segment-hover`, `--segment-thumb`, `--segment-thumb-border`, `--segment-thumb-shadow` |
| Row groups | `--row-group`, `--row-group-hover`, `--row-group-selected`, `--row-group-edge`, `--row-group-divider`, `--row-group-radius` |
| Tiles | `--tile-border`, `--thumb`, `--thumb-edge` |
| Toasts | `--toast`, `--toast-border`, `--elevation-toast` |
| Switches, checkboxes and radios | `--switch-edge` |
| Outline buttons | `--button-outline` |
| Text fields | `--field`, `--field-edge`, `--popover-field` |

**Do** add a new token, with a light and a dark value, when nothing fits.
**Don't** write a hex, `bg-white`, `bg-black` or `bg-[...]` colour in a component. The exception is content that must stay fixed whatever the theme, such as a logo previewed on pure white or pure black.

## Type

Two faces:

- **Inter** for the UI (`--font-sans`). The variable file, with `opsz` forced to the display cut (`font-variation-settings: "opsz" 32` on `html`).
- **Sentient** for display (`--font-display`, `font-display`). It's the voice, so it's used more than once a page, but only for names and numbers, never for body copy or controls:
  - page titles and illustrated state titles (`font-display text-page-title`);
  - details panel titles, item heads in a panel (`MediaHead`) and icon state titles (`text-display-panel`);
  - section headings on library and settings pages (`text-display-section`);
  - big counts, such as a library's total (`text-display-number`).
- Everything else, body and UI, is Inter.

See the README for how to load them. Neither is bundled.

Each `--text-*` token becomes a `text-*` utility that carries its size, line height, weight and tracking.

| Utility | Size / line | Weight | Use |
| --- | --- | --- | --- |
| `text-page-title` | 24 / 30 | 500 | Page title (with `font-display`), illustrated state titles |
| `text-panel-title` | 14 / 20 | 650 | Dialog and sheet titles, compact Inter titles |
| `text-section` | 13 / 20 | 650 | Section headings |
| `text-body` | 13 / 20 | 450 | Body copy, the default on `body` |
| `text-ui` | 13 / 20 | 550 | Labels on controls and rows |
| `text-meta` | 12 / 16 | 450 | Secondary detail, column headers, breadcrumbs |
| `text-eyebrow` | 10 / 12 | 550, +0.08em | Uppercase labels: group labels, bylines, Soon |
| `text-display-panel` | 18 / 24 | 500, -0.005em, Sentient | Details panel titles (up to two lines), item heads, icon state titles |
| `text-display-section` | 16 / 22 | 500, Sentient | Section headings on library and settings pages |
| `text-display-number` | 40 / 40 | 400, -0.02em, Sentient, tabular | Big counts |

- `text-sm` and `text-xs` sit on the same scale as `text-body` and `text-meta`, so shadcn primitives stay on it.
- The `text-display-*` utilities carry the Sentient family with them (`@utility` in `bricks.css`), so don't pair them with `font-display` or another size. They need Tailwind; linked as plain CSS, set `font-family: var(--font-display)` yourself.
- Weights are 450, 550 and 650 (`font-normal`, `font-medium`, `font-semibold`).
- Use `tabular-nums` for counts, sizes and dates.
- **Don't** set ad-hoc sizes. The one exception is the 15/24 support line on illustrated states (`StateMessage` with `art`).
- `cn()` (the `utils` item) teaches tailwind-merge these sizes, so `text-ui` and `text-muted-foreground` don't cancel each other out. Use it rather than a plain `twMerge`.

## Shape and elevation

- **One radius: `--radius`, 4px.** Every `rounded-*` step maps to it, so `rounded-md` and `rounded-lg` are both 4px.
- The one exception is row groups, at `--row-group-radius` (6px, `rounded-row-group`).
- Shadows come from elevation tokens fed into Tailwind's scale: `shadow-sm` (`--elevation-surface`), `shadow-md` (`--elevation-popover`), `shadow-lg` (`--elevation-overlay`), `shadow-tile`, `shadow-toast`.
- Light shadows are stacked, low-alpha layers. Dark keeps simpler shadows and none on tiles.

## Icons

- Phosphor (`@phosphor-icons/react`). Import from `@phosphor-icons/react/ssr` in React Server Components.
- The regular weight everywhere, unless a whole family of icons (such as a nav of tool tiles) uses duotone.
- Icons in buttons default to 16px (`size-4`). Icon-only buttons are ghost or outline, with an `aria-label`.
- Decorative icons get `aria-hidden`.

## Page layout

| Part | Component | Rules |
| --- | --- | --- |
| Header | `PageHeader` (`page-header`) | Every page has one: optional leading control (a sidebar trigger), breadcrumb, title in `font-display text-page-title`, optional byline, controls on the right. `PageSearch` is 32px high, 256px wide |
| Content | a `data-listing` div with `bg-listing` | A flex column that fills the rest of the page and scrolls. Inside it the hover step becomes `--listing-row` |
| Details | `DetailPanel` (`detail-panel`) | 320px on the right. With an item, the top edge is its title in `text-display-panel` (up to two lines) and its subtitle 6px under it, with icon-only actions (`DetailAction`) 24px to the right; with nothing picked it keeps the 40px "Details" bar. Sits beside the content from `lg`, overlays it below, where a close button joins the actions |
| Settings rail | an `<aside>` built from `info-blocks` | 288px on the left. Kept separate from the 320px details panel on purpose: settings lead on the left, details follow on the right |
| Footer | `PageFooter` (`page-footer`) | 40px, pagination only |

## Calls to action

| Role | Variant | Size |
| --- | --- | --- |
| The one main action in a state, header or panel | `default` (primary) | `sm` |
| Secondary actions | `outline` | `sm` |
| Secondary actions in dense inline rows and toolbars | `ghost` | `sm` |
| Destructive confirmation in a dialog, and a bulk Delete N | `destructive` (solid red, white text) | `sm` |

- **One primary per state, header or panel.**
- **In a row, the primary sits last, on the right.** For example: Clear (ghost), Add images (outline), Download (primary).
- **State-screen actions have no icons.** Header and panel actions keep theirs.
- **"Try again" is always primary.**
- **Red is for the button that deletes, not the one that asks.** A Delete trigger (an icon in the details header, a menu item) stays neutral; the confirm button in its dialog is solid red.
- Toast actions and small utility actions (Reset) are `sm` too. There's no smaller size for actions.
- **Don't** put two primaries side by side, or reach for `secondary` or `link` for an action.

### One button height

Every button is 32px, the same as `PageSearch`, selects and the segmented control, so nothing in a row jumps.

| Where | Size | Height |
| --- | --- | --- |
| Page header, toolbars, panel and dialog footers, state screens, toasts, pagination | `sm` (or none: `default` is the same 32px) | 32px |
| Icon-only button beside 32px buttons | `icon` or `icon-sm` | 32px |
| Icon-only actions in a 48px row, on a tile, in the details header (`RowAction`, `DetailAction`) | `icon-row` | 28px |
| Small menus in a dense rail | `icon-xs` | 24px |
| A lone, full-width sign-in button | `lg` | 40px |

- **Heights are fixed, not hugged.** Every variant is border-box with a 1px border (transparent on filled ones), so outline, primary, destructive and ghost buttons, and a Button rendered `asChild` as a link, all measure the same.
- **No `h-*`, `py-*` or `size-*` on a Button at a call site.** Pick a size; width and `justify-*` are fine.
- **A 40px toolbar holds only 32px controls.** Bulk actions go up to the page header.

## Panels

Any stack of details (details panel, settings rail, form, dialog body) is built from `info-blocks`. Changing the spacing there changes it everywhere.

| Rule | Value | Component |
| --- | --- | --- |
| Panel padding | 20px | `InfoStack` |
| Between groups | 24px, with a hairline between | `InfoGroup` |
| Property rows | 36px minimum, label in a 96px lane | `PropertyList` |
| Image to title | 16px | `MediaHead` |
| Title to support line | 8px | `MediaHead` |
| Pinned action | 20px padding, hairline above | `InfoFooter` |

- **Pin a panel's actions to its foot** with `InfoPanel`'s `footer` or `InfoFooter`. Buttons sit side by side with an 8px gap, each `flex-1`.
- **A details panel stacks its footer** (`InfoPanel stacked`): item-level calls to action only, at most two, full width, the secondary above the primary.
- **Actions on the item itself (Edit, Delete) aren't calls to action.** They're icon-only `DetailAction`s in the details header, never in the footer.
- **Don't** float actions mid-panel.

## Dialogs and sheets

- Dialogs are centred, 440px wide at most, 20px padding and 20px between blocks. They scale in from 97% and leave faster than they arrive.
- No close cross on a dialog: every dialog ends in Cancel (outline) and one primary or destructive action, primary last.
- Sheets slide in from an edge and keep a close cross.
- Fields inside take `--popover-field` automatically.

## Lists and tables

All in `data-rows`, on the `--row-group*` tokens.

- **Rows merge into one bordered, rounded group** (`ROW_GROUP`): `--row-group` fill, `--row-group-edge` border, `--row-group-radius`.
- **A bottom stroke separates rows** (`ROW`, `--row-group-divider`). The last row drops it, so the group's edge closes the block.
- The selected row (its details panel is open) also takes the coral ring (`SELECTED_RING`, see The coral rule).
- Rows are 48px high: a 28px avatar keeps 10px above and below, text sits 10px in, actions 6px off the right edge (`ROW_INSET`).
- Hover is `--row-group-hover`. Selected and pressed are `--row-group-selected` (`ROW_SELECTED`).
- Column headers and `RowGroupHeader` sit outside the group, in `text-meta`, flush with the row text.
- `DataRows` takes columns: exactly one flexes and truncates, the rest have fixed widths and read as secondary unless `strong`. `hideBelow` drops a column based on the width of the rows, not the window.
- A row action sits in a 28px slot (`RowAction`). It shows on hover or focus, always on touch, and can be pinned with `isActionPinned`.
- Loading uses `DataRowsSkeleton`.

- **Tiles in a grid float on the listing**: the artwork in its well (`bg-thumb`, `--thumb-edge`), the title and meta under it, and no card fill, edge or shadow around them. The selected tile takes the coral ring on its well.

**Do** use one row group per list.
**Don't** use floating cards per row, or hairline dividers straight on the page background.

## Segmented controls

One control everywhere: `ToggleGroup` (`toggle-group`).

- A 32px track with 4px of air inside it and 24px thumbs, 16px of padding either side of a label, 4px radius. The track matches `sm` buttons and selects.
- Icon-only items are 32px wide automatically, on the same 24px thumb.
- Light fills the track and lifts the thumb with a soft shadow. Dark sinks the track below the surface with an edge, and the thumb is the one raised step.
- **No per-call-site size overrides.** Width is fine (`w-full`, `flex-1` on items to fill a panel); height, padding and `size` aren't.

## Fields

- Text fields are white with an input edge in light (`--field`, `--field-edge`), like every other piece of content on the tinted page, and filled with no edge in dark. Both take a coral edge on focus.
- Selects are outlined, 32px (`size="sm"`), and their list sits on the popover surface.
- Checkboxes, radios and switches share `--switch-edge` when off and ink when on.

## State screens

Empty, error, locked and not-found screens all share one shape: `StateMessage` (`state-message`).

- **Centre both ways.** Put the state in the content area as a flex column (`flex min-h-0 flex-1 flex-col`) so it fills the space and sits dead centre.
- **Compact or illustrated.** With an `icon`: a 20px icon and `text-display-panel`. With `art`: your own 144px artwork, the title in `font-display text-page-title`, and the 15/24 support line.
- One action at most, usually primary and with no icon.
- A details panel with nothing picked keeps its 40px "Details" bar and centres a compact `StateMessage` under it: Phosphor's `EmptyIcon`, "Nothing selected" and one line ("Pick a file to see its details.").
- Error states read "Couldn’t load …" with a primary **Try again**. Whole-page errors add an outline **Go back home** before it.
- A not-found never says whether something was deleted or hidden, so it doesn't leak that the item exists.

## Toasts

- Sonner, through the `sonner` item: bottom right, lifted clear of any pinned panel footer.
- Custom toasts (`toast.custom`) draw their card on `bg-toast`, `border-toast-border` and `shadow-toast`.
- A toast raised from inside a dialog stays clickable (a scoped rule in `bricks.css` undoes Radix's `pointer-events: none`).

## Copy

- **Terse.** A short title and at most one short line.
- **Never explain implementation.** No "runs in your browser", "in a worker", "to keep it quick".
- British English and sentence case everywhere, buttons included.
- **Curly apostrophes in copy** (`’`): UI text, toasts and errors. Code and comments keep straight quotes.
- Buttons are verbs: Download SVG, Choose an image, Try again.
- Demo data uses first names only. Product copy never names a person: recovery copy says "an admin".
- A byline ("By …", `text-eyebrow`) is only for crediting someone else's work, on a tool's top level.

## Other conventions

- **Focus.** A mouse click can release focus (`event.detail > 0`) so rings show for keyboard users only.
- **Motion** is short and `ease-out`, and every animation respects `prefers-reduced-motion`.
- **Scrollbars** take the tinted greys (`scrollbar-color` on `html`). A box that scrolls inside a page, where macOS's overlay scrollbars would hide that there's more, adds `scrollbar-visible` to keep its bar showing.
- **Uploaded markup** only ever goes into an `<img>`, never the DOM.
- **Check** light and dark, and windows at 1440, 1024, 900 and 390 wide.

## Building a new tool

1. `PageHeader` with a title, and the page's controls on the right, primary last.
2. A `data-listing` content area that fills the rest of the page.
3. `DataRows` for lists, `ToggleGroup` for segmented choices, `StateMessage` for every empty, error and loading state.
4. Settings in a 288px left rail, details in the 320px `DetailPanel`, both built from `info-blocks`.
5. Any new colour becomes a token, with values for both themes. Greys come off the scale; run `node scripts/check-tokens.mjs` on your folder.
6. Check both themes and the four widths above.
