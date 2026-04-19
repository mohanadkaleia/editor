<script setup>
// Per-block hover controls.
//
// Mounted once by `Editor.vue` and kept in the tree for the life of the
// editor. Currently surfaces a single affordance: a "+" button that
// appears next to empty paragraphs. Clicking it inserts an empty
// paragraph below and opens the slash menu in command-palette mode so
// the user can pick a block type.
//
// The overlay is only rendered when:
//   - `enabled` is true
//   - the hovered block is an empty paragraph
//   - the slash menu is not currently open
//
// Hide semantics: a single global mousemove listener on `document`,
// rAF-throttled. On every frame we classify the event's target:
//   - Inside the editor's content DOM → update the hovered block.
//   - Inside our own overlay → keep the current hover alive.
//   - Neither → arm a short grace-period timer (to survive the few
//     pixels of <body> the cursor transits between the block and the
//     overlay). Timer cancels if the cursor re-enters either region.

import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  shallowRef,
  watch,
} from 'vue'
import { TextSelection } from 'prosemirror-state'
import { slashMenuKey, SLASH_MENU_META } from './slashMenuPlugin.js'
import {
  findTopLevelBlockAtCoords,
  computeControlsPosition,
} from './blockControls.js'

const props = defineProps({
  // The ProseMirror EditorView owning this overlay. Null before mount;
  // no-ops in that window.
  view: { type: Object, default: null },
  // Revision counter — bumps on every transaction. We watch it so we
  // can re-read the slash-menu plugin state and hide the overlay while
  // the slash menu is open.
  revision: { type: Number, default: 0 },
  // Document direction — drives physical-side positioning.
  dir: { type: String, default: 'rtl' },
  // Master switch. `false` → component never listens to mousemove.
  enabled: { type: Boolean, default: true },
})

const hovered = shallowRef(null) // { node, from, to } | null
const coords = ref(null) // { left, top } | null

// Slash-menu state snapshot — we hide controls while the menu is open so
// the two popovers don't compete visually. Refreshed every revision tick.
const slashActive = ref(false)

function readSlashActive(view) {
  if (!view) return false
  try {
    const state = slashMenuKey.getState(view.state)
    return !!(state && state.active)
  } catch {
    return false
  }
}

// The "+" button is only meaningful on an empty paragraph — it's the
// "pick a block type here" affordance. Populated blocks are noisy.
const showPlus = computed(() => {
  const node = hovered.value && hovered.value.node
  if (!node) return false
  return node.type.name === 'paragraph' && node.content.size === 0
})

const visible = computed(() => {
  if (!props.enabled) return false
  if (slashActive.value) return false
  if (!hovered.value || !coords.value) return false
  // No controls to show → don't render the overlay at all.
  if (!showPlus.value) return false
  return true
})

// --- Mousemove plumbing --------------------------------------------------

let rafHandle = 0
let lastEvent = null

// Grace period for "over neither": lets the cursor transit the few
// pixels of body between the block and the overlay without the overlay
// vanishing under the pointer.
let hideTimer = 0
const HIDE_GRACE_MS = 80

function cancelPendingHide() {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = 0
  }
}

function armPendingHide() {
  if (hideTimer) return
  hideTimer = setTimeout(() => {
    hideTimer = 0
    hideOverlay()
  }, HIDE_GRACE_MS)
}

function onDocumentMouseMove(event) {
  if (!props.enabled) return
  if (!props.view) return
  lastEvent = event
  if (rafHandle) return
  rafHandle = requestAnimationFrame(() => {
    rafHandle = 0
    flushHover()
  })
}

function isInsideOverlay(el) {
  return el instanceof Element && !!el.closest('.kurrasah-block-controls')
}

function isInsideViewDom(el) {
  if (!(el instanceof Element)) return false
  const view = props.view
  if (!view || !view.dom) return false
  return view.dom.contains(el) || el === view.dom
}

function hideOverlay() {
  if (rafHandle) {
    cancelAnimationFrame(rafHandle)
    rafHandle = 0
  }
  cancelPendingHide()
  hovered.value = null
  coords.value = null
}

