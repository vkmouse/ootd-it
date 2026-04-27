<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ConfirmModal from '@/components/ConfirmModal.vue'
import WheelPicker from '@/components/WheelPicker.vue'
import YearMonthPicker from '@/components/YearMonthPicker.vue'
import NumPad from '@/components/NumPad.vue'
import {
  iconShirt,
  iconPants,
  iconShoes,
  iconJacket,
  iconAccessories,
  iconUpload,
} from '@/utils/icons'

const router = useRouter()
const route = useRoute()

// 判斷模式：有 id 參數為編輯，否則為新增
const clothesId = computed(() => route.params.id as string | undefined)
const isEdit = computed(() => !!clothesId.value)

// 尺寸選項依類型決定
const SIZE_OPTIONS: Record<string, string[]> = {
  tops:        ['S', 'M', 'L', 'XL', 'XXL'],
  outerwear:   ['S', 'M', 'L', 'XL', 'XXL'],
  shoes:       ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
  accessories: [],
}

// 褲子尺寸：通用尺寸 vs 褲子尺寸（依制式切換）
const BOTTOMS_ALPHA   = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const BOTTOMS_NUMERIC = ['26', '27', '28', '29', '30', '31', '32', '33', '34', '36', '38']

// 褲子制式：'alpha' = 通用尺寸，'numeric' = 褲子尺寸
const bottomsSizeType = ref<'alpha' | 'numeric'>('alpha')

// 類型選項（含 SVG icon）
const CATEGORIES = [
  { value: 'tops',        label: '上衣', icon: iconShirt },
  { value: 'bottoms',     label: '褲子', icon: iconPants },
  { value: 'shoes',       label: '鞋子', icon: iconShoes },
  { value: 'outerwear',   label: '外套', icon: iconJacket },
  { value: 'accessories', label: '配件', icon: iconAccessories },
]

// 16 個固定色票
const COLOR_SWATCHES = [
  { name: '黑',  hex: '#1A1A1A' },
  { name: '深灰', hex: '#4A4A4A' },
  { name: '灰',  hex: '#9E9E9E' },
  { name: '淺灰', hex: '#CFCFCF' },
  { name: '白',  hex: '#F5F5F5' },
  { name: '米',  hex: '#F0EAD6' },
  { name: '卡其', hex: '#C3B091' },
  { name: '棕',  hex: '#795548' },
  { name: '深棕', hex: '#4E342E' },
  { name: '深藍', hex: '#1A237E' },
  { name: '藍',  hex: '#1565C0' },
  { name: '天藍', hex: '#64B5F6' },
  { name: '墨綠', hex: '#1B5E20' },
  { name: '紅',  hex: '#C62828' },
  { name: '粉',  hex: '#F48FB1' },
  { name: '紫',  hex: '#7B1FA2' },
]

const MAX_YEAR = new Date().getFullYear() + 1

const form = ref({
  name: '',
  category: '',
  color: '',
  color_note: '',
  size: '',
  acquired_price: '',
})

// 年月分開管理（null = 未選取）
const selectedYear = ref<number | null>(null)
const selectedMonth = ref<number | null>(null)

// 現有圖片 URL 及新選取的圖片 File
const existingImageUrl = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

// 隱藏的 file input ref
const fileInputRef = ref<HTMLInputElement | null>(null)

function openFilePicker() {
  fileInputRef.value?.click()
}

// touch 起始 Y 座標（由 WheelPicker 元件內部管理，此處已移除）

// 年份與月份 WheelPicker 的選項
const yearItems = computed(() => {
  const result: string[] = []
  for (let y = 2000; y <= MAX_YEAR; y++) result.push(String(y))
  return result
})
const monthItems = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

// 根據選擇的類型決定尺寸選項
const sizeOptions = computed(() => {
  if (form.value.category === 'bottoms') {
    return bottomsSizeType.value === 'numeric' ? BOTTOMS_NUMERIC : BOTTOMS_ALPHA
  }
  return SIZE_OPTIONS[form.value.category] ?? []
})
const showSize = computed(() => form.value.category !== '' && form.value.category !== 'accessories')

// 切換類型
function onCategorySelect(value: string) {
  form.value.category = value
  form.value.size = ''
  bottomsSizeType.value = 'alpha'
}

