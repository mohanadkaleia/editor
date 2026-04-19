import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { TextSelection } from 'prosemirror-state'
import { Editor } from '../src/index.js'
import { slashMenuKey, SLASH_MENU_META } from '../src/slashMenuPlugin.js'
import {
  TOP_LEVEL_BLOCK_NAMES,
  findTopLevelBlockAtCoords,
  computeControlsPosition,
} from '../src/blockControls.js'

// Helpers --------------------------------------------------------------

function mountEditor(props = {}) {
  return mount(Editor, {
    attachTo: document.body,
    props,
  })
}

// Wait a frame — jsdom resolves `requestAnimationFrame` asynchronously but
// promptly; a microtask is usually enough, a fallback timeout is safer.
function waitForRaf() {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => resolve())
    } else {
      setTimeout(resolve, 16)
    }
  })
}

// Fire mousemove on `view.dom` with synthetic coords. We stub
// `view.posAtCoords` to return a deterministic mapping from y to block
// index — jsdom doesn't lay out text, so the real `posAtCoords` returns
// undefined and the component can't work unaided.
function stubPosAtCoordsByBlockIndex(view, { blockHeight = 20, blockOffsetY = 10 } = {}) {
  view.posAtCoords = ({ left, top }) => {
    // Translate y into a block index (clamped to the doc's children).
    const doc = view.state.doc
    const idx = Math.max(
      0,
      Math.min(doc.childCount - 1, Math.floor((top - blockOffsetY) / blockHeight))
    )
    // Absolute position at the start of that child (inside its opening).
    let offset = 0
    for (let i = 0; i < idx; i++) offset += doc.child(i).nodeSize
    return { pos: offset + 1, inside: offset }
  }
}

function fireMouseMove(view, clientX, clientY) {
  const event = new MouseEvent('mousemove', {
    bubbles: true,
    cancelable: true,
    clientX,
    clientY,
  })
  view.dom.dispatchEvent(event)
}

// Teleport-to-body leaves the overlay DOM in `document.body` across tests
// if a test forgot to unmount (or if unmount raced with the idle timer).
// Scrub any stray nodes before each assertion-heavy test so we don't read
// bleed-over from a prior run.
afterEach(() => {
  document.body
    .querySelectorAll('.kurrasah-block-controls')
    .forEach((el) => el.remove())
})

// Tests ----------------------------------------------------------------

describe('blockControls — TOP_LEVEL_BLOCK_NAMES allowlist', () => {
  it('covers paragraph, heading, blockquote, code_block, lists, image', () => {
    const expected = [
      'paragraph',
      'heading',
      'blockquote',
      'code_block',
      'bullet_list',
      'ordered_list',
      'image',
    ]
    for (const name of expected) {
      expect(TOP_LEVEL_BLOCK_NAMES).toContain(name)
    }
    // list_item is intentionally excluded.
    expect(TOP_LEVEL_BLOCK_NAMES).not.toContain('list_item')
    expect(TOP_LEVEL_BLOCK_NAMES).not.toContain('hard_break')
    expect(TOP_LEVEL_BLOCK_NAMES).not.toContain('doc')
  })
})

