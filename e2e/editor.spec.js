// @ts-check
import { test, expect } from '@playwright/test'

/**
 * Editor E2E Tests — Notion-shell UI
 *
 * In the new shell:
 *   - There is NO in-editor toolbar (<Editor :toolbar="false" />).
 *   - Formatting commands are driven by the FloatingToolbar (H1, H2,
 *     B, I, link, inline code) that appears on selection.
 *   - All other commands (lists, blockquote, code block, image) are
 *     still reachable programmatically via the editor's exposed
 *     `execCommand`. We drive those paths through `page.evaluate`
 *     here so we keep capability coverage without re-introducing
 *     the package toolbar.
 *   - Import / Export / Versions live under the TopNav overflow
 *     menu (`[data-testid="topnav-menu-*"]`).
 */

// ----- Helpers -------------------------------------------------------------

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

async function getMarkdown(page) {
  return page.evaluate(() => {
    let node = document.querySelector('.editor-root')
    if (!node) return ''
    // @ts-ignore
    let instance = node.__vueParentComponent
    while (instance) {
      const exposed = instance.exposed
      if (exposed && typeof exposed.getMarkdown === 'function') {
        return exposed.getMarkdown()
      }
      instance = instance.parent
    }
    return ''
  })
}

/**
 * Run a named command through the editor's exposed API. Used in place
 * of the retired in-editor toolbar for non-floating commands.
 */
async function execEditorCommand(page, name, ...args) {
  return page.evaluate(
    ({ name, args }) => {
      const root = document.querySelector('.editor-root')
      if (!root) return false
      // @ts-ignore
      let instance = root.__vueParentComponent
      while (instance) {
        const exposed = instance.exposed
        if (exposed && typeof exposed.execCommand === 'function') {
          return exposed.execCommand(name, ...args)
        }
        instance = instance.parent
      }
      return false
    },
    { name, args },
  )
}

/** Select a range of characters starting from the current editor content. */
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

// ----- Tests ---------------------------------------------------------------

