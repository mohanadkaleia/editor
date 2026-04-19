# editor

A reusable Vue 3 + ProseMirror markdown editor with RTL-first defaults, plus a minimal front-end-only demo that showcases it.

The editor package (`kurrasah`) is the deliverable — backend-agnostic, markdown in and markdown out, zero coupling to any storage layer. The demo app exists to exercise the package end-to-end. It persists a single document in `localStorage`; consumers bring their own persistence.

## Highlights

- **Headless ProseMirror** — not Tiptap. Direct schema + commands, full control.
- **RTL-first** — `dir="rtl"` by default, logical CSS properties throughout, forced-LTR code blocks.
- **Markdown is the truth** — documents are stored as markdown strings. No custom AST, no operation log. Uses `prosemirror-markdown` for parse/serialize.
- **Small surface** — 7 props, 3 events, 4 exposed methods.
- **v1 content**: paragraph, heading 1–3, bullet/ordered lists, blockquote, code block, hard break, image, plus bold / italic / link / inline code marks.

## Repository layout

```
/
├── packages/editor/      # kurrasah — the reusable package
└── web/                  # Vue 3 demo consumer (single-document, localStorage)
```

Monorepo via npm workspaces.

## Quick start

Prereqs: Node 18+.

```bash
git clone https://github.com/mohanadkaleia/kurrasah.git
cd editor
npm install
npm run dev:web
```

Open `http://localhost:5173`. Package docs live at `/docs`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev:web` | Start the demo Vite dev server |
| `npm run build:editor` | Build `kurrasah` in Vite lib mode |
| `npm run test:editor` | Run the package's vitest suite |

## Using the package in your own app

See `packages/editor/README.md` for the full API reference, or run the demo and visit `/docs`.

Minimal usage:

```vue
<script setup>
import { ref } from 'vue'
import { Editor } from 'kurrasah'
import 'kurrasah/style.css'

const markdown = ref('# مرحبا')
</script>

<template>
  <Editor v-model="markdown" dir="rtl" />
</template>
```

The package is currently workspace-private. When it stabilizes around a second real consumer, it will be published to npm.

## Status

- Package: v0.1.2, 91 vitest tests passing.
- Demo app: single-document editor surface persisted to `localStorage`, with import/export and floating toolbar.

## Architecture notes

- The package is **backend-agnostic**. It does not fetch, persist, or authenticate. All of that belongs in the consumer. The demo persists to `localStorage`; real consumers will use their own storage (a REST/GraphQL API, IndexedDB, a CRDT, whatever fits).
- The consumer is responsible for **debouncing** writes. The package emits `update:modelValue` on every transaction — do not wire that directly to a persistence call. The demo debounces its `localStorage` writes at 500 ms.
- Styling is **scoped to `.editor-root`** in the package. Consumers can override prose styles via a wrapper class (the demo uses `.editor-canvas`).

## License

TBD.
