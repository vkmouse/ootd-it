<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ClothesCard from '../components/ClothesCard.vue'
import { iconPlus } from '@/utils/icons'

interface ClothesItem {
  id: string
  name: string
  category: string
  color: string | null
  size: string | null
  image_url: string | null
}

const router = useRouter()
const clothes = ref<ClothesItem[]>([])

onMounted(async () => {
  const res = await fetch('/api/clothes')
  clothes.value = await res.json()
})
</script>

<template>
  <div class="wardrobe">
    <div v-if="clothes.length === 0" class="wardrobe__empty">
      <p class="wardrobe__empty-title">衣橱是空的</p>
      <p class="wardrobe__empty-sub">按下「＋」開始記錄你的穿搭吧！</p>
    </div>

    <div class="wardrobe__list">
      <ClothesCard
        v-for="item in clothes"
        :key="item.id"
        :id="item.id"
        :name="item.name"
        :category="item.category"
        :color="item.color"
        :size="item.size"
        :image-url="item.image_url"
      />
    </div>

    <!-- 新增按鈕 -->
    <button class="wardrobe__add-btn" @click="router.push('/wardrobe/new')" aria-label="新增衣物">
      <span class="wardrobe__add-icon" v-html="iconPlus" />
    </button>
  </div>
</template>

<style scoped>
.wardrobe {
  position: relative;
  min-height: 100%;
}

.wardrobe__empty {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.wardrobe__empty-title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-main);
}

.wardrobe__empty-sub {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.wardrobe__list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-sm) var(--spacing-sm);
}

/* 浮動新增按鈕 */
.wardrobe__add-btn {
  position: fixed;
  bottom: calc(var(--bottom-nav-height) + var(--spacing-lg));
  right: max(var(--spacing-lg), calc(50vw - 480px / 2 + var(--spacing-lg)));
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wardrobe__add-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.wardrobe__add-icon :deep(svg) {
  width: 24px;
  height: 24px;
}
</style>
