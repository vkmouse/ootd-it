<script setup lang="ts">
// 單件衣物的卡片，圖片優先直向設計，無框線、無陰影
import { useRouter } from 'vue-router'

const props = defineProps<{
  id: string
  name: string
  category: string
  color: string | null
  size: string | null
  imageUrl: string | null
}>()

const router = useRouter()

// 類型對應中文標籤
const CATEGORY_LABELS: Record<string, string> = {
  tops:        '上衣',
  bottoms:     '褲子',
  outerwear:   '外套',
  shoes:       '鞋子',
  accessories: '配件',
}

// 類型對應佔位符背景色
const PLACEHOLDER_COLORS: Record<string, string> = {
  tops:        '#8C6E54',
  bottoms:     '#4A4A44',
  outerwear:   '#5C5040',
  shoes:       '#6B5040',
  accessories: '#3C3C38',
}

const placeholderColor = PLACEHOLDER_COLORS[props.category] ?? '#3C3C38'
const categoryLabel = CATEGORY_LABELS[props.category] ?? props.category

function goToEdit() {
  router.push(`/wardrobe/${props.id}/edit`)
}
</script>

<template>
  <div class="clothes-card" @click="goToEdit">
    <!-- 圖片區（160px 高） -->
    <div
      class="clothes-card__image"
      :style="!imageUrl ? { backgroundColor: placeholderColor } : {}"
    >
      <img
        v-if="imageUrl"
        :src="`/api/clothes/${id}/image`"
        class="clothes-card__photo"
        alt=""
      />
    </div>

    <!-- 文字區 -->
    <div class="clothes-card__body">
      <p class="clothes-card__name">{{ name }}</p>
      <span class="clothes-card__tag">{{ categoryLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.clothes-card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-sub);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
}

.clothes-card__image {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  flex-shrink: 0;
}

.clothes-card__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.clothes-card__body {
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.clothes-card__name {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-main);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.clothes-card__tag {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: 500;
}
</style>
