# kurrasah

[![npm](https://img.shields.io/npm/v/kurrasah.svg)](https://www.npmjs.com/package/kurrasah)
[![license](https://img.shields.io/npm/l/kurrasah.svg)](./LICENSE)

A reusable Vue 3 + ProseMirror markdown editor with RTL-first defaults.

**Live demo**: [mohanadkaleia.github.io/kurrasah](https://mohanadkaleia.github.io/kurrasah/) · **npm**: [`kurrasah`](https://www.npmjs.com/package/kurrasah)

```bash
npm install kurrasah
```

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

Full API reference in [`packages/kurrasah/README.md`](./packages/kurrasah/README.md).

---

The package is the deliverable — backend-agnostic, markdown in and markdown out, zero coupling to any storage layer. This repo also ships a small front-end-only demo that exercises the package end-to-end; it persists a single document in `localStorage`, which is just a stand-in for whatever storage a real consumer brings.

## Highlights

- **Headless ProseMirror** — not Tiptap. Direct schema + commands, full control.
- **RTL-first** — `dir="rtl"` by default, logical CSS properties throughout, forced-LTR code blocks.
- **Markdown is the truth** — documents are stored as markdown strings. No custom AST, no operation log. Uses `prosemirror-markdown` for parse/serialize.
- **Small, stable surface** with a hand-written `.d.ts` shipped.
- **Slash-style block picker** — type `@` at the start of a line (or `Cmd/Ctrl+K`) to open a Notion-style block menu. English **and** Arabic aliases (`@h1` = `@عنوان`). `@` rather than `/` because `/` maps to `ظ` on the Arabic keyboard.
- **"+" affordance on empty lines** — hover a blank paragraph to surface a `+` button that opens the block picker on that same line.
- **Click-to-open links** — plain click on a link follows it in a new tab (Medium/Substack-style); `Cmd/Ctrl+click` places the caret inside for editing the anchor text.
- **Content**: paragraph, heading 1–3, bullet/ordered lists, blockquote, code block, hard break, image; marks: bold, italic, link, inline code.

## Repository layout

```
/
├── packages/kurrasah/   # the reusable package (primary product)
└── web/                 # Vue 3 demo consumer (single document, localStorage)
```

Monorepo via npm workspaces.

## Quick start

Prereqs: Node 18+.

```bash
git clone https://github.com/mohanadkaleia/kurrasah.git
cd kurrasah
npm install
npm run dev:web
```

Open `http://localhost:5173`. Package usage docs live at `/docs`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev:web` | Start the demo Vite dev server |
| `npm run build:editor` | Build `kurrasah` in Vite lib mode |
| `npm run test:editor` | Run the package's vitest suite |

## Using the package

Props, events, exposed methods, callback hooks, keyboard shortcuts, input rules, and styling hooks are all documented in [`packages/kurrasah/README.md`](./packages/kurrasah/README.md). You can also run the demo locally and open `/docs` for a live reference.

## Publishing

Release checklist for the `kurrasah` package lives in [`PUBLISHING.md`](./PUBLISHING.md).

## Status

- Package: **v0.4.1**, 126 vitest tests passing, TypeScript declarations shipped.
- Demo app: single-document editor persisted to `localStorage`, with import/export, a floating selection toolbar, a slash-style block picker, and a hover-surfaced "+" on empty lines.

## Architecture notes

- The package is **backend-agnostic**. It does not fetch, persist, or authenticate. All of that belongs in the consumer. The demo persists to `localStorage`; real consumers will use their own storage (a REST/GraphQL API, IndexedDB, a CRDT, whatever fits).
- The consumer is responsible for **debouncing** writes. The package emits `update:modelValue` on every transaction — do not wire that directly to a persistence call. The demo debounces its `localStorage` writes at 500 ms.
- Styling is **scoped to `.editor-root`** inside the package. Consumers can override prose styles via a wrapper class (the demo uses `.editor-canvas`).

## License

MIT — see [LICENSE](./LICENSE).
