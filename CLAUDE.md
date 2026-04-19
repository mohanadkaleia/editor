# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repo hosts **`kurrasah`**, a reusable Vue 3 + ProseMirror markdown editor with RTL-first defaults, and a thin front-end-only demo app (`web/`) that exercises the package end-to-end. The editor is the primary deliverable; the demo is a reference consumer. The editor itself is backend-agnostic — markdown in, markdown out.

## Architecture

npm-workspaces monorepo with two parts:

- **`packages/editor/`** — `kurrasah`, the reusable Vue 3 + ProseMirror package. **Primary product.** Backend-agnostic; zero fetch, zero storage, zero auth.
  - `src/Editor.vue` — the public component
  - `src/Toolbar.vue` — optional minimal toolbar
  - `src/schema.js` — ProseMirror schema (paragraph, heading 1–3, lists, blockquote, code_block, hard_break, image; marks: strong, em, link, code)
  - `src/markdown.js` — `parseMarkdown` / `serializeMarkdown` via `prosemirror-markdown`
  - `src/plugins.js` — history, keymap, input rules, placeholder
  - `src/commands.js` — named command factories (`toggleBold`, `setHeading`, `toggleLink`, ...)
  - `src/style.css` — prose CSS, logical properties, RTL-safe, scoped under `.editor-root`
  - `test/` — Vitest unit tests (schema, markdown roundtrip, editor, plugins)
  - Built with Vite in lib mode; externalizes `vue` and all `prosemirror-*` so consumers dedup.
- **`web/`** — Vue 3 + Vite + Tailwind front-end-only demo. **Consumer of `kurrasah`.**
  - `web/src/views/` — EditorPage (hosts `<Editor>`), DocsView
  - `web/src/lib/storage.js` — single-document `localStorage` wrapper
  - `web/src/composables/useDocument.js` — reactive state + debounced write helper
  - `web/src/components/` — UI (layout, dialogs) and editor (FloatingToolbar)

## Development Commands

From the repo root:

```bash
npm install                              # Hoists workspace deps (web + packages/editor)

npm run dev:web                          # Start Vite dev server (localhost:5173)

npm run test:editor                      # Vitest for kurrasah
npm run build:editor                     # Vite lib build for kurrasah (outputs to packages/editor/dist/)
```

## Key Conventions

- **Editor code lives in `packages/editor/` and must stay backend-agnostic.** No fetch, no localStorage, no auth hooks, no routing. The package takes markdown in and emits markdown out. Anything beyond that belongs in the consumer (`web/` today, other consumers later).
- **RTL-first**: default `dir="rtl"` everywhere. In the package, use **logical CSS properties only** (`padding-inline-start`, `margin-inline-end`, `border-inline-start`). Never `padding-left`/`margin-right`/etc. The only deliberate exception is the forced-LTR `<pre>` rule for code blocks. Test RTL immediately, not as an afterthought.
- **Black & white aesthetic**: no colors except for semantic feedback (errors/success) and minor neutral grays for code backgrounds and deemphasized text. No brand palette.
- **Vue 3 Composition API**: `<script setup>` exclusively. Reuse existing composables before creating new ones.
- **Debouncing is the consumer's job**: the editor emits on every transaction. `web/` debounces its `localStorage` writes (`useDocument.debouncedUpdate`, 500 ms). Real consumers talking to a network should do the same.
- **Package API stability**: `kurrasah` props/events/methods are a consumer contract. Treat changes as potentially breaking; prefer adding props over changing existing behavior.

## Agent Workflow

This project uses specialized agents coordinated through session files in `.claude/chat/`:

- **tech-lead**: Plans features, creates session files, coordinates agents. Only agent that talks to the user.
- **python-engineer**: Implements backend code if a backend returns. Not active on the current front-end-only surface.
- **ui-engineer**: Implements frontend code in `web/` and the editor package in `packages/editor/`.
- **code-reviewer**: Reviews code for correctness, design, style, tests, and RTL compliance.
- **security-reviewer**: Reviews for security vulnerabilities if any backend/auth work returns.

### Session files

Each task gets a session file: `.claude/chat/session-YYYY-MM-DD-<task-slug>-NNN.md`

Sections: Header, Implementation Plan (BACKEND/FRONTEND/DATA/TEST), Decisions, Open Questions, Log, Review Notes, Final Summary.

Workflow: explore → plan → implement → test → review. A session is only marked Completed after all MUST-FIX and HIGH/MEDIUM items from code review (and security review, when applicable) are resolved.
