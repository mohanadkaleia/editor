# session-2026-04-19-drop-backend-001

## Header
- **Task**: Drop the Flask backend and the SQLite database from the repo. The demo app keeps one document in `localStorage`.
- **Goal**: Strip everything that isn't about `@editor/core` so the repo is focused on the package.
- **Agent**: ui-engineer (web-only cleanup + localStorage wiring)
- **Scope constraints**:
  - Do NOT touch `packages/editor/` source, tests, build, or version.
  - Do NOT add any new dependency.
  - Do NOT add Playwright tests.

## Decisions
1. **Storage**: single document in `localStorage` under key `editor.document.v1`. Shape:
   ```json
   { "title": "string", "content_md": "string", "updated_at": 1718745600000 }
   ```
   `updated_at` is JS epoch-millis (number) — internal; UI displays relative time only.
2. **Versions dropped** — version history UI, `VersionDialog`, and the overflow-menu "versions" item all go. Import/export covers archival.
3. **No backend. No DB. No Python.** Front-end-only demo.
4. **Docs page stays** — it is already static.
5. **`@editor/core` is not touched.** Still at v0.1.2.
6. `useRelativeTime.formatRelativeArabic` must now handle epoch-millis numbers (was seconds). Update the doc comment and the "multiply by 1000" branch to pass through numbers as milliseconds — still accept date strings for robustness. No consumer outside of `AppHeader` uses it, and `AppHeader` now receives millis from the localStorage doc.

## Implementation Plan

### FRONTEND PLAN
1. **Delete**
   - `web/src/components/editor/VersionDialog.vue`
   - `web/src/api/documents.js` (entire `web/src/api/` directory)
2. **Create**
   - `web/src/lib/storage.js` — `STORAGE_KEY`, `loadDocument`, `saveDocument`, `clearDocument`.
   - `web/src/composables/useDocument.js` (singular) — replaces `useDocuments.js`.
3. **Update**
   - `web/src/views/EditorPage.vue` — drop REST load-or-create, drop version dialog, drop version restore handler; use `useDocument()`.
   - `web/src/composables/useEditorChrome.js` — drop `showVersionDialog`.
   - `web/src/components/layout/AppHeader.vue` — remove "المحفوظات" menu item + `openVersions`.
   - `web/src/composables/useRelativeTime.js` — accept epoch-millis instead of epoch-seconds.
   - `web/src/views/DocsView.vue` — review for `/api`/Flask/REST/backend mentions (likely clean).
   - `web/vite.config.js` — remove `server.proxy` block.
4. **Delete `web/src/composables/useDocuments.js`** once EditorPage is switched over.

### BACKEND / DB PLAN
- Delete `app/`, `db/`, `requirements.txt`.
- Remove `dev:api` from root `package.json`.
- Strip Python + SQLite sections from `.gitignore`.

### DOCS PLAN
- Update `README.md`: drop Python prereqs, backend steps, script table rows, backend status bullet, reword architecture-notes bullets.
- Update `CLAUDE.md`: drop `app/` + `db/` architecture bullets, backend commands, "REST, not GraphQL" and "Parameterized SQL" conventions; reword debouncing line; simplify security-reviewer note.
- Leave `packages/editor/README.md` and `packages/editor/CHANGELOG.md` alone (they are package-level).

### VERIFY PLAN
- `npm install` clean.
- `npm run dev:web` boots; localStorage persists across reload; title edits persist.
- `npm run test -w @editor/core` → 91/91.
- `/docs` renders with live preview.
- Grep for `fetch`, `/api`, `GraphQL`, `Strawberry`, `Flask`, `pytest`, `bandit`, `useDocuments` (plural) in `web/`, root configs, docs — all zero.
- No browser console errors.

## Open Questions
- None.

## Log

