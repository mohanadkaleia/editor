// @ts-check
import { test, expect } from '@playwright/test'

/**
 * Floating Toolbar E2E Tests
 *
 * Asserts the dark floating inline toolbar appears on selection,
 * positions itself within the viewport, and disappears when the
 * selection collapses.
 */

async function createAndOpenDocument(page) {
  await page.goto('/')
  await page.waitForSelector('[data-testid="sidebar-new-document-btn"]')
  await page.locator('[data-testid="sidebar-new-document-btn"]').click()
  await page.waitForURL(/\/editor\/.+/)
  await page.waitForSelector('[data-testid="editor-content"][data-loaded="true"]')
  await page.waitForSelector('.editor-mount [contenteditable="true"]')
}

async function focusEditor(page) {
  const editable = page.locator('.editor-mount [contenteditable="true"]')
  await editable.click()
  return editable
}

async function selectAllInEditor(page) {
  await page.evaluate(() => {
    const editable = document.querySelector('.editor-mount [contenteditable="true"]')
    if (!editable) return
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(editable)
    selection.removeAllRanges()
    selection.addRange(range)
  })
}

test.describe('Floating Toolbar', () => {
  test('appears when text is selected and stays within the viewport', async ({
    page,
  }) => {
    await createAndOpenDocument(page)

    const toolbar = page.locator('[data-testid="floating-toolbar"]')
    // Initially hidden (no selection).
    await expect(toolbar).toBeHidden()

    const editable = await focusEditor(page)
    await editable.pressSequentially('selectable text')

    // Select the text — this fires `selectionchange`.
    await selectAllInEditor(page)

    // Toolbar should be visible now.
    await expect(toolbar).toBeVisible({ timeout: 2000 })

    // Within viewport.
    const box = await toolbar.boundingBox()
    expect(box).toBeTruthy()
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.y).toBeGreaterThanOrEqual(0)
    const vw = await page.evaluate(() => window.innerWidth)
    const vh = await page.evaluate(() => window.innerHeight)
    expect(box.x + box.width).toBeLessThanOrEqual(vw)
    expect(box.y + box.height).toBeLessThanOrEqual(vh)

    // Snapshot for visual verification.
    await page.screenshot({
      path: 'artifacts/playwright/screenshots/floating-toolbar-visible.png',
      fullPage: true,
    })
  })

  test('disappears when the selection collapses', async ({ page }) => {
    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await editable.pressSequentially('hello')
    await selectAllInEditor(page)

    await expect(page.locator('[data-testid="floating-toolbar"]')).toBeVisible({
      timeout: 2000,
    })

    // Collapse the selection by moving the caret.
    await page.keyboard.press('End')

    // Toolbar should hide within a frame or two.
    await expect(page.locator('[data-testid="floating-toolbar"]')).toBeHidden({
      timeout: 2000,
    })
  })

  test('bold button keeps focus inside the editor', async ({ page }) => {
    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await editable.pressSequentially('keep me focused')
    await selectAllInEditor(page)

    await page.waitForSelector('[data-testid="floating-toolbar"]')
    await page.locator('[data-testid="floating-bold"]').click()

    // The editor's contenteditable remains focused (the command calls
    // view.focus()).
    const focused = await page.evaluate(() => {
      return document.activeElement?.classList?.contains('editor-content')
    })
    expect(focused).toBe(true)
  })
})
