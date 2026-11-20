# Bricks design rules

The rules every Bricks screen follows. `bricks.css` and the components in `registry/bricks/` are the source of truth. If the code and this file disagree, fix one of them; don't let them drift.

Audience: designers, developers and Claude, building a tool or an internal app with Bricks.

## Principles

- **One shell, many tools.** A page is a header, a content area, and optionally a settings rail on the left and a details panel on the right. A new tool shouldn't need a new layout primitive.
- **Tokens, not values.** Every colour, radius, shadow and type style comes from `bricks.css`. A reskin changes token values only.
- **Monochrome by default.** Ink on grey surfaces. Colour is rare and every use is named below.
- **Quiet copy.** A short title and at most one short line.

## Theme

- Every token has a light value on `:root` and a dark value on `.dark`. **Check every screen in both.**
- Dark mode is a `dark` class on `<html>` (`@custom-variant dark (&:is(.dark *))`). Set it before first paint (a small inline script in `<head>`) so there's no flash.
- Pick one default for your product and stick to it. `next-themes` works; so does a two-line script.

## Colour tokens

Use the Tailwind utility (`bg-listing`, `text-muted-foreground`), never the hex.

### Base palette

| Token | Role |
| --- | --- |
| `--ground` | The sunken layer behind the page: app background, sidebar |
| `--surface` | The raised page surface (`--background`) |
| `--nested` | Cards, panels and wells inside the surface (`--card`, `--muted`) |
| `--row` | Hover step on the surface (`--accent`, `--secondary`) |
| `--row-pressed` | Pressed step on the surface |
| `--ground-row` / `--ground-pressed` | Hover and pressed steps on the ground |
| `--ink` / `--ink-inverse` / `--ink-secondary` | Text: primary, on primary, secondary (`--muted-foreground`) |
| `--hairline` | Borders and inputs (`--border`, `--input`) |
| `--surface-edge` | The page surface's edge against the ground |
| `--listing` / `--listing-row` | The content area under rows and tiles, and its hover step |
| `--field` | Filled text fields. No stroke |
| `--popover-field` | Fields on a dialog, sheet or popover. Lifted a step in dark, where `--field` matches `--popover-surface` |
| `--popover-surface` | Menus and popovers |
| `--popover-row` | Hover step on menu and select items |

Scoped rules in `bricks.css` do the rescoping for you: inside `[data-listing]` the hover step becomes `--listing-row`, menus and select lists take `--popover-row`, and fields on a dialog, sheet or popover take `--popover-field`.

### State ladder

Every interactive surface uses the same three steps: rest, hover (`--row` or `--ground-row`), pressed (`--row-pressed` or `--ground-pressed`).

- Selected rows sit on the hover step. Selected controls sit on the pressed step.
- Primary buttons have their own steps: `--primary`, `--primary-hover`, `--primary-pressed`.
- Focus rings on buttons and toggles are monochrome: `--ring-control`.

### Named colour uses

Each of these has one job. Don't borrow them for anything else.

| Token | Only used for |
| --- | --- |
| `--accent-brand` (coral) | The ring around a selected card, and a text field's focus edge |
| `--chip-peach`, `--chip-peach-foreground` | A rare peach chip (`Badge variant="peach"`), for one standout status |
| `--destructive` | Error text. Dark uses a lighter red for contrast |
| `--destructive-fill` (`-hover`, `-pressed`) | The solid red behind destructive buttons, with white text. Never on the trigger that opens a confirm |

### Component tokens

| Group | Tokens |
| --- | --- |
| Segmented controls | `--segment-track`, `--segment-track-edge`, `--segment-hover`, `--segment-thumb`, `--segment-thumb-border`, `--segment-thumb-shadow` |
| Row groups | `--row-group`, `--row-group-hover`, `--row-group-selected`, `--row-group-edge`, `--row-group-divider`, `--row-group-radius` |
| Tiles | `--tile-border`, `--thumb`, `--thumb-edge` |
| Toasts | `--toast`, `--toast-border`, `--elevation-toast` |
| Switches, checkboxes and radios | `--switch-edge` |
| Outline buttons | `--button-outline` |

**Do** add a new token, with a light and a dark value, when nothing fits.
**Don't** write a hex, `bg-white`, `bg-black` or `bg-[...]` colour in a component. The exception is content that must stay fixed whatever the theme, such as a logo previewed on pure white or pure black.

