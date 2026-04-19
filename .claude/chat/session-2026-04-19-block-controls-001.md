# Session: Per-block hover controls for kurrasah (v0.4.0)

- **Session ID**: 2026-04-19-block-controls-001
- **Status**: In Progress
- **Owner**: ui-engineer

## Task

Add per-block hover controls to the `kurrasah` package. When the user hovers
a top-level block, a small overlay appears on the **start-edge side**
(right in RTL, left in LTR) with two controls: a **drag handle** and a
**"+" button**. Drag reorders blocks. "+" inserts an empty paragraph below
the hovered block and opens the slash menu at that position so the user
can pick a type.

Bumps the package to **v0.4.0** (minor — new public prop, additive).

## Scope

- Package: `packages/kurrasah/` only. Do NOT touch `web/` — the version
  pill auto-picks up `package.json`.
- Add files: `src/blockControls.js`, `src/BlockControls.vue`,
  `test/blockControls.test.js`.
- Modify: `src/Editor.vue`, `src/style.css`, `types/index.d.ts`,
  `types/__check__.ts`, `package.json`, `CHANGELOG.md`, `README.md`.
- No new runtime dependency.
- RTL-first — both controls position and render correctly under
  `dir="rtl"`.

## Implementation Plan

### FRONTEND PLAN

1. **`src/blockControls.js`** — pure helpers.
   - `TOP_LEVEL_BLOCK_NAMES`: the allowlist of block types that get the
     hover overlay — paragraph, heading, blockquote, code_block,
     bullet_list, ordered_list, image.
   - `findTopLevelBlockAtCoords(view, x, y)` — resolves the hovered
     top-level block from viewport-relative coords. Returns `null` when
     the cursor is over a skipped node (list_item, hard_break), outside
     the doc, or over a node not in the allowlist. Otherwise returns
     `{ node, from, to, depth: 1 }`.
   - `computeControlsPosition({ view, from, to, dir, overlayWidth, gap })`
     — returns physical `{ left, top }` viewport coords. For LTR:
     `left = blockStart.left - overlayWidth - gap`. For RTL:
     `left = blockEnd.right + gap` where `blockEnd.right` is derived
     from the rect of the block's end position. `top = blockStart.top + 2`.

2. **`src/BlockControls.vue`** — overlay component.
   - Props: `view`, `revision`, `dir`, `enabled`.
   - Internal state: `hovered = { from, to, node } | null`, `coords`.
   - Mount: Teleport to body like `SlashMenu.vue`.
   - Event wiring: on prop `view` change (after editor mounts), attach
     `mousemove` / `mouseleave` on `view.dom`. Use a rAF throttle for
     mousemove. On each flush, call `findTopLevelBlockAtCoords` and
     update hovered. On mouseleave or after 200 ms idle timer, clear.
   - Hide when the slash menu is open: watch `pluginState.active` via
     `slashMenuKey.getState(view.state)` every revision tick.
   - Hide when `enabled === false`.
   - Render: two buttons (drag handle + "+"). Both have
     `dir="ltr"` inline to bypass bidi.
   - "+" handler: `insertParagraphBelowAndOpenPalette(view, hovered.to)` —
     insert an empty paragraph after `hovered.to`, set a TextSelection at
     its start, dispatch SLASH_MENU_META.OPEN_COMMAND_PALETTE meta.
   - Drag handle:
     - `draggable="true"`.
     - On `dragstart`: set a NodeSelection covering the block (falls
       back to TextSelection on error). Let PM's default drag serializer
       populate `dataTransfer`. If PM doesn't, we write an HTML + text
       fallback using `DOMSerializer.fromSchema(schema).serializeFragment`.
     - On `dragend`: clear hover state.
   - Drop behavior is owned by PM's built-in drop logic; it handles
     "cut + paste" semantics when the drag source is inside the same
     editor.

3. **`src/Editor.vue`** — wiring.
   - Add prop `blockControlsEnabled: { type: Boolean, default: true }`.
   - Import `BlockControls` alongside `SlashMenu`, mount it in the
     template when the view exists.
   - Pass `view`, `revision`, `dir`, `enabled` down.

