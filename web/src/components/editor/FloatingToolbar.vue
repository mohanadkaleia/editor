<script setup>
/**
 * FloatingToolbar — pill-shaped inline formatting toolbar that appears
 * above the current text selection inside the editor.
 *
 * Visual: light surface, small round buttons, subtle border + shadow.
 * Matches the v2 mockup's "light pill" look rather than the prior dark
 * variant.
 *
 * Positioning:
 *   - Listens to `selectionchange` on `document` and `scroll`/`resize`
 *     on `window`.
 *   - When the selection is non-empty AND its range endpoints live
 *     inside the editor DOM, reads the range's client rect and pins a
 *     fixed-position element above it.
 *   - Clamps to the viewport with an 8px gutter.
 *
 * Visibility:
 *   - Hidden while the selection is collapsed, empty, or outside the
 *     editor.
 *   - Stays visible while the user is interacting with a toolbar
 *     button (pointer down/up cycle) so clicks land before the
 *     selection-change handler hides the pill.
 *
 * Button set: B, I, inline code, link, H1, H2, H3.
 * Strike is omitted — `kurrasah`'s schema does not define it.
 */

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  /** The exposed `<Editor>` ref (`editor.execCommand`, `editor.view`). */
  editor: { type: Object, default: null },
})

const TOOLBAR_HEIGHT = 40
const GUTTER = 8

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const toolbarEl = ref(null)
const interactingWithToolbar = ref(false)

/** Active-state flags. Recomputed on every selection/command cycle. */
const activeMarks = ref({
  bold: false,
  italic: false,
  code: false,
  link: false,
  h1: false,
  h2: false,
  h3: false,
})

function getEditorDom() {
  // `kurrasah` mounts the contenteditable inside `.editor-mount`.
  return document.querySelector('.editor-canvas .editor-mount')
}

function selectionInsideEditor(selection) {
  if (!selection || selection.isCollapsed) return false
  if (selection.rangeCount === 0) return false
  const editorDom = getEditorDom()
  if (!editorDom) return false
  const anchorOk = editorDom.contains(selection.anchorNode)
  const focusOk = editorDom.contains(selection.focusNode)
  if (!anchorOk || !focusOk) return false
  const text = selection.toString()
  if (!text.trim()) return false
  return true
}

function updatePosition() {
  const selection = window.getSelection()
  if (!selectionInsideEditor(selection)) {
    if (!interactingWithToolbar.value) visible.value = false
    return
  }
  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) {
    if (!interactingWithToolbar.value) visible.value = false
    return
  }

  const tb = toolbarEl.value
  const tbWidth = tb ? tb.offsetWidth || 340 : 340
  const tbHeight = tb ? tb.offsetHeight || TOOLBAR_HEIGHT : TOOLBAR_HEIGHT

  // Prefer above; fall through to below if clipped.
  let y = rect.top - tbHeight - GUTTER
  if (y < GUTTER) y = rect.bottom + GUTTER

  // Center horizontally on the selection rect, clamped to viewport.
  let x = rect.left + rect.width / 2 - tbWidth / 2
  const maxLeft = window.innerWidth - tbWidth - GUTTER
  if (x < GUTTER) x = GUTTER
  if (x > maxLeft) x = maxLeft

  top.value = Math.round(y)
  left.value = Math.round(x)
  visible.value = true
  refreshActiveMarks()
}

function refreshActiveMarks() {
  const editor = props.editor
  const view = editor && editor.view
  if (!view) return
  const { state } = view
  const schema = state.schema
  const { from, to, empty, $from } = state.selection
  const activeMark = (name) => {
    const markType = schema.marks[name]
    if (!markType) return false
    if (empty) return !!markType.isInSet(state.storedMarks || $from.marks())
    return state.doc.rangeHasMark(from, to, markType)
  }
  const headingActive = (level) => {
    const nodeType = schema.nodes.heading
    if (!nodeType) return false
    for (let d = $from.depth; d >= 0; d--) {
      const node = $from.node(d)
      if (node.type === nodeType) return node.attrs.level === level
    }
    return false
  }
  activeMarks.value = {
    bold: activeMark('strong'),
    italic: activeMark('em'),
    code: activeMark('code'),
    link: activeMark('link'),
    h1: headingActive(1),
    h2: headingActive(2),
    h3: headingActive(3),
  }
}