function flushHover() {
  const view = props.view
  if (!view || !lastEvent) return
  const target = lastEvent.target
  const overOverlay = isInsideOverlay(target)
  const overView = isInsideViewDom(target)

  if (!overView && !overOverlay) {
    armPendingHide()
    return
  }

  // Cursor is on the editor or the overlay — cancel any pending hide.
  cancelPendingHide()

  if (overOverlay && !overView) {
    // Cursor is on the overlay itself; keep the current hover as-is.
    return
  }

  // Cursor is inside the editor's DOM — resolve the block under it.
  const block = findTopLevelBlockAtCoords(view, lastEvent.clientX, lastEvent.clientY)
  if (!block) {
    // In an unsupported region (whitespace between blocks, padding).
    // Keep the last hover alive so the overlay doesn't flicker.
    return
  }
  if (
    hovered.value &&
    hovered.value.from === block.from &&
    hovered.value.to === block.to
  ) {
    return
  }
  hovered.value = block
  coords.value = computeControlsPosition({
    view,
    from: block.from,
    to: block.to,
    dir: props.dir,
  })
}

// --- Attach/detach listeners --------------------------------------------

let listenersAttached = false

function attachListeners() {
  if (listenersAttached || !props.enabled) return
  document.addEventListener('mousemove', onDocumentMouseMove)
  listenersAttached = true
}

function detachListeners() {
  if (!listenersAttached) return
  document.removeEventListener('mousemove', onDocumentMouseMove)
  listenersAttached = false
  if (rafHandle) {
    cancelAnimationFrame(rafHandle)
    rafHandle = 0
  }
  cancelPendingHide()
}

watch(
  () => [props.view, props.enabled],
  ([view, enabled]) => {
    if (view && enabled) {
      attachListeners()
    } else {
      detachListeners()
      hovered.value = null
      coords.value = null
    }
  },
  { immediate: true }
)

// Recompute slash-menu "is open" on every transaction and refresh the
// anchored coordinates — the hovered block's screen position can shift
// when the user types elsewhere.
watch(
  () => props.revision,
  () => {
    const view = props.view
    if (!view) return
    slashActive.value = readSlashActive(view)
    if (hovered.value) {
      const next = computeControlsPosition({
        view,
        from: hovered.value.from,
        to: hovered.value.to,
        dir: props.dir,
      })
      if (next) coords.value = next
    }
  }
)

onBeforeUnmount(() => {
  detachListeners()
})

// --- Actions -------------------------------------------------------------

function onPlusClick() {
  const view = props.view
  const hoveredBlock = hovered.value
  if (!view || !hoveredBlock) return

  // The hovered block is already an empty paragraph (the only shape
  // showPlus permits). Place the cursor inside it and open the slash
  // menu — the chosen block command (`setHeading`, `toggleBulletList`,
  // …) then transforms THIS paragraph in place. Inserting a new
  // paragraph below would make the element appear on the next line,
  // which is what users intuitively don't expect.
  const state = view.state
  let tr = state.tr
  const cursorPos = hoveredBlock.from + 1
  try {
    tr = tr.setSelection(TextSelection.create(tr.doc, cursorPos))
  } catch {
    // If the computed pos is out of range, fall back to opening the
    // palette without moving the selection.
  }
  tr = tr.setMeta(slashMenuKey, {
    action: SLASH_MENU_META.OPEN_COMMAND_PALETTE,
  })
  view.dispatch(tr)
  nextTick(() => {
    try { view.focus() } catch { /* view gone */ }
  })
}

// Stop mousedown on the overlay from bubbling into the editor DOM — we
// don't want clicking the overlay to move the caret or deselect.
function onOverlayMouseDown(event) {
  event.stopPropagation()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="kurrasah-block-controls"
      :class="{ 'is-visible': visible }"
      role="group"
      aria-label="Block controls"
      :style="{
        left: coords.left + 'px',
        top: coords.top + 'px',
      }"
      @mousedown="onOverlayMouseDown"
    >
      <button
        type="button"
        class="kurrasah-block-control kurrasah-block-control-add"
        aria-label="Add block"
        title="Add block"
        @click="onPlusClick"
      >
        <span class="kurrasah-block-control-glyph" dir="ltr" aria-hidden="true">+</span>
      </button>
    </div>
  </Teleport>
</template>
