<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ClothesCard from '../components/ClothesCard.vue'

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
      <p>還沒有任何衣物，按下「＋」新增吧！</p>
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
      ＋
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
  color: var(--color-text-muted);
  padding: var(--spacing-xl) 0;
  font-size: var(--font-size-base);
}

.wardrobe__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
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
  font-size: var(--font-size-xl);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