## Type

Two faces:

- **Inter** for the UI (`--font-sans`). The variable file, with `opsz` forced to the display cut (`font-variation-settings: "opsz" 32` on `html`).
- **Sentient** for display (`--font-display`, `font-display`): page titles and illustrated state titles.

See the README for how to load them. Neither is bundled.

Each `--text-*` token becomes a `text-*` utility that carries its size, line height, weight and tracking.

| Utility | Size / line | Weight | Use |
| --- | --- | --- | --- |
| `text-page-title` | 24 / 30 | 500 | Page title (with `font-display`), illustrated state titles |
| `text-panel-title` | 14 / 20 | 650 | Panel and item titles, icon state titles, dialog titles |
| `text-section` | 13 / 20 | 650 | Section headings |
| `text-body` | 13 / 20 | 450 | Body copy, the default on `body` |
| `text-ui` | 13 / 20 | 550 | Labels on controls and rows |
| `text-meta` | 12 / 16 | 450 | Secondary detail, column headers, breadcrumbs |
| `text-eyebrow` | 10 / 12 | 550, +0.08em | Uppercase labels: group labels, bylines, Soon |

- `text-sm` and `text-xs` sit on the same scale as `text-body` and `text-meta`, so shadcn primitives stay on it.
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
| Details | `DetailPanel` (`detail-panel`) | 320px on the right. With an item, the top edge is its title and subtitle, with icon-only actions (`DetailAction`) on the right; with nothing picked it keeps the 40px "Details" bar. Sits beside the content from `lg`, overlays it below, where a close button joins the actions |
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
- Rows are 48px high: a 28px avatar keeps 10px above and below, text sits 10px in, actions 6px off the right edge (`ROW_INSET`).
- Hover is `--row-group-hover`. Selected and pressed are `--row-group-selected` (`ROW_SELECTED`).
- Column headers and `RowGroupHeader` sit outside the group, in `text-meta`, flush with the row text.
- `DataRows` takes columns: exactly one flexes and truncates, the rest have fixed widths and read as secondary unless `strong`. `hideBelow` drops a column based on the width of the rows, not the window.
- A row action sits in a 28px slot (`RowAction`). It shows on hover or focus, always on touch, and can be pinned with `isActionPinned`.
- Loading uses `DataRowsSkeleton`.

**Do** use one row group per list.
**Don't** use floating cards per row, or hairline dividers straight on the page background.

## Segmented controls

One control everywhere: `ToggleGroup` (`toggle-group`).

- A 32px track with 4px of air inside it and 24px thumbs, 16px of padding either side of a label, 4px radius. The track matches `sm` buttons and selects.
- Icon-only items are 32px wide automatically, on the same 24px thumb.
- Light fills the track and lifts the thumb with a soft shadow. Dark sinks the track below the surface with an edge, and the thumb is the one raised step.
- **No per-call-site size overrides.** Width is fine (`w-full`, `flex-1` on items to fill a panel); height, padding and `size` aren't.

## Fields

- Text fields are filled (`--field`) with no stroke, and take a coral edge on focus.
- Selects are outlined, 32px (`size="sm"`), and their list sits on the popover surface.
- Checkboxes, radios and switches share `--switch-edge` when off and ink when on.

## State screens

Empty, error, locked and not-found screens all share one shape: `StateMessage` (`state-message`).

- **Centre both ways.** Put the state in the content area as a flex column (`flex min-h-0 flex-1 flex-col`) so it fills the space and sits dead centre.
- **Compact or illustrated.** With an `icon`: a 20px icon and `text-panel-title`. With `art`: your own 144px artwork, the title in `font-display text-page-title`, and the 15/24 support line.
- One action at most, usually primary and with no icon.
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
- **Uploaded markup** only ever goes into an `<img>`, never the DOM.
- **Check** light and dark, and windows at 1440, 1024, 900 and 390 wide.

## Building a new tool

1. `PageHeader` with a title, and the page's controls on the right, primary last.
2. A `data-listing` content area that fills the rest of the page.
3. `DataRows` for lists, `ToggleGroup` for segmented choices, `StateMessage` for every empty, error and loading state.
4. Settings in a 288px left rail, details in the 320px `DetailPanel`, both built from `info-blocks`.
5. Any new colour becomes a token, with values for both themes.
6. Check both themes and the four widths above.