function onSelectionChange() {
  window.requestAnimationFrame(updatePosition)
}

function onPointerDownInToolbar() {
  interactingWithToolbar.value = true
}
function onPointerUpGlobal() {
  if (interactingWithToolbar.value) {
    interactingWithToolbar.value = false
    window.requestAnimationFrame(updatePosition)
  }
}

function exec(name, ...args) {
  if (!props.editor) return
  props.editor.execCommand(name, ...args)
  window.requestAnimationFrame(updatePosition)
}

function handleLink() {
  // `toggleLink` prompts via window.prompt when called without an href.
  exec('toggleLink')
}

onMounted(() => {
  document.addEventListener('selectionchange', onSelectionChange)
  window.addEventListener('scroll', onSelectionChange, true)
  window.addEventListener('resize', onSelectionChange)
  window.addEventListener('pointerup', onPointerUpGlobal, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('selectionchange', onSelectionChange)
  window.removeEventListener('scroll', onSelectionChange, true)
  window.removeEventListener('resize', onSelectionChange)
  window.removeEventListener('pointerup', onPointerUpGlobal, true)
})

const style = computed(() => ({
  top: `${top.value}px`,
  left: `${left.value}px`,
}))

// Light-pill button classes. Active state fills the button with the
// accent color; inactive stays muted with a hover surface.
const btnBase =
  'w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer'
const btnActive = 'bg-accent text-white hover:bg-accent-hover hover:text-white'
</script>

<template>
  <Teleport to="body">
    <div
      v-show="visible"
      ref="toolbarEl"
      :style="style"
      class="fixed z-50 flex items-center gap-0.5 rounded-full p-1.5 bg-white/90 backdrop-blur-xl border border-border shadow-lg"
      dir="ltr"
      data-testid="floating-toolbar"
      @pointerdown="onPointerDownInToolbar"
    >
      <button
        type="button"
        :class="[btnBase, activeMarks.bold ? btnActive : '']"
        title="عريض"
        aria-label="Bold"
        data-testid="floating-bold"
        @click="exec('toggleBold')"
      >
        <i class="fa-solid fa-bold text-[13px]"></i>
      </button>
      <button
        type="button"
        :class="[btnBase, activeMarks.italic ? btnActive : '']"
        title="مائل"
        aria-label="Italic"
        data-testid="floating-italic"
        @click="exec('toggleItalic')"
      >
        <i class="fa-solid fa-italic text-[13px]"></i>
      </button>
      <button
        type="button"
        :class="[btnBase, activeMarks.code ? btnActive : '']"
        title="رمز"
        aria-label="Inline code"
        data-testid="floating-code"
        @click="exec('toggleCode')"
      >
        <i class="fa-solid fa-code text-[13px]"></i>
      </button>
      <button
        type="button"
        :class="[btnBase, activeMarks.link ? btnActive : '']"
        title="رابط"
        aria-label="Link"
        data-testid="floating-link"
        @click="handleLink"
      >
        <i class="fa-solid fa-link text-[13px]"></i>
      </button>
      <div class="w-px h-4 bg-border mx-1" aria-hidden="true"></div>
      <button
        type="button"
        :class="[btnBase, 'text-xs font-semibold', activeMarks.h1 ? btnActive : '']"
        title="عنوان 1"
        aria-label="Heading 1"
        data-testid="floating-h1"
        @click="exec('toggleHeading', 1)"
      >
        H1
      </button>
      <button
        type="button"
        :class="[btnBase, 'text-xs font-semibold', activeMarks.h2 ? btnActive : '']"
        title="عنوان 2"
        aria-label="Heading 2"
        data-testid="floating-h2"
        @click="exec('toggleHeading', 2)"
      >
        H2
      </button>
      <button
        type="button"
        :class="[btnBase, 'text-xs font-semibold', activeMarks.h3 ? btnActive : '']"
        title="عنوان 3"
        aria-label="Heading 3"
        data-testid="floating-h3"
        @click="exec('toggleHeading', 3)"
      >
        H3
      </button>
    </div>
  </Teleport>
</template>
