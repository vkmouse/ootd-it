<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { iconSun, iconMoon } from '@/utils/icons'

// 路由與頁面標題的對應
const routeTitles: Record<string, string> = {
  wardrobe: '衣櫥',
  'wardrobe-new': '新增衣物',
  outfits: '穿搭',
}

const route = useRoute()
const title = computed(() => routeTitles[route.name as string] ?? '')

// 主題切換：讀寫 localStorage，切換 body.light class
const isLight = ref(document.body.classList.contains('light'))

function toggleTheme() {
  const light = document.body.classList.toggle('light')
  isLight.value = light
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
      <!-- 亮色模式顯示月亮（切換回暗色），暗色模式顯示太陽（切換到亮色） -->
      <span v-if="isLight" class="app-header__theme-icon" v-html="iconMoon" />
      <span v-else class="app-header__theme-icon" v-html="iconSun" />
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
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  color: var(--color-text-main);
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-header__theme-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.app-header__theme-icon :deep(svg) {
  width: 20px;
  height: 20px;
}
</style>
