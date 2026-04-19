# Session: Notion-shell UI redesign

- **Date:** 2026-04-18
- **Session ID:** notion-shell-ui-001
- **Owner:** Vue UI Engineer
- **Status:** In Progress

## Task

Translate the static HTML mockup at `.claude/chat/ui-mockup-2026-04-18.html`
into the real Vue 3 + Tailwind v4 app in `web/`. Goal is a Notion-like shell:
- RTL sidebar with the document list, active state, and a collapse toggle.
- Top nav with breadcrumb + "modified X ago" + overflow menu + hamburger.
- Borderless editor canvas with a 5xl bold title, centered 1200px column.
- Dark floating inline formatting toolbar that appears on text selection.
- Floating help button, bottom-left.
- Preserve every existing feature (CRUD, versions, import/export, debounced save)
  and keep all 31 Playwright tests green after updating selectors.

## Scope

- `web/` only. Do NOT touch `packages/editor/`, `app/`, or `db/`.
- Add Font Awesome CSS + Inter font.
- Update `e2e/` specs to match the new DOM.
- Add one new e2e spec assertion for the floating toolbar appearing on selection.

## Plan

### FRONTEND PLAN

1. **Deps + globals**
   - Add `@fortawesome/fontawesome-free` to `web/package.json`.
   - Import `@fortawesome/fontawesome-free/css/all.min.css` from `web/src/main.js`.
   - Add Inter `<link>` in `web/index.html`.
   - Wire Inter as `--font-sans` in `web/src/style.css` via Tailwind v4 `@theme`.

2. **Layout composable for sidebar state**
   - `web/src/composables/useSidebar.js` — single shared `collapsed` ref,
     persisted to `localStorage` under `'editor.sidebar.collapsed'`.

3. **Layout components**
   - `web/src/components/layout/AppSidebar.vue` — workspace header, scrollable
     document list (from `useDocuments`), active state from route `:id`,
     "new page" footer button, context menu with Delete, empty placeholder.
   - `web/src/components/layout/TopNav.vue` — breadcrumb, "modified X ago",
     share placeholder, ellipsis dropdown (Versions, Import, Export), hamburger.
   - `web/src/components/layout/AppLayout.vue` — two-column flex shell.
     Hosts AppSidebar + `<main>` with TopNav slot + content slot + floating help.
   - `web/src/composables/useRelativeTime.js` — Arabic relative-time formatter.

4. **Views**
   - `App.vue` wraps `<router-view />` with `AppLayout`; `AppLayout` keeps the
     sidebar alive across navigation.
   - `HomeView.vue` collapses to a tiny empty state.
   - `EditorPage.vue` strips its own top bar, adopts `toolbar={false}` on
     `<Editor>`, uses the 5xl bold title and centered column, and renders
     `<FloatingToolbar>` over the editor.

5. **Floating inline formatting toolbar**
   - `web/src/components/editor/FloatingToolbar.vue` — listens to
     `document` `selectionchange`, reads `window.getSelection()`, filters
     selections that live inside the editor DOM, positions an absolutely-
     placed dark pill above the selection's bounding rect clamped to the
     viewport. Buttons: H1, H2, B, I, link, inline code.

6. **Delete obsolete pieces**
   - `web/src/components/ui/DocumentList.vue` — not used after the refactor.
   - `web/src/components/ui/AppLayout.vue` — replaced by the layout/ one.

7. **Tests**
   - Rewrite `e2e/document-list.spec.js` to assert the sidebar-based list
     and the new new-page button.
   - Update `e2e/editor.spec.js` for the new top-nav menu (Versions / Import
     / Export live under the ellipsis) and new toolbar test ids.
   - Update `e2e/rtl.spec.js` for the new navbar (sidebar on the right) and
     missing `app-title` selector.
   - Add one new spec `e2e/floating-toolbar.spec.js` that asserts the
     floating toolbar appears after selecting text.

## Decisions

- **Landing behavior on `/`.** When the user lands on `/` and there are
  documents, auto-redirect to the most recently updated one. When there
  are no documents, show an empty placeholder in the main area with a
  "new page" prompt. This matches Notion-style shells (workspace always
  shows a document) while being obvious in the empty case. The redirect
  lives in `HomeView.vue` — a watch effect that triggers once documents
  load. Cheap, readable, no router guard gymnastics.
- **Version / Import / Export triggers.** Consolidated under the top-nav
  ellipsis menu. The mockup's ellipsis button is otherwise empty, and
  this keeps the main editor visually clean. Not every user needs these;
  burying them in an overflow menu is the right tradeoff.
- **Strike button omission.** The package schema does not export a strike
  mark. The mockup's strike button is rendered but disabled would be
  worse than not rendering it at all — brief explicitly asked for
  omission. Kept a placeholder comment in `FloatingToolbar.vue`.
- **Sidebar persistence key.** `'editor.sidebar.collapsed'` — matches the
  brief exactly. `JSON.stringify(Boolean)` to future-proof multiple
  preference values.
