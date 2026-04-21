<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import BottomNav from './components/BottomNav.vue'

// 頁面載入時從 localStorage 恢復主題偏好
onMounted(() => {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light')
  }
})

const route = useRoute()
// 衣物新增／編輯頁面不顯示底部 Tab
const showBottomNav = computed(() =>
  route.name !== 'wardrobe-new' && route.name !== 'wardrobe-edit'
)
</script>

<template>
  <AppHeader />
  <main class="app-main">
    <RouterView />
  </main>
  <BottomNav v-if="showBottomNav" />
</template>

<style scoped>
.app-main {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
}
</style>
