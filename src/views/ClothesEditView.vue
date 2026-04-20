<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 尺寸選項依類型決定
const SIZE_OPTIONS: Record<string, string[]> = {
  tops:       ['S', 'M', 'L', 'XL', 'XXL'],
  outerwear:  ['S', 'M', 'L', 'XL', 'XXL'],
  bottoms:    ['28', '29', '30', '31', '32', '33', '34', '36', '38'],
  shoes:      ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
  accessories: [],
}

// 類型顯示名稱
const CATEGORIES = [
  { value: 'tops',        label: '上衣' },
  { value: 'bottoms',     label: '褲子' },
  { value: 'outerwear',   label: '外套' },
  { value: 'shoes',       label: '鞋子' },
  { value: 'accessories', label: '配件' },
]

const form = ref({
  name: '',
  category: '',
  color: '',
  size: '',
  acquired_occasion: '',
  acquired_price: '',
})

// 根據選擇的類型決定尺寸選項
const sizeOptions = computed(() => SIZE_OPTIONS[form.value.category] ?? [])
const showSize = computed(() => form.value.category !== '' && form.value.category !== 'accessories')

// 切換類型時清空尺寸
function onCategoryChange() {
  form.value.size = ''
}

async function submit() {
  if (!form.value.name) return

  const body = {
    name: form.value.name,
    category: form.value.category,
    color: form.value.color || null,
    size: form.value.size || null,
    acquired_occasion: form.value.acquired_occasion || null,
    acquired_price: form.value.acquired_price ? Number(form.value.acquired_price) : null,
  }

  await fetch('/api/clothes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  router.push('/wardrobe')
}
</script>

<template>
  <form class="clothes-form" @submit.prevent="submit">
    <!-- 名稱 -->
    <div class="clothes-form__field">
      <label class="clothes-form__label" for="name">名稱 <span class="required">*</span></label>
      <input id="name" v-model="form.name" class="clothes-form__input" type="text" required placeholder="例：白色 T-shirt" />
    </div>

    <!-- 類型 -->
    <div class="clothes-form__field">
      <label class="clothes-form__label" for="category">類型</label>
      <select id="category" v-model="form.category" class="clothes-form__input" @change="onCategoryChange">
        <option value="">請選擇</option>
        <option v-for="cat in CATEGORIES" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
      </select>
    </div>

    <!-- 尺寸（依類型顯示） -->
    <div v-if="showSize" class="clothes-form__field">
      <label class="clothes-form__label" for="size">尺寸</label>
      <select id="size" v-model="form.size" class="clothes-form__input">
        <option value="">請選擇</option>
        <option v-for="s in sizeOptions" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <!-- 顏色 -->
    <div class="clothes-form__field">
      <label class="clothes-form__label" for="color">顏色</label>
      <input id="color" v-model="form.color" class="clothes-form__input" type="text" placeholder="例：白色" />
    </div>

    <!-- 入手時機 -->
    <div class="clothes-form__field">
      <label class="clothes-form__label" for="acquired_occasion">入手時機</label>
      <input id="acquired_occasion" v-model="form.acquired_occasion" class="clothes-form__input" type="text" placeholder="例：生日禮物、特賣" />
    </div>

    <!-- 入手價格 -->
    <div class="clothes-form__field">
      <label class="clothes-form__label" for="acquired_price">入手價格</label>
      <input id="acquired_price" v-model="form.acquired_price" class="clothes-form__input" type="number" min="0" placeholder="例：990" />
    </div>

    <button class="clothes-form__submit" type="submit">儲存</button>
  </form>
</template>

<style scoped>
.clothes-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.clothes-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.clothes-form__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.required {
  color: var(--color-primary);
}

.clothes-form__input {
  background-color: var(--color-bg-sub);
  color: var(--color-text-main);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  width: 100%;
  outline: none;
}

.clothes-form__submit {
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  margin-top: var(--spacing-sm);
}
</style>
