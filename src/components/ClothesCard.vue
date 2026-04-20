<script setup lang="ts">
// 單件衣物的卡片，以背景填色區隔，無框線、無陰影
defineProps<{
  name: string
  category: string
  color: string | null
  size: string | null
}>()
</script>

<template>
  <div class="clothes-card">
    <!-- 佔位圖 -->
    <div class="clothes-card__image" aria-hidden="true">👗</div>
    <div class="clothes-card__info">
      <p class="clothes-card__name">{{ name }}</p>
      <p class="clothes-card__meta">{{ category }}<span v-if="color"> · {{ color }}</span><span v-if="size"> · {{ size }}</span></p>
    </div>
  </div>
</template>

<style scoped>
.clothes-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background-color: var(--color-bg-sub);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
}

.clothes-card__image {
  font-size: 2rem;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-secondary);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.clothes-card__name {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-main);
}

.clothes-card__meta {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-top: var(--spacing-xs);
}
</style>