4. **`src/style.css`** — new scoped `.kurrasah-block-controls` block.
   - Position fixed with physical left/top (absolute coords exception
     noted with inline comment).
   - Fade in/out via opacity transition ~150ms.
   - z-index 90 (below slash menu's 1000; they shouldn't overlap anyway
     because the slash menu hides controls, but keep it low).
   - Two buttons compact 22 × 22 — white background, subtle border,
     hover darkens. `cursor: grab` on handle; `cursor: pointer` on plus.

5. **`types/index.d.ts`**: add `blockControlsEnabled?: boolean` to
   `EditorProps`. Add a note explaining behavior.
6. **`types/__check__.ts`**: exercise the new prop (both boolean values
   plus negative-case `@ts-expect-error`).
7. **`package.json`**: bump `"version": "0.3.1"` → `"0.4.0"`.
8. **`CHANGELOG.md`**: new `## [0.4.0]` entry under `### Added`.
9. **`README.md`**: new "Per-block hover controls" section, props-table
   row, keyboard-only note.

### TEST PLAN

`test/blockControls.test.js` — at least 6 cases:

1. `findTopLevelBlockAtCoords` returns the right top-level block for
   paragraph/heading/blockquote positions.
2. `findTopLevelBlockAtCoords` returns null when coords hit a list_item
   (child of list — skipped).
3. `+` button click inserts a paragraph below the hovered block and
   dispatches OPEN_COMMAND_PALETTE on the slash-menu plugin.
4. Drag handle `dragstart` sets a NodeSelection covering the block.
5. `BlockControls` component hides when slash-menu plugin state is
   active.
6. `blockControlsEnabled: false` prop — the component never attaches
   mousemove listeners.
7. RTL vs LTR: `computeControlsPosition` returns different physical
   `left` coords depending on `dir`.

## Decisions

- **Drag implementation**: we attempt the "PM default" path first — just
  setting a NodeSelection on dragstart and letting PM serialize +
  handle the drop. Record the fallback path in Log if that doesn't
  produce clean cut+paste behavior.
- **Overlay layout**: two buttons side-by-side (horizontal). A vertical
  stack reads awkwardly against the block's top edge; horizontal keeps
  both buttons visible and small.
- **Throttling**: single rAF-pending flag. One read per frame at most.
- **Idle hide**: 200 ms since last mousemove with no matching block.

## Open Questions

- Does PM's default drag reliably produce `{ move: true, copy: false }`
  for a block that is a NodeSelection? Will verify in the implementation
  + tests.

## Log

### [VUE UI ENGINEER] 2026-04-19T15:24
- Read the plan and session context.
- Existing 114 tests pass on baseline.
- Starting frontend work on per-block hover controls in `packages/kurrasah/`.

### [VUE UI ENGINEER] 2026-04-19T15:32
- Implemented `src/blockControls.js` (helpers), `src/BlockControls.vue`
  (overlay component), wired both into `Editor.vue` behind a new prop
  `blockControlsEnabled` (default `true`).
- Added CSS block under `.kurrasah-block-controls` in `style.css`.
  Scoped via the `kurrasah-` prefix and rendered via Teleport-to-body,
  matching the slash-menu pattern. Physical `left`/`top` only for the
  absolute positioning (documented inline); every other directional
  property is logical.
- Tests: `test/blockControls.test.js` — 11 cases (>= 6 required).
  Covers the allowlist, `findTopLevelBlockAtCoords` resolution for
  heading/paragraph/list, `computeControlsPosition` RTL/LTR physical
  delta, "+" button inserting a paragraph + opening the palette,
  dragstart setting a NodeSelection and stamping `view.dragging` with
  `{ slice, move, node }`, slash-menu hide, and disabled-prop no-op.
- Types: added `blockControlsEnabled?: boolean` to `EditorProps`. Also
  updated `__check__.ts` with positive + negative coverage for the
  new prop.
- `package.json`: 0.3.1 → 0.4.0. Updated `CHANGELOG.md` + README section.

