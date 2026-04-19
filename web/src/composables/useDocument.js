/**
 * useDocument — reactive wrapper around the single-document localStorage
 * layer in `../lib/storage.js`.
 *
 * The demo persists exactly one document; there is no list, no id, no
 * history. This composable exposes:
 *
 *   - `document` — a reactive ref holding `{ title, content_md, updated_at }`,
 *     or `null` until `load()` runs.
 *   - `ready` — flips to `true` after the initial `load()` resolves.
 *   - `load()` — reads localStorage (or seeds an empty document if
 *     nothing is stored yet) and is called once on mount.
 *   - `debouncedUpdate(patch, { delayMs })` — merges a partial update,
 *     coalesces rapid calls, and flushes to localStorage.
 *   - `flushUpdate()` — forces any pending debounced write to run now.
 *
 * Debouncing design (mirrors what the old REST version did per-doc,
 * but simpler because there is only one document): successive calls
 * before the timer fires merge into the same pending patch, so many
 * keystrokes produce one `localStorage.setItem`. Callers still await
 * the returned Promise if they need to know when the write lands.
 */

import { ref, shallowRef } from 'vue'
import { loadDocument, saveDocument } from '../lib/storage.js'

/** Default shape written when localStorage is empty on first load. */
const EMPTY_DOCUMENT = Object.freeze({
  title: '',
  content_md: '',
  updated_at: null,
})

export function useDocument() {
  /** The currently-loaded document, or `null` before `load()` completes. */
  const document = shallowRef(null)

  /** True once `load()` has resolved at least once. */
  const ready = ref(false)

  // --- Debounce state -------------------------------------------------------
  //
  // Single pending entry (there's only one document). Shape:
  //
  //   {
  //     patch: { title?, content_md? },   // merged fields to write
  //     timer: TimeoutID | null,
  //     promise: Promise<Document>,       // shared across coalesced calls
  //     resolve: (doc) => void,
  //     reject: (err) => void,
  //   }
  //
  // Held in a module-level `let` inside the composable scope so we can
  // drop and recreate it cleanly across flushes.
  let pending = null

  function enqueuePending() {
    let resolvePromise
    let rejectPromise
    const promise = new Promise((resolve, reject) => {
      resolvePromise = resolve
      rejectPromise = reject
    })
    pending = {
      patch: {},
      timer: null,
      promise,
      resolve: resolvePromise,
      reject: rejectPromise,
    }
    return pending
  }

  /**
   * Read from localStorage (or seed an empty document). Safe to call
   * more than once — it just re-reads the current value. Flips `ready`
   * to `true`.
   */
  function load() {
    const stored = loadDocument()
    // If nothing is stored, start from the empty shape. Do NOT write
    // back yet — the first real edit will create the record. That keeps
    // "opened but never typed" from leaving state behind.
    document.value = stored ?? { ...EMPTY_DOCUMENT }
    ready.value = true
    return document.value
  }

  /**
   * Merge `patch` (a subset of `{ title, content_md }`) into the pending
   * update and schedule a flush `delayMs` from the last call. Returns
   * a Promise that resolves with the document once the flush lands.
   *
   * If the document hasn't been loaded yet, the call still queues the
   * patch; the first flush merges it onto a freshly-loaded document
   * shape. In normal use this never happens — EditorPage calls `load()`
   * in `onMounted` before the editor starts emitting changes.
   */
  function debouncedUpdate(patch, { delayMs = 500 } = {}) {
    if (!pending) enqueuePending()
    // Merge: later values override earlier ones per-field.
    pending.patch = { ...pending.patch, ...patch }

    if (pending.timer) clearTimeout(pending.timer)
    pending.timer = setTimeout(() => {
      // Error path: flushUpdate swallows nothing; the unhandled-rejection
      // here is captured by the shared promise, which callers are already
      // awaiting.
      flushUpdate()
    }, delayMs)
    return pending.promise
  }

  /**
   * Flush the queued patch synchronously. Useful on unmount and before
   * navigation so the last edit is not lost. Safe to call when nothing
   * is pending (returns `null`).
   */
  function flushUpdate() {
    const entry = pending
    if (!entry) return null

    if (entry.timer) {
      clearTimeout(entry.timer)
      entry.timer = null
    }

    // Detach before writing so a new debouncedUpdate() landing during
    // save starts a fresh queue.
    pending = null
    const { patch, resolve, reject } = entry

    if (!patch || Object.keys(patch).length === 0) {
      resolve(document.value)
      return document.value
    }

    try {
      // Merge patch onto whatever the current in-memory doc is (using
      // the empty shape as a fallback for the never-loaded case).
      const base = document.value ?? { ...EMPTY_DOCUMENT }
      const next = saveDocument({
        title: patch.title !== undefined ? patch.title : base.title,
        content_md:
          patch.content_md !== undefined ? patch.content_md : base.content_md,
      })
      document.value = next
      resolve(next)
      return next
    } catch (err) {
      reject(err)
      throw err
    }
  }

  return {
    // State
    document,
    ready,
    // Methods
    load,
    debouncedUpdate,
    flushUpdate,
  }
}
