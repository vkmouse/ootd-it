<script setup lang="ts">
import { ref } from 'vue'
import { iconSun, iconMoon } from '@/utils/icons'

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
  justify-content: flex-end;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg-sub);
  height: var(--header-height);
  flex-shrink: 0;
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