describe('findTopLevelBlockAtCoords — block resolution', () => {
  it('returns the correct block for a heading vs paragraph', async () => {
    const wrapper = mountEditor({ modelValue: '# H1\n\nparagraph here' })
    await nextTick()
    const view = wrapper.vm.view
    stubPosAtCoordsByBlockIndex(view)

    const first = findTopLevelBlockAtCoords(view, 100, 10)
    expect(first).not.toBeNull()
    expect(first.node.type.name).toBe('heading')

    const second = findTopLevelBlockAtCoords(view, 100, 30)
    expect(second).not.toBeNull()
    expect(second.node.type.name).toBe('paragraph')
    // The two blocks should have non-overlapping from/to ranges.
    expect(second.from).toBeGreaterThanOrEqual(first.to)
    wrapper.unmount()
  })

  it('resolves a bullet list as one top-level block (not a list_item)', async () => {
    // A bullet list with one item. The hover cursor is INSIDE the
    // list_item, but the helper should walk up to depth 1 and return
    // the `bullet_list`.
    const wrapper = mountEditor({ modelValue: '- first\n- second' })
    await nextTick()
    const view = wrapper.vm.view
    stubPosAtCoordsByBlockIndex(view)
    // The doc has exactly one top-level block (the bullet_list).
    expect(view.state.doc.firstChild.type.name).toBe('bullet_list')
    const hovered = findTopLevelBlockAtCoords(view, 100, 12)
    expect(hovered).not.toBeNull()
    expect(hovered.node.type.name).toBe('bullet_list')
    expect(hovered.from).toBe(0)
    expect(hovered.to).toBe(view.state.doc.firstChild.nodeSize)
    wrapper.unmount()
  })

  it('returns null when view is null or coords miss the doc', () => {
    expect(findTopLevelBlockAtCoords(null, 0, 0)).toBeNull()
    // A fake view whose posAtCoords always bails.
    const fake = {
      state: { doc: { content: { size: 10 } } },
      posAtCoords() {
        throw new Error('boom')
      },
    }
    expect(findTopLevelBlockAtCoords(fake, 0, 0)).toBeNull()
  })
})

describe('computeControlsPosition — physical positioning', () => {
  it('returns different physical `left` for RTL vs LTR over the same block', async () => {
    const wrapper = mountEditor({ modelValue: 'line' })
    await nextTick()
    const view = wrapper.vm.view

    // Stub coordsAtPos with a deterministic rect — same for any in-block
    // position the helper probes, which mirrors what a single-line
    // paragraph produces in practice.
    view.coordsAtPos = () => ({ left: 100, right: 260, top: 50, bottom: 70 })

    const doc = view.state.doc
    const from = 0
    const to = doc.firstChild.nodeSize

    const ltr = computeControlsPosition({
      view,
      from,
      to,
      dir: 'ltr',
      overlayWidth: 48,
      gap: 8,
    })
    const rtl = computeControlsPosition({
      view,
      from,
      to,
      dir: 'rtl',
      overlayWidth: 48,
      gap: 8,
    })
    // LTR: left - overlayWidth - gap = 100 - 48 - 8 = 44.
    expect(ltr.left).toBe(44)
    // RTL: right + gap = 260 + 8 = 268.
    expect(rtl.left).toBe(268)
    // top is identical — the vertical anchor is direction-agnostic.
    expect(ltr.top).toBe(rtl.top)
    wrapper.unmount()
  })

  it('returns null when coordsAtPos throws', async () => {
    const wrapper = mountEditor({ modelValue: 'x' })
    await nextTick()
    const view = wrapper.vm.view
    view.coordsAtPos = () => {
      throw new Error('detached')
    }
    const pos = computeControlsPosition({
      view,
      from: 0,
      to: 3,
      dir: 'rtl',
    })
    expect(pos).toBeNull()
    wrapper.unmount()
  })
})

describe('BlockControls — "+" button behavior', () => {
  it('opens the command palette inside the hovered empty paragraph without inserting a new one', async () => {
    // The "+" button only renders on an empty paragraph. Clicking it
    // should NOT insert another paragraph — the hovered paragraph is
    // itself the slot, and the slash-menu command will transform it
    // in place (e.g. `setHeading` turns it into a heading).
    const wrapper = mountEditor({ modelValue: '' })
    await nextTick()
    const view = wrapper.vm.view

    // Stub layout so mousemove resolves to block 0 (the empty paragraph).
    stubPosAtCoordsByBlockIndex(view)
    view.coordsAtPos = () => ({ left: 0, right: 100, top: 10, bottom: 30 })

    // Hover over the empty paragraph.
    fireMouseMove(view, 50, 10)
    await waitForRaf()
    await nextTick()

    const plusBtn = document.body.querySelector('.kurrasah-block-control-add')
    expect(plusBtn).not.toBeNull()

    const docBefore = view.state.doc
    const beforeCount = docBefore.childCount

    plusBtn.click()
    await nextTick()

    // No new block inserted — child count is unchanged.
    const docAfter = view.state.doc
    expect(docAfter.childCount).toBe(beforeCount)

    // Cursor is inside the hovered empty paragraph.
    const sel = view.state.selection
    expect(sel.from).toBe(1)

    // Slash menu is open in command-palette mode.
    const sm = slashMenuKey.getState(view.state)
    expect(sm.active).toBe(true)
    expect(sm.source).toBe('command')
    expect(sm.range).toBe(null)

    wrapper.unmount()
  })
})