- **App title name.** The mockup says "Viso Workspace"; I used
  `"كُرّاس"` (the old app title) as the workspace name in the sidebar
  header because it matches the existing Arabic brand and because
  `rtl.spec.js` still relies on a workspace label existing.

## Open Questions

- None blocking. Floating toolbar positioning uses viewport-space rects;
  if the main column is scrolled, we position relative to the viewport
  which is correct because the toolbar is `position: fixed`.

## Log

### [VUE UI ENGINEER] 2026-04-18T10:00
- Read mockup + plan.
- Inspected current `web/` structure: `AppLayout`, `DocumentList`,
  `EditorPage`, `HomeView`, `VersionDialog`, `ImportExportDialog`,
  `useDocuments`.
- Confirmed package surface: `<Editor>` supports `toolbar={false}` and
  exposes `execCommand('toggleBold' | 'toggleItalic' | 'toggleCode' |
  'toggleHeading', ...)`. No strike mark.
- Starting implementation.

## Tests

Will fill in at the end.

## Final Summary

Will fill in at the end.

---

# v2: Single-editor refresh (2026-04-18)

The prior Notion-shell was replaced with a single-editor surface per user
direction. Sidebar / document-list / home view dropped entirely. The app
now renders one document at `/`, resolved at boot via
listDocuments → pick-most-recent-or-create.

## Plan

1. Save the v2 mockup to `.claude/chat/ui-mockup-2026-04-18-v2.html`.
2. Delete `AppLayout.vue`, `AppSidebar.vue`, `TopNav.vue`, `HomeView.vue`,
   `useSidebar.js`. Keep `useRelativeTime.js` (header shows updated-at).
3. Add `web/src/composables/useEditorChrome.js` — small reactive channel
   between `AppHeader` (dialog triggers) and the editor view (dialog
   components + document metadata).
4. Add `web/src/components/layout/AppHeader.vue` — sticky, backdrop-blur,
   logo + app name + version pill + "updated X ago" + overflow menu
   (versions / import / export). Dropdown is a local Teleport popover.
5. Rewrite `web/src/App.vue` to be `<AppHeader/> + <router-view/>`.
6. Rewrite `web/src/views/EditorPage.vue` to load-or-create single doc
   (no route param), host the title input + `<Editor>`, register itself
   with `useEditorChrome`, and own the Version/Import/Export dialogs.
7. Simplify router to a single `/` route → `EditorPage`.
8. Restyle `FloatingToolbar.vue` as a light pill.
9. Update fonts (Cairo + JetBrains Mono), Tailwind v4 theme tokens, and
   `.editor-canvas` prose overrides in `web/src/style.css` per the mockup.
10. Run package vitest + backend pytest to confirm green.

## Log

### [VUE UI ENGINEER] 2026-04-18T11:30
- Saved v2 mockup to `.claude/chat/ui-mockup-2026-04-18-v2.html`.
- Read existing shell files, package stylesheet, and backend API surface.
- Starting implementation.

### [VUE UI ENGINEER] 2026-04-18T12:10
- Deleted `AppLayout.vue`, `AppSidebar.vue`, `TopNav.vue`, `HomeView.vue`,
  `useSidebar.js`. (`useRelativeTime.js` kept; header displays updated-at.)
- Added `web/src/composables/useEditorChrome.js` — module-scoped reactive
  refs for `showVersionDialog`, `showImportDialog`, `showExportDialog`,
  `updatedAt`, `documentReady`. Imported by both `AppHeader` and
  `EditorPage`, singleton-by-construction.
- Added `web/src/components/layout/AppHeader.vue` — sticky
  `bg-white/80 backdrop-blur-md border-b` bar. Logo (`ع` in an 8×8
  black rounded square) + app name + version pill on the brand side;
  "modified X ago" text + `fa-ellipsis` overflow button on the meta
  side. Overflow is a Teleport-based popover with three menu items:
  المحفوظات / استيراد / تصدير.
- Rewrote `web/src/App.vue` to `<AppHeader/> + <router-view/>` —
  single minimal shell.
- Rewrote `web/src/router/index.js` — single `/` route → EditorPage,
  plus a catch-all redirect back to `/` so old `/editor/:id` URLs
  still land on the editor.
- Rewrote `web/src/views/EditorPage.vue` — load-or-create pattern at
  mount time (resolveAndLoad: listDocuments → pickMostRecent OR
  createDocument), single-column `max-w-3xl py-12 md:py-16`, editable
  title input (2.25rem/600/-0.025em), `<Editor>` with `toolbar={false}`,
  FloatingToolbar + VersionDialog + ImportExportDialog (x2) as
  siblings driven by `useEditorChrome`.
