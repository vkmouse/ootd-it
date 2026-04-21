<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { iconSun, iconMoon, iconArrowLeft } from '@/utils/icons'

const route = useRoute()
const router = useRouter()

// 衣物新增／編輯頁面顯示返回按鈕，其他頁面顯示 wordmark
const showBack = computed(() =>
  route.name === 'wardrobe-new' || route.name === 'wardrobe-edit'
)

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
    <!-- 左側：返回按鈕（衣物新增／編輯頁）或 OOTD wordmark -->
    <button v-if="showBack" class="app-header__back-btn" @click="router.back()" aria-label="返回">
      <span class="app-header__back-icon" v-html="iconArrowLeft" />
    </button>
    <span v-else class="app-header__wordmark">OOTD</span>

    <!-- 右側：主題切換按鈕 -->
    <button class="app-header__theme-btn" @click="toggleTheme" aria-label="切換主題">
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
  height: var(--header-height);
  flex-shrink: 0;
}

.app-header__wordmark {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-text-main);
}

.app-header__back-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
}

.app-header__back-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.app-header__back-icon :deep(svg) {
  width: 24px;
  height: 24px;
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
