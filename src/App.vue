<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import BottomNav from './components/BottomNav.vue'

// 頁面載入時從 localStorage 恢復主題偏好
onMounted(() => {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light')
  }
})
</script>

<template>
  <AppHeader />
  <main class="app-main">
    <RouterView />
  </main>
  <BottomNav />
</template>

<style scoped>
.app-main {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
}
</style>