// 切換顏色色票（再次點選同色則清空）
function onColorSelect(name: string) {
  form.value.color = form.value.color === name ? '' : name
  // 若 color_note 為空，或目前值屬於任意色票名稱（追蹤狀態），則跟著更新
  const isTracking = !form.value.color_note || COLOR_SWATCHES.some(s => s.name === form.value.color_note)
  if (form.value.color && isTracking) {
    form.value.color_note = form.value.color
  }
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

  const data = await res.json() as {
    name: string
    category: string
    color: string | null
    color_note: string | null
    size: string | null
    acquired_date: string | null
    acquired_price: number | null
    image_url: string | null
  }

  form.value.name = data.name
  form.value.category = data.category
  // 只有符合色票清單的名稱才預選
  form.value.color = data.color && COLOR_SWATCHES.some(s => s.name === data.color) ? data.color : ''
  form.value.color_note = data.color_note ?? ''
  form.value.size = data.size ?? ''
  form.value.acquired_price = data.acquired_price != null ? String(data.acquired_price) : ''
  existingImageUrl.value = data.image_url
  // yyyyMM → 年月分開
  if (data.acquired_date && data.acquired_date.length === 6) {
    selectedYear.value = parseInt(data.acquired_date.slice(0, 4), 10)
    selectedMonth.value = parseInt(data.acquired_date.slice(4, 6), 10)
  }
  // 褲子：依 size 值是否為純數字自動切換制式
  if (data.category === 'bottoms' && data.size && /^\d+$/.test(data.size)) {
    bottomsSizeType.value = 'numeric'
  }
})

