/**
 * useEditorChrome — a tiny shared-state channel between the app
 * header and the editor view.
 *
 * Because the header (`AppHeader.vue`) lives at the top of `App.vue`
 * and the editor view lives inside `<router-view />`, they need a
 * way to exchange a couple of pieces of state:
 *
 *   - "Open import" / "open export" — triggered from the header's
 *     overflow menu, but the dialog components are owned by the
 *     editor view (which has the editor ref).
 *   - "Most recent updated_at" — the header shows "modified X ago",
 *     but the timestamp lives on the document loaded by the editor
 *     view.
 *
 * Implementation: module-scoped refs exported through a factory. Every
 * consumer gets the same refs — there is only ever one editor in this
 * app, so a single shared instance is correct. Not a Pinia store; this
 * is the simplest thing that works and keeps the dependency graph lean.
 */

import { ref } from 'vue'

// Module-scoped reactive state. Imported by both AppHeader and EditorPage.
const showImportDialog = ref(false)
const showExportDialog = ref(false)

/** Epoch milliseconds — last-modified timestamp shown in the header. */
const updatedAt = ref(null)

/** True once the editor has resolved "the document" and is ready to
 *  surface overflow-menu actions. Before this, the header should not
 *  expose doc-specific controls. */
const documentReady = ref(false)

export function useEditorChrome() {
  return {
    showImportDialog,
    showExportDialog,
    updatedAt,
    documentReady,
  }
}
