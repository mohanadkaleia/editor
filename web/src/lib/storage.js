/**
 * storage.js — single-document localStorage wrapper.
 *
 * The demo app persists exactly one document. There is no document list,
 * no ids, no versions. The whole shape lives under a single key:
 *
 *   editor.document.v1 -> { title, content_md, updated_at }
 *
 * `updated_at` is a JS epoch-millis number (what `Date.now()` returns);
 * it's an internal mtime only — the UI renders relative time from it.
 *
 * All access is wrapped in try/catch so environments without
 * `localStorage` (old private-mode Safari, SSR, sandboxed iframes)
 * degrade to "no document" + silent no-op writes rather than crashing
 * the app. A malformed payload logs a warning and returns `null`, so
 * the caller can initialize fresh without the user losing their work
 * on the next write.
 */

export const STORAGE_KEY = 'editor.document.v1'

/**
 * True if `localStorage` is reachable AND writable from this execution
 * context. We probe with a read + a setItem/removeItem pair so we also
 * catch quota-exceeded / locked-down scenarios, not just SSR.
 */
function hasStorage() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false
    const probe = '__editor_storage_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

/**
 * Read the persisted document. Returns `null` when there's no payload,
 * when `localStorage` is unavailable, or when the stored JSON is
 * malformed (the malformed case is logged so developers notice — but
 * we still return `null` so callers can recover by initializing).
 */
export function loadDocument() {
  if (!hasStorage()) return null
  let raw
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
  if (raw == null) return null
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    // Fill in any missing keys defensively so callers can treat the
    // shape as total.
    return {
      title: typeof parsed.title === 'string' ? parsed.title : '',
      content_md: typeof parsed.content_md === 'string' ? parsed.content_md : '',
      updated_at:
        typeof parsed.updated_at === 'number' && Number.isFinite(parsed.updated_at)
          ? parsed.updated_at
          : null,
    }
  } catch (err) {
    // Don't throw. A corrupt cache is an edge case; the consumer will
    // just start from empty and the next save will overwrite it.
    console.warn('[editor/storage] failed to parse stored document, ignoring:', err)
    return null
  }
}

/**
 * Persist `{ title, content_md }`. Stamps `updated_at = Date.now()`
 * internally; callers don't pass it. Returns the object that was
 * written (so callers can pick up the fresh timestamp without a
 * re-read). If `localStorage` is unavailable the write is a silent
 * no-op and the caller still gets a populated return value so UI
 * state (e.g. "modified X ago") stays coherent in-session.
 */
export function saveDocument({ title = '', content_md = '' } = {}) {
  const record = {
    title: typeof title === 'string' ? title : '',
    content_md: typeof content_md === 'string' ? content_md : '',
    updated_at: Date.now(),
  }
  if (!hasStorage()) return record
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch (err) {
    // Quota exceeded / write blocked. We already have the in-memory
    // record; the caller will keep displaying it until the tab is
    // closed. Warn so it shows up in the console during development.
    console.warn('[editor/storage] failed to save document:', err)
  }
  return record
}

/**
 * Delete the persisted document. Not currently wired to any UI; kept
 * as a convenience so a future "reset document" affordance has an
 * obvious entry point.
 */
export function clearDocument() {
  if (!hasStorage()) return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore — nothing actionable.
  }
}