async function submit() {
  if (!form.value.name) return

  // 年月 → yyyyMM（兩者皆有值才組合）
  const acquiredDate = selectedYear.value && selectedMonth.value
    ? `${selectedYear.value}${String(selectedMonth.value).padStart(2, '0')}`
    : null

  const body = {
    name: form.value.name,
    category: form.value.category,
    color: form.value.color || null,
    color_note: form.value.color_note || null,
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
    const json = await res.json() as { id: string }
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

// 刪除衣物
const showDeleteModal = ref(false)

async function deleteClothes() {
  showDeleteModal.value = false
  await fetch(`/api/clothes/${clothesId.value}`, { method: 'DELETE' })
  router.back()
}
</script>

<template>
  <div class="clothes-edit">
    <form class="clothes-form" @submit.prevent="submit">
      <!-- 圖片 -->
      <div class="clothes-form__field">
        <label class="clothes-form__label">圖片</label>
        <div class="clothes-form__image-preview" @click="openFilePicker">
          <img
            v-if="previewUrl"
            :src="previewUrl"
            class="clothes-form__preview-img"
            alt="預覽圖"
          />
          <img
            v-else-if="existingImageUrl"
            :src="existingImageUrl"
            class="clothes-form__preview-img"
            alt="目前圖片"
          />
          <div v-else class="clothes-form__preview-placeholder">
            <span v-html="iconUpload" class="clothes-form__placeholder-icon" />
            <span class="clothes-form__placeholder-text">點擊上傳圖片</span>
          </div>
        </div>
        <input ref="fileInputRef" type="file" accept="image/*" style="display: none" @change="onFileChange" />
      </div>

      <!-- 名稱 -->
      <div class="clothes-form__field">
        <label class="clothes-form__label" for="name">名稱 <span class="required">*</span></label>
        <input id="name" v-model="form.name" class="clothes-form__input" type="text" required placeholder="例：白色 T-shirt" />
      </div>

      <!-- 類型 -->
      <div class="clothes-form__field">
        <label class="clothes-form__label">類型</label>
        <div class="category-selector">
          <button
            v-for="cat in CATEGORIES"
            :key="cat.value"
            type="button"
            class="category-btn"
            :class="{ 'category-btn--active': form.category === cat.value }"
            @click="onCategorySelect(cat.value)"
          >
            <span v-html="cat.icon" class="category-btn__icon" />
            <span class="category-btn__label">{{ cat.label }}</span>
          </button>
        </div>
      </div>

      <!-- 尺寸（依類型顯示） -->
      <div v-if="showSize" class="clothes-form__field">
        <label class="clothes-form__label">尺寸</label>
        <!-- 褲子制式切換 toggle -->
        <div v-if="form.category === 'bottoms'" class="size-type-toggle">
          <button
            type="button"
            class="size-type-btn"
            :class="{ 'size-type-btn--active': bottomsSizeType === 'alpha' }"
            @click="() => { bottomsSizeType = 'alpha'; form.size = '' }"
          >通用</button>
          <button
            type="button"
            class="size-type-btn"
            :class="{ 'size-type-btn--active': bottomsSizeType === 'numeric' }"
            @click="() => { bottomsSizeType = 'numeric'; form.size = '' }"
          >褲子尺寸</button>
        </div>
        <WheelPicker
          :items="sizeOptions"
          :modelValue="form.size"
          placeholder="請選擇"
          @update:modelValue="v => { form.size = v }"
        />
      </div>

      <!-- 顏色 -->
      <div class="clothes-form__field">
        <label class="clothes-form__label">顏色</label>
        <div class="color-swatches">
          <button
            v-for="swatch in COLOR_SWATCHES"
            :key="swatch.name"
            type="button"
            class="color-swatch"
            :class="{ 'color-swatch--active': form.color === swatch.name }"
            :style="{ backgroundColor: swatch.hex }"
            :title="swatch.name"
            @click="onColorSelect(swatch.name)"
          />
        </div>
        <input
          v-model="form.color_note"
          class="clothes-form__input"
          type="text"
          placeholder="備註"
        />
      </div>

      <!-- 入手時間 -->
      <div class="clothes-form__field">
        <label class="clothes-form__label">入手時間</label>
        <YearMonthPicker
          :yearItems="yearItems"
          :monthItems="monthItems"
          :yearValue="selectedYear ? String(selectedYear) : ''"
          :monthValue="selectedMonth ? String(selectedMonth).padStart(2, '0') : ''"
          @update:yearValue="v => { selectedYear = parseInt(v, 10) }"
          @update:monthValue="v => { selectedMonth = parseInt(v, 10) }"
        />
      </div>

      <!-- 入手價格 -->
      <div class="clothes-form__field">
        <label class="clothes-form__label" for="acquired_price">入手價格</label>
        <NumPad
          :modelValue="form.acquired_price"
          placeholder=""
          @update:modelValue="v => { form.acquired_price = v }"
        />
      </div>

      <button class="clothes-form__submit" type="submit">儲存</button>
      <button v-if="isEdit" type="button" class="clothes-form__delete" @click="showDeleteModal = true">刪除衣物</button>
    </form>
  </div>

  <ConfirmModal
    v-if="showDeleteModal"
    title="刪除衣物"
    message="此操作不可復原，衣物資料與圖片將一併刪除。"
    confirmLabel="刪除"
    cancelLabel="取消"
    @confirm="deleteClothes"
    @cancel="showDeleteModal = false"
  />
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
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
}

.clothes-form__preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.clothes-form__preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.clothes-form__placeholder-icon {
  display: flex;
  color: var(--color-text-muted);
  width: 64px;
  height: 64px;
}

.clothes-form__placeholder-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.clothes-form__placeholder-text {
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  letter-spacing: 0.04em;
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
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
  height: 52px;
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: 600;
  letter-spacing: 0.12em;
  cursor: pointer;
  margin-top: var(--spacing-sm);
}

.clothes-form__delete {
  background: none;
  color: #C62828;
  border: none;
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
  font-family: var(--font-body);
  font-weight: 500;
  cursor: pointer;
}

/* 類型選擇器 */
.category-selector {
  display: flex;
  gap: var(--spacing-xs);
}

.category-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: var(--spacing-sm) var(--spacing-xs);
  min-height: 64px;
  background-color: var(--color-bg-sub);
  color: var(--color-text-muted);
  border: none;
  border-radius: var(--radius-xl);
  cursor: pointer;
}

.category-btn--active {
  background-color: var(--color-secondary);
  color: var(--color-primary);
}

.category-btn__icon {
  display: flex;
  width: 24px;
  height: 24px;
}

.category-btn__icon :deep(svg) {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.category-btn__label {
  font-family: var(--font-body);
  font-size: 11px;
}

/* 色票選擇器 */
.color-swatches {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) 0;
}

.color-swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  outline: 2px solid transparent;
  outline-offset: 2px;
  justify-self: center;
}

.color-swatch--active {
  outline-color: var(--color-primary);
}

/* date-picker 已由 YearMonthPicker 元件取代，CSS 無需保留 */

/* 褲子尺寸制式切換 toggle */
.size-type-toggle {
  display: flex;
  gap: var(--spacing-xs);
}

.size-type-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-bg-sub);
  color: var(--color-text-muted);
  border: none;
  border-radius: var(--radius-xl);
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.size-type-btn--active {
  background-color: var(--color-secondary);
  color: var(--color-primary);
  font-weight: 600;
}
</style>