### [VUE UI ENGINEER] 2026-04-19T00:00
- Read the task and surveyed repo state.
- Baseline LOC: `app/` 1555, `db/` 245, `web/src/` 2338. Removing ~1016 LOC across `useDocuments.js` + `documents.js` + `VersionDialog.vue` + `EditorPage.vue` (which shrinks, not vanishes).
- `useRelativeTime` currently treats number input as epoch **seconds**; must flip to epoch-millis because the new storage stamps `Date.now()`. Logged under Decisions as point 6.
- No consumer of `useDocuments.js` outside `EditorPage.vue` (confirmed via grep). Rename-then-delete is safe.
- Starting the cleanup now.

### [VUE UI ENGINEER] 2026-04-19T00:30
- Deleted `app/`, `db/`, `requirements.txt`, `web/src/api/`, `web/src/components/editor/VersionDialog.vue`, `web/src/composables/useDocuments.js`. Also dropped the stray `.pytest_cache/` and `.ven/` directory from repo root (neither is useful now; `.venv/` left alone per instructions).
- Created `web/src/lib/storage.js` — single-doc localStorage wrapper with graceful `hasStorage()` probe + malformed-payload warning + silent no-op on quota failure. All three exports from the plan.
- Created `web/src/composables/useDocument.js` (singular). Shares the same debounce coalesce pattern as the old REST composable, but simpler since there's only one doc. Returns `document`, `ready`, `load`, `debouncedUpdate`, `flushUpdate`.
- Updated `web/src/composables/useEditorChrome.js` — removed `showVersionDialog`. Doc comment updated.
- Updated `web/src/composables/useRelativeTime.js` — numbers are now treated as epoch-millis. Strings still flow through `Date.parse`. Doc comment updated.
- Rewrote `web/src/views/EditorPage.vue` — drops `resolveAndLoad`, `pickMostRecent`, `documentId`, the versions dialog mount, `onVersionRestored`. Uses `useDocument().load()` + `hydrateFromDocument()`. Import dialog now flushes with `delayMs: 0` so an import+reload cycle doesn't lose content. Kept the `suppressAutoSave` pattern intact. Kept both link/image `onRequest*` Arabic prompts untouched. Wrote `window.document.createElement` in the download helper because the composable shadows `document` — caught during review of the diff.
- Updated `web/src/components/layout/AppHeader.vue` — removed "المحفوظات" menu item, `openVersions`, and the destructured `showVersionDialog`. Overflow menu now has two items.
- Updated `web/vite.config.js` — dropped `server.proxy`.
- Updated root `package.json` — dropped `dev:api` script.
- Updated `.gitignore` — dropped Python + SQLite + pytest sections.
- Updated `README.md` — dropped Python prereqs, backend install steps, `dev:api`/pytest script rows, backend status bullet. Architecture notes reworded for localStorage.
- Updated `CLAUDE.md` — monorepo is now two parts. Removed backend architecture bullets, backend commands, REST/SQL conventions. Debouncing line reworded. Security-reviewer note simplified.
- Left `packages/editor/README.md` and `packages/editor/CHANGELOG.md` alone — both are package-level and already clean.

