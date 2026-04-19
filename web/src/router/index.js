import { createRouter, createWebHistory } from 'vue-router'
import EditorPage from '../views/EditorPage.vue'

// Single-editor app: the root route renders the editor directly. There
// is no document list, no `/editor/:id` — the view resolves "the
// document" at mount time (load-or-create).
//
// `/docs` is a sibling route to `/` — a static documentation page for
// the `@editor/core` package. It is intentionally code-split (dynamic
// import) so the base route's bundle is unaffected when users only
// visit the editor.
const routes = [
  {
    path: '/',
    name: 'editor',
    component: EditorPage,
  },
  {
    path: '/docs',
    name: 'docs',
    component: () => import('../views/DocsView.vue'),
  },
  // Catch-all: redirect anything else back to `/` so old bookmarks
  // (e.g. `/editor/:id` from the previous shell) still land on the
  // editor rather than 404.
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
