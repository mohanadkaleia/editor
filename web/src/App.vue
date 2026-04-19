<script setup>
/**
 * App shell — sticky header + router view.
 *
 * The app is a single-editor surface; there is no sidebar or home
 * view. The header lives outside the router view so it stays mounted
 * across route changes (today: only one route, `/`).
 */

import AppHeader from './components/layout/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white text-text-primary font-sans">
    <AppHeader />
    <router-view />
  </div>
</template>
