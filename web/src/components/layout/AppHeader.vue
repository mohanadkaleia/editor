<script setup>
/**
 * AppHeader — sticky top bar for the single-editor app.
 *
 * Layout (visual, under RTL — visual right → left):
 *   1. Logo square + app name + version pill + "الوثائق" nav link  (brand group)
 *   2. spacer
 *   3. "modified X ago" (editor only) + GitHub link + overflow menu (editor only)
 *
 * Route awareness:
 *   - On `/docs` there is no active document context, so the
 *     "modified X ago" text and the overflow menu are hidden. The
 *     GitHub icon and the docs nav link remain visible on every route.
 *   - The logo square and the app name are a `router-link` to `/`, so
 *     clicking either returns the user to the editor.
 *
 * The overflow menu opens a small popover (Teleported into <body>) with
 * two actions: import / export. Each action flips a flag on
 * `useEditorChrome`, which the editor view observes and uses to open
 * the corresponding dialog — the header itself never renders any
 * dialogs.
 */

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { formatRelativeArabic } from '../../composables/useRelativeTime.js'
import { useEditorChrome } from '../../composables/useEditorChrome.js'

const { showImportDialog, showExportDialog, updatedAt, documentReady } =
  useEditorChrome()

const route = useRoute()

// True on the docs route — used to hide editor-specific chrome
// (modified timestamp, overflow menu) that has no meaning off the
// editor view.
const isDocsRoute = computed(() => route.path === '/docs')

// --- Overflow menu state ----------------------------------------------------

const menuOpen = ref(false)
const triggerEl = ref(null)
const popoverEl = ref(null)

// Popover coordinates. Recomputed each time the menu opens and on resize /
// scroll while it is open so we stay pinned under the trigger.
const popoverTop = ref(0)
const popoverLeft = ref(0)

function positionPopover() {
  const t = triggerEl.value
  if (!t) return
  const rect = t.getBoundingClientRect()
  // Align the popover's right edge with the trigger's right edge (under
  // RTL the trigger sits on the visual left, so the popover should open
  // downward-and-left-aligned to its right edge = trigger's right).
  const width = 200
  popoverTop.value = Math.round(rect.bottom + 6)
  // Clamp to viewport: right edge ≥ 8px from the left viewport edge.
  let right = window.innerWidth - rect.right
  if (right < 8) right = 8
  popoverLeft.value = Math.max(8, window.innerWidth - right - width)
}

function openMenu() {
  menuOpen.value = true
  // Position after the next paint so `triggerEl` is laid out.
  requestAnimationFrame(positionPopover)
}

function closeMenu() {
  menuOpen.value = false
}

function toggleMenu() {
  if (menuOpen.value) closeMenu()
  else openMenu()
}

function onDocumentClick(event) {
  if (!menuOpen.value) return
  const t = event.target
  if (popoverEl.value && popoverEl.value.contains(t)) return
  if (triggerEl.value && triggerEl.value.contains(t)) return
  closeMenu()
}

function onKeydown(event) {
  if (event.key === 'Escape' && menuOpen.value) {
    closeMenu()
    triggerEl.value?.focus()
  }
}

function onWindowScrollOrResize() {
  if (menuOpen.value) positionPopover()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick, true)
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onWindowScrollOrResize)
  window.addEventListener('scroll', onWindowScrollOrResize, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick, true)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onWindowScrollOrResize)
  window.removeEventListener('scroll', onWindowScrollOrResize, true)
})

// --- Actions ----------------------------------------------------------------

function openImport() {
  showImportDialog.value = true
  closeMenu()
}
function openExport() {
  showExportDialog.value = true
  closeMenu()
}

// --- Derived ----------------------------------------------------------------

const modifiedText = computed(() => formatRelativeArabic(updatedAt.value))

// --- Constants --------------------------------------------------------------

const APP_NAME = 'محرر'
const APP_VERSION = 'v0.2'
const GITHUB_URL = 'https://github.com/mohanadkaleia/editor'
</script>

<template>
  <header
    class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border"
    data-testid="app-header"
  >
    <div
      class="flex items-center justify-between px-6 h-14 max-w-6xl mx-auto"
    >
      <!-- Brand + primary nav (visual right under RTL) -->
      <div class="flex items-center gap-3" data-testid="app-brand">
        <router-link
          to="/"
          class="flex items-center gap-3 group focus:outline-none"
          data-testid="app-brand-link"
          aria-label="الصفحة الرئيسية"
        >
          <div
            class="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-sm select-none group-hover:bg-accent-hover transition-colors"
            aria-hidden="true"
          >
            ع
          </div>
          <span
            class="text-text-primary font-semibold text-sm"
            data-testid="app-name"
          >
            {{ APP_NAME }}
          </span>
        </router-link>
        <span
          class="px-2 py-0.5 rounded-full bg-surface border border-border text-xs font-mono text-text-secondary"
          data-testid="app-version"
          dir="ltr"
        >
          {{ APP_VERSION }}
        </span>
        <router-link
          to="/docs"
          class="text-sm hover:underline underline-offset-4 transition-colors mr-1"
          :class="isDocsRoute ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'"
          data-testid="app-docs-link"
        >
          الوثائق
        </router-link>
      </div>

      <!-- Meta + overflow (visual left under RTL) -->
      <div class="flex items-center gap-3">
        <span
          v-if="!isDocsRoute && documentReady && modifiedText"
          class="text-xs text-text-secondary hidden sm:inline"
          data-testid="app-updated-at"
        >
          {{ modifiedText }}
        </span>

        <a
          :href="GITHUB_URL"
          target="_blank"
          rel="noopener"
          class="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
          aria-label="GitHub"
          title="GitHub"
          data-testid="app-github-link"
        >
          <i class="fa-brands fa-github text-sm"></i>
        </a>

        <button
          v-if="!isDocsRoute"
          ref="triggerEl"
          type="button"
          class="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
          :class="{ 'bg-surface-hover text-text-primary': menuOpen }"
          :disabled="!documentReady"
          :aria-expanded="menuOpen"
          aria-haspopup="menu"
          aria-label="القائمة"
          title="المزيد"
          data-testid="app-overflow-btn"
          @click="toggleMenu"
        >
          <i class="fa-solid fa-ellipsis text-sm"></i>
        </button>
      </div>
    </div>

    <!-- Overflow popover -->
    <Teleport to="body">
      <div
        v-if="menuOpen && !isDocsRoute"
        ref="popoverEl"
        :style="{ top: `${popoverTop}px`, left: `${popoverLeft}px` }"
        class="fixed z-50 w-[200px] rounded-lg bg-white border border-border shadow-lg py-1"
        role="menu"
        dir="rtl"
        data-testid="app-overflow-menu"
      >
        <button
          type="button"
          role="menuitem"
          class="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors cursor-pointer text-right"
          data-testid="menu-import"
          @click="openImport"
        >
          <i class="fa-solid fa-file-arrow-up w-4 text-text-secondary"></i>
          <span>استيراد</span>
        </button>
        <button
          type="button"
          role="menuitem"
          class="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors cursor-pointer text-right"
          data-testid="menu-export"
          @click="openExport"
        >
          <i class="fa-solid fa-file-arrow-down w-4 text-text-secondary"></i>
          <span>تصدير</span>
        </button>
      </div>
    </Teleport>
  </header>
</template>