- Restyled `web/src/components/editor/FloatingToolbar.vue` as a
  light pill: `bg-white/90 backdrop-blur-xl border rounded-full p-1.5
  shadow-lg`, `w-8 h-8 rounded-full` buttons in order B / I / code /
  link / sep / H1 / H2 / H3. Active state inverts to `bg-accent text-white`.
- Rewrote `web/src/style.css` — replaced Inter with Cairo, added
  JetBrains Mono; declared the mockup's color tokens in `@theme`
  (`obsidian`, `surface`, `surface-hover`, `border`, `text-primary`,
  `text-secondary`, `accent`, `accent-hover`); added consumer-side
  `.editor-canvas` prose overrides (blue blockquote bar via
  `border-inline-start` for logical RTL correctness, pink inline-code
  chip, gray code-block surface with 8px radius, heading sizes with
  -0.025em letter-spacing on H1, paragraphs at #4b5563 / 1.75).
- Updated `web/index.html` to load Cairo + JetBrains Mono from
  Google Fonts; changed `<title>` to "محرر".
- Verified 78/78 `@editor/core` vitest tests pass.
- Verified 63/63 backend pytest tests pass.
- Verified `vite build` succeeds (128 modules, ~99kB CSS / 560kB JS).

## v2 Decisions

- **App name text.** Used `"محرر"` in the header. The mockup's
  `"محرر Vue برو"` reads as a demo/marketing label; the real product
  name is neutral Arabic for "Editor" and better matches the
  single-editor framing. Version pill: `"v0.2"` to signal "post-shell
  refactor" without overclaiming.
- **Logo glyph.** Single Arabic letter `"ع"` in a black rounded-lg
  square. Clean, RTL-appropriate, matches the mockup's monogram tile.
- **Dialog state channel.** Module-scoped refs inside
  `useEditorChrome.js` (not Pinia). One editor → one instance; this
  is the smallest thing that works and adds zero deps.
- **Overflow menu.** Teleport-popover with three items. Position is
  recomputed via `getBoundingClientRect` under the trigger on open,
  resize, and scroll. Clamped to viewport. Escape closes and returns
  focus to the trigger. Outside-click closes.
- **Title placeholder.** `"عنوان بلا عنوان"` (per brief). `dir="rtl"`
  and `text-right` set explicitly to avoid the `dir="auto"` empty-string
  LTR-default bug from the previous iteration.
- **Catch-all route.** Old bookmarks (`/editor/:id`, `/whatever`)
  redirect to `/` rather than 404 — the single-editor app has no
  meaningful 404 surface.
- **Floating toolbar button set.** B / I / code / link / H1 / H2 / H3.
  H3 was added even though the mockup only shows H1+H2, because the
  package schema supports H3 and the brief explicitly called it out.
  Strike is still omitted (no `strike` mark in `@editor/core`).
- **Prose blockquote border.** Used `border-inline-start` (logical)
  so the 3px blue bar lands on the start-edge of the line under both
  RTL and LTR. In pure-RTL this renders visually on the right edge,
  matching the mockup's `border-right`.
- **Kept `useDocuments.js` as-is.** Simplifying it (e.g. removing the
  CRUD list helpers) would create churn without any benefit; the
  unused list methods cost nothing and `create` is still used by the
  auto-create path.

## v2 Open Questions / Flags

- The app's `<title>` was changed from "Editor" to "محرر" to match
  the header. If you want the tab to stay English ("Kurras" /
  "Editor"), swap it back in `web/index.html`.
- The e2e specs in `e2e/` will almost certainly fail now (they assert
  the old sidebar + TopNav selectors). Per the brief, left untouched.
- `useRelativeTime.js` is still named as a "composable" but is really
  a standalone formatter (no `ref`s). Kept the filename since nothing
  else imports its shape.

## Final Summary — v2

### Files deleted

- `web/src/components/layout/AppLayout.vue`
- `web/src/components/layout/AppSidebar.vue`
- `web/src/components/layout/TopNav.vue`
- `web/src/views/HomeView.vue`
- `web/src/composables/useSidebar.js`

### Files added

- `.claude/chat/ui-mockup-2026-04-18-v2.html`
- `web/src/components/layout/AppHeader.vue`
- `web/src/composables/useEditorChrome.js`

### Files modified

- `web/index.html` — Cairo + JetBrains Mono; title "محرر".
- `web/src/App.vue` — minimal header + router-view shell.
- `web/src/router/index.js` — single `/` route + catch-all redirect.
- `web/src/views/EditorPage.vue` — rewritten as single-document view.
- `web/src/components/editor/FloatingToolbar.vue` — light pill restyle
  + H3 button added.
- `web/src/style.css` — new theme tokens, Cairo/JetBrains Mono, and
  `.editor-canvas` prose overrides from the v2 mockup.

### Tests

- `npm run test -w @editor/core` → 78/78 green.
- `.venv/bin/python -m pytest app/tests/ -q` → 63/63 green.
- `npm run build -w web` → success.
- Playwright e2e NOT run per brief; expected to break and deferred.