describe('BlockControls — "+" visibility', () => {
  it('does NOT render on populated blocks (heading, non-empty paragraph)', async () => {
    const wrapper = mountEditor({ modelValue: '# Title\n\nbody' })
    await nextTick()
    const view = wrapper.vm.view
    stubPosAtCoordsByBlockIndex(view)
    view.coordsAtPos = () => ({ left: 0, right: 100, top: 10, bottom: 30 })

    // Hover over the heading (y=10 maps to index 0).
    fireMouseMove(view, 50, 10)
    await waitForRaf()
    await nextTick()

    // No overlay — populated blocks don't get the "+" affordance.
    expect(document.body.querySelector('.kurrasah-block-controls')).toBeNull()

    wrapper.unmount()
  })
})

describe('BlockControls — slash-menu interaction', () => {
  it('hides when the slash-menu plugin is active', async () => {
    // Overlay only renders on an empty paragraph — use an empty doc.
    const wrapper = mountEditor({ modelValue: '' })
    await nextTick()
    const view = wrapper.vm.view
    stubPosAtCoordsByBlockIndex(view)
    view.coordsAtPos = () => ({ left: 0, right: 100, top: 10, bottom: 30 })

    // First show the overlay by hovering the empty paragraph.
    fireMouseMove(view, 50, 10)
    await waitForRaf()
    await nextTick()
    expect(document.body.querySelector('.kurrasah-block-controls')).not.toBeNull()

    // Now open the slash menu via the command-palette meta.
    view.dispatch(
      view.state.tr.setMeta(slashMenuKey, {
        action: SLASH_MENU_META.OPEN_COMMAND_PALETTE,
      })
    )
    await nextTick()

    // Overlay disappears while the slash menu is active.
    expect(document.body.querySelector('.kurrasah-block-controls')).toBeNull()

    wrapper.unmount()
  })
})

describe('BlockControls — disabled via prop', () => {
  it('does not render or listen when blockControlsEnabled is false', async () => {
    const wrapper = mountEditor({
      blockControlsEnabled: false,
      modelValue: 'hello',
    })
    await nextTick()
    const view = wrapper.vm.view
    stubPosAtCoordsByBlockIndex(view)
    view.coordsAtPos = () => ({ left: 0, right: 100, top: 10, bottom: 30 })

    // Try to hover — nothing should appear.
    fireMouseMove(view, 50, 10)
    await waitForRaf()
    await nextTick()
    expect(document.body.querySelector('.kurrasah-block-controls')).toBeNull()

    wrapper.unmount()
  })
})

describe('BlockControls — full editor integration', () => {
  it('coexists with other editor features without breaking existing props', async () => {
    const wrapper = mountEditor({
      modelValue: '# Title\n\nbody',
      blockControlsEnabled: true,
      slashEnabled: true,
      dir: 'rtl',
    })
    await nextTick()
    const view = wrapper.vm.view
    expect(view).toBeDefined()
    // Overlay starts hidden (no hover yet).
    expect(document.body.querySelector('.kurrasah-block-controls')).toBeNull()

    // Typing still works — dispatch a trivial selection + insert.
    view.dispatch(
      view.state.tr.setSelection(TextSelection.create(view.state.doc, 1))
    )
    await nextTick()
    expect(wrapper.vm.getMarkdown()).toContain('Title')
    wrapper.unmount()
  })
})
