<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 路由與頁面標題的對應
const routeTitles: Record<string, string> = {
  wardrobe: '衣櫥',
  'wardrobe-new': '新增衣物',
  outfits: '穿搭',
}

const route = useRoute()
const title = computed(() => routeTitles[route.name as string] ?? '')

// 主題切換：讀寫 localStorage，切換 body.light class
const isLight = computed(() => document.body.classList.contains('light'))

function toggleTheme() {
  const light = document.body.classList.toggle('light')
  if (light) {
    localStorage.setItem('theme', 'light')
  } else {
    localStorage.removeItem('theme')
  }
}
</script>

<template>
  <header class="app-header">
    <span class="app-header__title">{{ title }}</span>
    <button class="app-header__theme-btn" @click="toggleTheme" aria-label="切換主題">
      {{ isLight ? '🌙' : '☀️' }}
    </button>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg-sub);
  height: 52px;
  flex-shrink: 0;
}

.app-header__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-main);
}

.app-header__theme-btn {
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  line-height: 1;
}
</style>
