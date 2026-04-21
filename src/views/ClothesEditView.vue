<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 判斷模式：有 id 參數為編輯，否則為新增
const clothesId = computed(() => route.params.id as string | undefined)
const isEdit = computed(() => !!clothesId.value)

// 尺寸選項依類型決定
const SIZE_OPTIONS: Record<string, string[]> = {
  tops:        ['S', 'M', 'L', 'XL', 'XXL'],
  outerwear:   ['S', 'M', 'L', 'XL', 'XXL'],
  bottoms:     ['28', '29', '30', '31', '32', '33', '34', '36', '38'],
  shoes:       ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
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
  acquired_date: '',  // 前端格式：yyyy-MM（input type="month"），送出時轉為 yyyyMM
  acquired_price: '',
})

// 現有圖片 URL 及新選取的圖片 File
const existingImageUrl = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

// 根據選擇的類型決定尺寸選項
const sizeOptions = computed(() => SIZE_OPTIONS[form.value.category] ?? [])
const showSize = computed(() => form.value.category !== '' && form.value.category !== 'accessories')

// 切換類型時清空尺寸
function onCategoryChange() {
  form.value.size = ''
}

// 選取圖片時建立本地預覽
function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  selectedFile.value = file
  if (file) {
    previewUrl.value = URL.createObjectURL(file)
  } else {
    previewUrl.value = null
  }
}

// 編輯模式：掛載時讀取現有資料
onMounted(async () => {
  if (!isEdit.value) return

  const res = await fetch(`/api/clothes/${clothesId.value}`)
  if (!res.ok) return

  const data = await res.json<{
    name: string
    category: string
    color: string | null
    size: string | null
    acquired_date: string | null
    acquired_price: number | null
    image_url: string | null
  }>()

  form.value.name = data.name
  form.value.category = data.category
  form.value.color = data.color ?? ''
  form.value.size = data.size ?? ''
  // yyyyMM → yyyy-MM 給 input type="month"
  form.value.acquired_date = data.acquired_date
    ? `${data.acquired_date.slice(0, 4)}-${data.acquired_date.slice(4, 6)}`
    : ''
  form.value.acquired_price = data.acquired_price != null ? String(data.acquired_price) : ''
  existingImageUrl.value = data.image_url
})

async function submit() {
  if (!form.value.name) return

  // yyyy-MM → yyyyMM
  const acquiredDate = form.value.acquired_date
    ? form.value.acquired_date.replace('-', '')
    : null

  const body = {
    name: form.value.name,
    category: form.value.category,
    color: form.value.color || null,
    size: form.value.size || null,
    acquired_date: acquiredDate,
    acquired_price: form.value.acquired_price ? Number(form.value.acquired_price) : null,
  }

  let savedId: string

  if (isEdit.value) {
    await fetch(`/api/clothes/${clothesId.value}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    savedId = clothesId.value!
  } else {
    const res = await fetch('/api/clothes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json<{ id: string }>()
    savedId = json.id
  }

  // 若有選取圖片，上傳至 R2
  if (selectedFile.value) {
    const fd = new FormData()
    fd.append('image', selectedFile.value)
    await fetch(`/api/clothes/${savedId}/image`, {
      method: 'POST',
      body: fd,
    })
  }

  router.back()
}
</script>

<template>
  <div class="clothes-edit">
    <form class="clothes-form" @submit.prevent="submit">
      <!-- 圖片 -->
      <div class="clothes-form__field">
        <label class="clothes-form__label" for="image">圖片</label>
        <div class="clothes-form__image-preview">
          <img
            v-if="previewUrl"
            :src="previewUrl"
            class="clothes-form__preview-img"
            alt="預覽圖"
          />
          <img
            v-else-if="existingImageUrl"
            :src="`/api/clothes/${clothesId}/image`"
            class="clothes-form__preview-img"
            alt="目前圖片"
          />
          <div v-else class="clothes-form__preview-placeholder" aria-hidden="true" />
        </div>
        <input id="image" type="file" accept="image/*" class="clothes-form__input" @change="onFileChange" />
      </div>

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

      <!-- 入手時間 -->
      <div class="clothes-form__field">
        <label class="clothes-form__label" for="acquired_date">入手時間</label>
        <input id="acquired_date" v-model="form.acquired_date" class="clothes-form__input" type="month" />
      </div>

      <!-- 入手價格 -->
      <div class="clothes-form__field">
        <label class="clothes-form__label" for="acquired_price">入手價格</label>
        <input id="acquired_price" v-model="form.acquired_price" class="clothes-form__input" type="number" min="0" placeholder="例：990" />
      </div>

      <button class="clothes-form__submit" type="submit">儲存</button>
    </form>
  </div>
</template>

<style scoped>
.clothes-edit {
  display: flex;
  flex-direction: column;
}

.clothes-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
}

.clothes-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.clothes-form__label {
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.required {
  color: var(--color-primary);
}

.clothes-form__image-preview {
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: var(--color-bg-sub);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.clothes-form__preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.clothes-form__preview-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--color-secondary);
  border-radius: var(--radius-md);
}

.clothes-form__input {
  background-color: var(--color-bg-sub);
  color: var(--color-text-main);
  border: none;
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
  font-family: var(--font-body);
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