### Verification
- `npm run test -w kurrasah`: 125 tests pass (was 114 — added 11).
- `npm run build -w kurrasah`: clean. 168.52 kB (gzip 61.31 kB).
  Baseline was 161.77 kB / 59.59 kB gzipped — delta **+6.75 kB raw,
  +1.72 kB gzipped**.
- `npm run build -w web`: clean (web demo auto-picks up the prop
  default; no consumer changes needed).
- `tsc --project types/tsconfig.json` (from `packages/kurrasah/`): clean.

### Drag-and-drop decision

- **PM default drop + stamped `view.dragging`**. Our overlay is NOT a
  descendant of `view.dom`, so PM's own `handlers.dragstart` never
  fires. We manually (a) set a `NodeSelection` covering the hovered
  block, (b) populate `dataTransfer` via
  `view.someProp('clipboardSerializer').serializeFragment`, (c) set
  `effectAllowed = 'move'`, (d) stamp `view.dragging = { slice, move,
  node: NodeSelection }` — the exact shape PM's `Dragging` class uses
  (no `instanceof` check in the drop path, confirmed by reading
  `prosemirror-view/dist/index.js`). PM's default drop handler then
  runs `node.replace(tr)` which deletes the source — yielding
  cut + paste semantics.
- No custom `handleDrop` editor prop needed.

### Edge cases handled

- **Overlay ↔ view.dom transition**: moving the pointer from `view.dom`
  into the overlay itself fires `mouseleave` on `view.dom`, which
  would otherwise hide the overlay from under the user's cursor. We
  check `event.relatedTarget` — if it's inside
  `.kurrasah-block-controls`, we don't clear the hover state. The
  overlay also has its own `mousemove` handler that resets the
  idle-hide timer so the overlay stays alive while hovered.
- **Idle hide**: after 200 ms with no mousemove anywhere, the overlay
  disappears — cleaned up via a single `setTimeout` reset on each
  mousemove.
- **Dragging mouseleave**: browsers fire `mouseleave` on the source
  during drag; we guard against clearing state while `dragging.value`
  is true so `dragend` can still reach its handler.
- **Single-block doc**: PM's `replace` validates against `block+`
  schema and will insert a paragraph if the result would be empty.
- **Drag onto self**: PM's drop path computes `insertPos` via
  `dropPoint` and either produces a no-op or a same-position move.
- **Hover-but-no-block**: mousemove resolves through
  `findTopLevelBlockAtCoords` and returns `null` for unsupported
  nodes (list_item, hard_break) — we don't clear the current hover
  in that case so moving from block to overlay edge doesn't flicker.

### Deferred / out of scope

- Nested list-item drag (dragging a single `<li>` within a list) —
  this is a different gesture and not supported in v0.4. The list as
  a whole still drags.
- Touch support — mousemove only; no `touchstart`/`touchmove`.
- Keyboard invocation — intentionally mouse-hover only; keyboard
  users have the slash menu (`@` trigger + `Cmd/Ctrl+K`).
- No drop-indicator decoration (ghost line where the block will
  land) — PM's built-in `dropcursor` plugin is not in our preset.
  Consumers who want it can add it to their own plugin list.

## Final Summary

- Files created:
  - `packages/kurrasah/src/blockControls.js`
  - `packages/kurrasah/src/BlockControls.vue`
  - `packages/kurrasah/test/blockControls.test.js`
- Files modified:
  - `packages/kurrasah/src/Editor.vue` (import + prop + template mount)
  - `packages/kurrasah/src/style.css` (overlay CSS block)
  - `packages/kurrasah/types/index.d.ts` (new prop in `EditorProps`)
  - `packages/kurrasah/types/__check__.ts` (coverage)
  - `packages/kurrasah/package.json` (version 0.3.1 → 0.4.0)
  - `packages/kurrasah/CHANGELOG.md` (new 0.4.0 entry)
  - `packages/kurrasah/README.md` (new section + props-table row)
- Test delta: **114 → 125** (+11).
- Bundle size delta: **+6.75 kB raw, +1.72 kB gzipped**
  (161.77 kB → 168.52 kB; 59.59 kB → 61.31 kB gzipped).
- No new runtime dependency.

