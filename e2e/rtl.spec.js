// @ts-check
import { test, expect } from '@playwright/test'

/**
 * RTL Layout E2E Tests
 *
 * Verifies the Notion-shell UI respects right-to-left layout:
 *   - `<html dir="rtl">` and `<html lang="ar">` on the document root.
 *   - Sidebar visually sits on the right edge of the viewport.
 *   - `<div class="editor-root" dir="rtl">` inside the editor.
 *   - Arabic list markers sit on the right.
 *   - Mixed Arabic + English content roundtrips through markdown.
 *   - Code blocks force `dir="ltr"` inside an RTL editor.
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

async function getMarkdown(page) {
  return page.evaluate(() => {
    const root = document.querySelector('.editor-root')
    if (!root) return ''
    // @ts-ignore
    let instance = root.__vueParentComponent
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

test.describe('RTL Layout', () => {
  test('html element has dir="rtl" and lang="ar"', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="app-sidebar"]')

    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
    await expect(html).toHaveAttribute('lang', 'ar')
  })

  test('sidebar sits visually on the right of the viewport', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="app-sidebar"]')

    const sidebarBox = await page
      .locator('[data-testid="app-sidebar"]')
      .boundingBox()
    const mainBox = await page
      .locator('[data-testid="app-main"]')
      .boundingBox()

    expect(sidebarBox).toBeTruthy()
    expect(mainBox).toBeTruthy()
    // Sidebar's x should be greater than main's x because it is on the
    // right edge of the viewport in RTL.
    expect(sidebarBox.x).toBeGreaterThan(mainBox.x)
  })

  test('editor root has dir="rtl"', async ({ page }) => {
    await createAndOpenDocument(page)
    const root = page.locator('.editor-root')
    await expect(root).toHaveAttribute('dir', 'rtl')

    const direction = await root.evaluate(
      (el) => window.getComputedStyle(el).direction,
    )
    expect(direction).toBe('rtl')
  })

  test('Arabic bullet list markers sit visually on the right', async ({
    page,
  }) => {
    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await execEditorCommand(page, 'toggleBulletList')
    await editable.pressSequentially('نقطة أولى')

    const li = page.locator('.editor-mount ul li').first()
    await expect(li).toBeVisible()

    const liBox = await li.boundingBox()
    expect(liBox).toBeTruthy()

    const ulDirection = await page
      .locator('.editor-mount ul')
      .first()
      .evaluate((el) => window.getComputedStyle(el).direction)
    expect(ulDirection).toBe('rtl')
  })

  test('mixed Arabic + English content roundtrips through markdown', async ({
    page,
  }) => {
    await createAndOpenDocument(page)

    const mixed =
      '# عنوان Mixed Heading\n\nهذه فقرة with some English and عربي inline.\n'
    await page.evaluate((md) => {
      const root = document.querySelector('.editor-root')
      if (!root) return
      // @ts-ignore
      let instance = root.__vueParentComponent
      while (instance) {
        const exposed = instance.exposed
        if (exposed && typeof exposed.setMarkdown === 'function') {
          exposed.setMarkdown(md)
          return
        }
        instance = instance.parent
      }
    }, mixed)

    const md = await getMarkdown(page)
    expect(md).toContain('عنوان Mixed Heading')
    expect(md).toContain('هذه فقرة with some English')
  })

  test('placeholder is visible on an empty doc and disappears on first keystroke', async ({
    page,
  }) => {
    await createAndOpenDocument(page)

    const placeholderHost = page.locator('.editor-mount [data-placeholder]')
    await expect(placeholderHost).toBeVisible()
    await expect(placeholderHost).toHaveAttribute(
      'data-placeholder',
      'ابدأ الكتابة...',
    )

    const editable = await focusEditor(page)
    await editable.pressSequentially('ا')
    await expect(
      page.locator('.editor-mount [data-placeholder]'),
    ).toHaveCount(0)
  })

  test('code blocks force LTR even inside an RTL editor', async ({ page }) => {
    await createAndOpenDocument(page)

    const editable = await focusEditor(page)
    await execEditorCommand(page, 'toggleCodeBlock')
    await editable.pressSequentially('console.log("hi")')

    const pre = page.locator('.editor-mount pre').first()
    await expect(pre).toBeVisible()

    const direction = await pre.evaluate(
      (el) => window.getComputedStyle(el).direction,
    )
    expect(direction).toBe('ltr')
  })

  test('captures screenshots for visual verification', async ({ page }) => {
    // 1. Empty-state home (only present if there are no docs; if any
    // exist the home route redirects, in which case this captures the
    // latest-doc editor view instead — still useful as a screenshot).
    await page.goto('/')
    await page.waitForSelector('[data-testid="app-sidebar"]')
    // Either home-empty or editor-page; wait for whichever lands.
    await page.waitForFunction(() => {
      return (
        document.querySelector('[data-testid="home-empty"]') ||
        document.querySelector('[data-testid="editor-page"]')
      )
    })
    await page.screenshot({
      path: 'artifacts/playwright/screenshots/shell-landing.png',
      fullPage: true,
    })

    // 2. Create a document and seed rich content.
    if (!(await page.locator('[data-testid="editor-page"]').isVisible())) {
      await page.locator('[data-testid="sidebar-new-document-btn"]').click()
      await page.waitForURL(/\/editor\/.+/)
    }
    await page.waitForSelector('.editor-mount [contenteditable="true"]')

    const titleInput = page.locator('[data-testid="document-title"]')
    await titleInput.fill('مستند تجريبي')

    await page.evaluate(() => {
      const root = document.querySelector('.editor-root')
      if (!root) return
      // @ts-ignore
      let instance = root.__vueParentComponent
      while (instance) {
        const exposed = instance.exposed
        if (exposed && typeof exposed.setMarkdown === 'function') {
          exposed.setMarkdown(
            '# عنوان رئيسي\n\n' +
              'هذه فقرة تحتوي على **نص غامق** و *مائل* ونص English مختلط.\n\n' +
              '* عنصر أول\n* عنصر ثاني\n* third item\n\n' +
              '1. واحد\n2. اثنان\n\n' +
              '> اقتباس قصير للاختبار.\n\n' +
              '```\nconsole.log("hi")\n```\n',
          )
          return
        }
        instance = instance.parent
      }
    })
    await page.waitForTimeout(200)
    await page.screenshot({
      path: 'artifacts/playwright/screenshots/shell-editor-content.png',
      fullPage: true,
    })

    // 3. Sidebar with docs: take a screenshot showing the sidebar list.
    await page.screenshot({
      path: 'artifacts/playwright/screenshots/shell-sidebar-with-docs.png',
      fullPage: true,
    })

    // 4. Top-nav overflow menu open + version dialog.
    await page.locator('[data-testid="topnav-menu-btn"]').click()
    await page.waitForSelector('[data-testid="topnav-menu-versions"]')
    await page.screenshot({
      path: 'artifacts/playwright/screenshots/shell-topnav-menu.png',
      fullPage: true,
    })
    await page.locator('[data-testid="topnav-menu-versions"]').click()
    await page.waitForSelector('[data-testid="dialog-content"]')
    await page.screenshot({
      path: 'artifacts/playwright/screenshots/shell-version-dialog.png',
      fullPage: true,
    })
  })

  test('collapsed sidebar: hamburger toggles and persists', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="app-sidebar"]')

    // Depending on state: if `/` auto-redirects to editor, the hamburger
    // is in the editor topnav. If empty-state, the hamburger is in the
    // home topnav. Either way the selector is the same.
    await page.waitForSelector('[data-testid="topnav-hamburger"]')

    // Capture the uncollapsed width.
    const widthBefore = await page
      .locator('[data-testid="app-sidebar"]')
      .evaluate((el) => el.getBoundingClientRect().width)
    expect(widthBefore).toBeGreaterThan(0)

    // Collapse.
    await page.locator('[data-testid="topnav-hamburger"]').click()
    await page.waitForTimeout(400) // transition duration

    const widthAfter = await page
      .locator('[data-testid="app-sidebar"]')
      .evaluate((el) => el.getBoundingClientRect().width)
    expect(widthAfter).toBe(0)

    await page.screenshot({
      path: 'artifacts/playwright/screenshots/shell-sidebar-collapsed.png',
      fullPage: true,
    })

    // Reload: collapsed state should survive via localStorage.
    await page.reload()
    await page.waitForSelector('[data-testid="app-sidebar"]', { state: 'attached' })
    const widthAfterReload = await page
      .locator('[data-testid="app-sidebar"]')
      .evaluate((el) => el.getBoundingClientRect().width)
    expect(widthAfterReload).toBe(0)

    // Restore for subsequent tests.
    await page.locator('[data-testid="topnav-hamburger"]').click()
    await page.waitForTimeout(400)
  })
})