test.describe('Editor', () => {
  test('new document loads editor with ProseMirror surface', async ({ page }) => {
    await createAndOpenDocument(page)

    const editorContent = page.locator('[data-testid="editor-content"]')
    await expect(editorContent).toBeVisible()

    const root = page.locator('.editor-root')
    await expect(root).toHaveAttribute('dir', 'rtl')

    // No in-editor toolbar (floating replaces it).
    await expect(page.locator('.editor-toolbar')).toHaveCount(0)

    const title = page.locator('[data-testid="document-title"]')
    await expect(title).toBeVisible()
  })

  test('typing text persists after reload', async ({ page }) => {
    await createAndOpenDocument(page)

    const url = page.url()
    const editable = await focusEditor(page)
    await editable.pressSequentially('مرحبا')

    // Give debounce (500ms) time to flush, plus a generous buffer for
    // the round-trip under full-suite load. Wait explicitly for the
    // PATCH to land by polling the backend.
    await page.waitForResponse(
      (resp) =>
        resp.request().method() === 'PATCH' &&
        /\/api\/documents\/[^/]+$/.test(resp.url()) &&
        resp.status() === 200,
      { timeout: 5000 },
    )

    await page.goto(url)
    await page.waitForSelector('[data-testid="editor-content"][data-loaded="true"]')
    await page.waitForSelector('.editor-mount [contenteditable="true"]')

    const md = await getMarkdown(page)
    expect(md).toContain('مرحبا')
  })

  test('floating toolbar bold button wraps selected text in **', async ({
    page,
  }) => {
    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await editable.pressSequentially('abc')

    // Select the text.
    await selectAllInEditor(page)

    // Wait for the floating toolbar to appear.
    await page.waitForSelector('[data-testid="floating-toolbar"]')
    await page.locator('[data-testid="floating-bold"]').click()

    const md = await getMarkdown(page)
    expect(md).toContain('**abc**')
    await expect(page.locator('.editor-mount strong')).toHaveText('abc')
  })

  test('floating toolbar italic button produces *text*', async ({ page }) => {
    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await editable.pressSequentially('xyz')
    await selectAllInEditor(page)

    await page.waitForSelector('[data-testid="floating-toolbar"]')
    await page.locator('[data-testid="floating-italic"]').click()

    const md = await getMarkdown(page)
    expect(md).toMatch(/\*xyz\*/)
  })

  test('floating toolbar inline-code button produces `text`', async ({
    page,
  }) => {
    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await editable.pressSequentially('code')
    await selectAllInEditor(page)

    await page.waitForSelector('[data-testid="floating-toolbar"]')
    await page.locator('[data-testid="floating-code"]').click()

    const md = await getMarkdown(page)
    expect(md).toMatch(/`code`/)
  })

  test('floating H1 button produces a # heading', async ({ page }) => {
    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await editable.pressSequentially('H1 Title')
    await selectAllInEditor(page)
    await page.waitForSelector('[data-testid="floating-toolbar"]')
    await page.locator('[data-testid="floating-h1"]').click()

    const md = await getMarkdown(page)
    expect(md).toContain('# H1 Title')
    await expect(page.locator('.editor-mount h1')).toHaveText('H1 Title')
  })

  test('floating H2 button produces a ## heading', async ({ page }) => {
    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await editable.pressSequentially('H2 Title')
    await selectAllInEditor(page)
    await page.waitForSelector('[data-testid="floating-toolbar"]')
    await page.locator('[data-testid="floating-h2"]').click()

    const md = await getMarkdown(page)
    expect(md).toContain('## H2 Title')
    await expect(page.locator('.editor-mount h2')).toHaveText('H2 Title')
  })

  // ---- Commands that are no longer in the UI surface ----------------------
  // The Notion shell scopes the floating toolbar to H1/H2/B/I/link/code.
  // We still assert coverage for lists, blockquote, code block, and images
  // via the editor's exposed execCommand, since those capabilities are
  // part of the editor package contract even if no UI button invokes them.

  test('H3 via execCommand produces ### heading', async ({ page }) => {
    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await editable.pressSequentially('H3 Title')
    await execEditorCommand(page, 'toggleHeading', 3)

    const md = await getMarkdown(page)
    expect(md).toContain('### H3 Title')
  })

  test('bullet list via execCommand produces an unordered list', async ({
    page,
  }) => {
    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await execEditorCommand(page, 'toggleBulletList')
    await editable.pressSequentially('one')
    await editable.press('Enter')
    await editable.pressSequentially('two')

    const md = await getMarkdown(page)
    expect(md).toMatch(/[-*] one/)
    expect(md).toMatch(/[-*] two/)
    await expect(page.locator('.editor-mount ul li').first()).toContainText('one')
  })

  test('ordered list via execCommand produces a numbered list', async ({
    page,
  }) => {
    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await execEditorCommand(page, 'toggleOrderedList')
    await editable.pressSequentially('first')

    const md = await getMarkdown(page)
    expect(md).toMatch(/1\. first/)
    await expect(page.locator('.editor-mount ol li').first()).toContainText('first')
  })

  test('blockquote via execCommand produces > prefix', async ({ page }) => {
    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await execEditorCommand(page, 'toggleBlockquote')
    await editable.pressSequentially('quoted')

    const md = await getMarkdown(page)
    expect(md).toMatch(/>\s*quoted/)
    await expect(page.locator('.editor-mount blockquote')).toContainText('quoted')
  })

  test('code block via execCommand produces ``` fenced block', async ({
    page,
  }) => {
    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await execEditorCommand(page, 'toggleCodeBlock')
    await editable.pressSequentially('print("hi")')

    const md = await getMarkdown(page)
    expect(md).toMatch(/```[\s\S]*print\("hi"\)[\s\S]*```/)
    await expect(page.locator('.editor-mount pre')).toBeVisible()
  })

  test('Shift+Enter inserts a hard break within a paragraph', async ({
    page,
  }) => {
    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await editable.pressSequentially('line1')
    await editable.press('Shift+Enter')
    await editable.pressSequentially('line2')

    const md = await getMarkdown(page)
    expect(md).toMatch(/line1(  \n|\\\n)line2/)
  })

  test('version save and restore round trip via topnav menu', async ({
    page,
  }) => {
    page.on('dialog', async (dialog) => {
      if (dialog.type() === 'prompt') {
        await dialog.accept('v1')
      } else {
        await dialog.accept()
      }
    })

    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await editable.pressSequentially('version one')
    await page.waitForTimeout(900)

    // Open topnav menu.
    await page.locator('[data-testid="topnav-menu-btn"]').click()
    await page.waitForSelector('[data-testid="topnav-menu-versions"]')
    await page.locator('[data-testid="topnav-menu-versions"]').click()

    await page.waitForSelector('[data-testid="version-save-btn"]')
    await page.locator('[data-testid="version-save-btn"]').click()
    await expect(
      page.locator('[data-testid="version-item"]').first(),
    ).toBeVisible({ timeout: 5000 })

    // Close dialog.
    const dialog = page.locator('[data-testid="dialog-content"]')
    if (await dialog.isVisible()) {
      await dialog.locator('button', { hasText: 'إغلاق' }).first().click()
    }

    const editable2 = await focusEditor(page)
    await editable2.pressSequentially(' edited')
    await page.waitForTimeout(900)

    const mdBefore = await getMarkdown(page)
    expect(mdBefore).toContain('edited')

    // Re-open versions via the topnav menu.
    await page.locator('[data-testid="topnav-menu-btn"]').click()
    await page.locator('[data-testid="topnav-menu-versions"]').click()
    await page.waitForSelector('[data-testid="version-restore-btn"]')
    await page.locator('[data-testid="version-restore-btn"]').first().click()

    await page.waitForTimeout(500)
    const mdAfter = await getMarkdown(page)
    expect(mdAfter).toContain('version one')
    expect(mdAfter).not.toContain('edited')
  })

  test('export dialog (via topnav menu) exposes the current markdown', async ({
    page,
  }) => {
    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await editable.pressSequentially('hello')

    await page.locator('[data-testid="topnav-menu-btn"]').click()
    await page.locator('[data-testid="topnav-menu-export"]').click()

    await expect(page.locator('[data-testid="export-textarea"]')).toBeVisible()
    await expect(page.locator('[data-testid="export-textarea"]')).toHaveValue(
      /hello/,
    )
  })

  test('import dialog (via topnav menu) replaces editor content', async ({
    page,
  }) => {
    await createAndOpenDocument(page)

    await page.locator('[data-testid="topnav-menu-btn"]').click()
    await page.locator('[data-testid="topnav-menu-import"]').click()

    const textarea = page.locator('[data-testid="import-textarea"]')
    await textarea.fill('# Imported\n\nbody')
    await page.locator('[data-testid="import-submit-btn"]').click()

    await expect(page.locator('.editor-mount h1')).toHaveText('Imported')
  })
})