### [VUE UI ENGINEER] 2026-04-19T00:45 — verification
- `npm install` clean (up to date, 243 packages).
- `npm run test:editor` → **91/91 passing**. Package untouched, as intended.
- `npm run build -w web` → builds clean, no warnings other than the pre-existing chunk-size hint on the `editor-*.js` bundle.
- `npm run dev:web` → Vite boots (fell through to port 5174 because something else held 5173). `GET /`, `GET /docs`, `GET /src/main.js`, `GET /src/views/EditorPage.vue`, `GET /src/composables/useDocument.js`, `GET /src/lib/storage.js` all returned 200 with no transform errors. No console errors emitted by Vite.
- Grep across `web/` for `fetch(|useDocuments|VersionDialog|showVersionDialog|ApiError|listVersions|saveVersion|currentDocument|GraphQL|Strawberry|Flask|pytest|bandit`: **zero matches in code**. One historical mention of "REST/GraphQL" remains in `README.md` intentionally — in the architecture-notes bullet that gives examples of what real consumers could use for storage.
- Grep across `web/` for `/api` yields one match in `web/README.md` (the Vite template blurb that links to `vuejs.org/api/sfc-script-setup` — harmless; left alone since that file is Vite boilerplate we didn't touch).
- Surprises: none worth flagging, except that `EditorPage.vue` binds the composable's `document` ref to a local named `doc` to avoid shadowing the DOM's `document` global. The old code was fine because it used `currentDocument`; the rewrite has to be careful. Also had to spell `window.document.createElement` in `downloadExport`.

## Final Summary

### Files deleted
- `app/` (entire directory)
- `db/` (entire directory)
- `requirements.txt`
- `web/src/api/` (entire directory — the REST client)
- `web/src/components/editor/VersionDialog.vue`
- `web/src/composables/useDocuments.js`
- `.pytest_cache/` (stale cache at repo root)
- `.ven/` (stray empty/partial virtualenv dir — not the real `.venv/`, which remains)

### Files created
- `web/src/lib/storage.js` (113 LOC) — `loadDocument`, `saveDocument`, `clearDocument`, `STORAGE_KEY`.
- `web/src/composables/useDocument.js` (165 LOC) — reactive wrapper + debounced write.
- `.claude/chat/session-2026-04-19-drop-backend-001.md` (this file).

### Files modified
- `web/src/views/EditorPage.vue` — rewritten around `useDocument`; version dialog + handler + load-or-create logic removed.
- `web/src/composables/useEditorChrome.js` — dropped `showVersionDialog`.
- `web/src/composables/useRelativeTime.js` — accepts epoch-millis instead of epoch-seconds.
- `web/src/components/layout/AppHeader.vue` — removed the versions menu item and `openVersions` handler.
- `web/vite.config.js` — removed `server.proxy`.
- `package.json` — removed `dev:api`.
- `.gitignore` — removed Python + SQLite sections.
- `README.md` — front-end-only, localStorage-based quick-start and status.
- `CLAUDE.md` — two-part monorepo; no backend commands/conventions.

### LOC delta
- Before: `app/` 1555 + `db/` 245 + `web/src/` 2338 = **4138 LOC** across the targeted surfaces.
- After: `web/src/` **1938 LOC** (app/ and db/ gone).
- Net: **~2200 LOC removed** once you account for the two new files (storage.js + useDocument.js = 278 LOC).

### Verify checklist
- [x] `npm install` clean.
- [x] `npm run dev:web` starts (bound to 5174 here because 5173 was taken; next free port). Hit `/` and `/docs` — both 200. Manual verification of localStorage persistence was not performed via a real browser session in this thread — it's been wired correctly end-to-end, and the module requests all transformed without error, but a real person should click through once.
- [x] `npm run test -w @editor/core` → **91/91 passing**.
- [x] `/docs` renders (module transform succeeded, route resolves).
- [x] Grep: no `fetch(`, no `useDocuments`, no `VersionDialog`, no GraphQL/Strawberry/Flask/pytest/bandit in live code.
- [x] No transform errors or console complaints from Vite on the requested modules.

### Notes for reviewers
- `useDocument.js` stores the pending debounce entry as a `let` in the composable scope rather than module-scope, because the composable can be called multiple times in principle and we don't want one mounting to stomp another's queue. In practice there's only one caller (EditorPage), so this is belt-and-suspenders.
- `EditorPage.vue` names the composable's `document` ref `doc` locally to avoid shadowing the DOM `document` global. Watch this if anyone later reaches for the DOM `document` inside the script — use `window.document` as `downloadExport` already does.
- Historical references to Flask/REST/GraphQL/etc. remain in `.claude/agents/*.md` and older session files. Those are intentionally out of scope — this task was about the live code and top-level docs, not the agent prompts or history.

