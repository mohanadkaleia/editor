# Changelog

All notable changes to `@editor/core` will be documented here.

Each release lists changes under some of these subsections:
- **Breaking** — consumer must adapt.
- **Added** — new public API.
- **Changed** — non-breaking behavior changes.
- **Fixed** — bug fixes.
- **Notes** — behaviors worth surfacing but not strictly actionable.

## [0.1.2] — 2026-04-18

### Fixed
- `<Editor>` emits (`update:modelValue`, `change`, `ready`) are now
  typed for `<script setup lang="ts">` consumers. Previously the types
  compiled but `@change="(md) => ..."` gave `md` an implicit `any` and
  `$emit('change', 123)` was not rejected. The `DefineComponent` generic
  positioning was wrong — emits live at slot 8, not slot 3. Now explicit.

### Changed
- `ImageRequestContext` changed from `{}` to `Readonly<Record<string, never>>`
  so consumers cannot accidentally pass non-object values. The type is
  still empty; this is a tightening, not a field addition.

### Notes
- `EditorEmits` is now an `EmitsOptions`-shaped type (event name → handler
  signature). Consumers that imported the old tuple-syntax `EditorEmits`
  interface to construct payloads directly should use
  `Parameters<EditorEmits['change']>` instead.

## [0.1.1] — 2026-04-18

### Added
- TypeScript type declarations via a hand-written `types/index.d.ts`.
  Consumers get autocomplete and type-checking for props, events,
  callback signatures, and exposed methods.

### Fixed
- `execCommand` no longer auto-focuses the editor after the async
  link / image path. When a consumer `onRequestLink` / `onRequestImage`
  callback is active, the consumer modal keeps focus until it resolves.
- Callback rejections from `onRequestLink` / `onRequestImage` are now
  surfaced via `console.error` (previously swallowed silently).

### Notes
- `execCommand` returns `true` on the async link / image path as soon
  as the callback is dispatched — not when the edit lands. Documented
  in the README under "Behavioral notes".
- `context.href` in `onRequestLink` reflects the link mark at the
  start of the selection only; mixed-state selections are the
  consumer's problem to detect.

## [0.1.0] — 2026-04-18

### Added
- `onRequestLink` and `onRequestImage` callback props for consumer-side
  link/image UIs. Falls back to English `window.prompt` if not provided.
- `--editor-min-height` CSS variable for consumer-side height control.
- `loading="lazy"` on image nodes.

### Changed
- `markdown-it` is now a declared runtime dependency (previously
  undeclared, relied on transitive resolution).
- `ready` event re-emits after internal view rebuilds (e.g., when
  `images` or `links` props change), so consumers always have a live
  `EditorView` reference.
- Changing the `placeholder` prop no longer rebuilds the editor view
  or wipes the undo stack.

### Fixed
- Dropped dead imports in `plugins.js`.
- Removed redundant dispatcher special-case in `execCommand`.

### Notes
- External `modelValue` changes / `setMarkdown()` calls replace the
  document and reset undo history. User edits through the UI preserve
  undo as expected.

## [0.0.0]
- Initial pre-release.
