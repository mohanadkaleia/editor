// @ts-check
import { test, expect } from '@playwright/test'

/**
 * Document List E2E Tests
 *
 * Targets the Notion-shell sidebar: workspace header, scrollable
 * document list, active state, new-page button, context-menu delete.
 */

test.describe('Document List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for sidebar to be mounted with its workspace label visible.
    await page.waitForSelector('[data-testid="app-sidebar"]')
    await page.waitForSelector('[data-testid="workspace-name"]')
  })

  test('workspace name is visible in the sidebar', async ({ page }) => {
    const workspace = page.locator('[data-testid="workspace-name"]')
    await expect(workspace).toBeVisible()
    await expect(workspace).toHaveText('كُرّاس')
  })

  test('sidebar new-page button is visible and clickable', async ({ page }) => {
    const newBtn = page.locator('[data-testid="sidebar-new-document-btn"]')
    await expect(newBtn).toBeVisible()
    await expect(newBtn).toContainText('صفحة جديدة')
  })

  test('clicking sidebar new-page creates a document and navigates to editor', async ({
    page,
  }) => {
    await page.locator('[data-testid="sidebar-new-document-btn"]').click()

    await page.waitForURL(/\/editor\/.+/)
    expect(page.url()).toMatch(/\/editor\/.+/)

    await expect(page.locator('[data-testid="editor-content"]')).toBeVisible()
  })

  test('new document appears in the sidebar list with active state', async ({
    page,
  }) => {
    const before = await page
      .locator('[data-testid="sidebar-document-item"]')
      .count()

    await page.locator('[data-testid="sidebar-new-document-btn"]').click()
    await page.waitForURL(/\/editor\/.+/)
    await page.waitForSelector('[data-testid="editor-content"]')

    // The sidebar should now show one more item, with the latest having
    // the active-state attribute.
    const items = page.locator('[data-testid="sidebar-document-item"]')
    await expect(items).toHaveCount(before + 1, { timeout: 5000 })

    const activeItem = items.filter({ has: page.locator('[data-active="true"]') })
    // Fallback: the first item with data-active="true" attribute on the row itself.
    const active = page.locator(
      '[data-testid="sidebar-document-item"][data-active="true"]',
    )
    await expect(active).toHaveCount(1)
    void activeItem
  })

  test('empty-state home shows when there are no documents (dev may have some)', async ({
    page,
  }) => {
    // Create a doc so the empty state view may not apply on this fresh run.
    // Instead we assert the empty-state selector exists in the DOM only
    // when the list is empty. With documents present, the `/` route
    // auto-redirects to the latest doc.
    const itemsCount = await page
      .locator('[data-testid="sidebar-document-item"]')
      .count()
    if (itemsCount === 0) {
      await expect(page.locator('[data-testid="documents-title"]')).toBeVisible()
      await expect(page.locator('[data-testid="documents-title"]')).toHaveText(
        'لا توجد مستندات',
      )
    } else {
      // Auto-redirect kicked in; URL should be /editor/:id.
      await page.waitForURL(/\/editor\/.+/, { timeout: 5000 })
      expect(page.url()).toMatch(/\/editor\/.+/)
    }
  })

  test('delete a document via the sidebar context menu removes it', async ({
    page,
  }) => {
    // Seed: create a fresh doc to guarantee we can delete one.
    await page.locator('[data-testid="sidebar-new-document-btn"]').click()
    await page.waitForURL(/\/editor\/.+/)
    await page.waitForSelector('[data-testid="editor-content"]')

    const items = page.locator('[data-testid="sidebar-document-item"]')
    const initialCount = await items.count()
    expect(initialCount).toBeGreaterThan(0)

    page.on('dialog', async (dialog) => {
      await dialog.accept()
    })

    // Hover reveals the inline ellipsis; click it.
    const firstItem = items.first()
    await firstItem.hover()
    await firstItem
      .locator('[data-testid="sidebar-item-menu-btn"]')
      .click()

    // Context menu should be visible with the Delete button.
    await page.waitForSelector('[data-testid="sidebar-context-menu"]')
    await page.locator('[data-testid="sidebar-delete-btn"]').click()

    await expect(items).toHaveCount(initialCount - 1)
  })
})
