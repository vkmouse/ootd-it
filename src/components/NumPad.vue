<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { iconXCircle, iconBackspace, iconCheck } from '@/utils/icons'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isActive = ref(false)
const rootEl = ref<HTMLElement | null>(null)

const formattedDisplay = computed(() => {
  if (!props.modelValue) return ''
  const parts = props.modelValue.split('.')
  const intPart = parts[0] ?? ''
  const decPart = parts[1]
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decPart !== undefined ? `${formatted}.${decPart}` : formatted
})

async function open() {
  isActive.value = true
  await nextTick()
  rootEl.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

function close() {
  isActive.value = false
}

function pressDigit(digit: string) {
  emit('update:modelValue', props.modelValue + digit)
}

function pressDouble() {
  emit('update:modelValue', props.modelValue + '00')
}

function pressDot() {
  if (props.modelValue.includes('.')) return
  emit('update:modelValue', props.modelValue + '.')
}

function pressBackspace() {
  if (!props.modelValue) return
  emit('update:modelValue', props.modelValue.slice(0, -1))
}

function pressClear() {
  emit('update:modelValue', '')
}

function pressConfirm() {
  close()
}
</script>

<template>
  <div
    ref="rootEl"
    class="numpad"
    :class="{ 'numpad--active': isActive }"
  >
    <!-- 收合時的顯示層 -->
    <div
      v-show="!isActive"
      class="numpad__overlay"
      @pointerdown.stop="open"
    >
      <span
        class="numpad__overlay-text"
        :class="{ 'numpad__overlay-text--placeholder': modelValue === '' }"
      >{{ modelValue !== '' ? formattedDisplay : placeholder }}</span>
    </div>

    <!-- 展開後的主體 -->
    <div v-show="isActive" class="numpad__body">
      <!-- 顯示列 -->
      <div class="numpad__display">
        <span class="numpad__display-value">{{ modelValue !== '' ? formattedDisplay : placeholder }}</span>
      </div>

      <!-- 按鍵區（4 欄 Grid） -->
      <div class="numpad__grid">
        <button type="button" class="numpad__key" @pointerdown.stop="pressDigit('7')">7</button>
        <button type="button" class="numpad__key" @pointerdown.stop="pressDigit('8')">8</button>
        <button type="button" class="numpad__key" @pointerdown.stop="pressDigit('9')">9</button>
        <button type="button" class="numpad__key numpad__key--fn" @pointerdown.stop="pressClear"><span class="numpad__key-icon" v-html="iconXCircle" /></button>

        <button type="button" class="numpad__key" @pointerdown.stop="pressDigit('4')">4</button>
        <button type="button" class="numpad__key" @pointerdown.stop="pressDigit('5')">5</button>
        <button type="button" class="numpad__key" @pointerdown.stop="pressDigit('6')">6</button>
        <button type="button" class="numpad__key numpad__key--fn" @pointerdown.stop="pressBackspace"><span class="numpad__key-icon" v-html="iconBackspace" /></button>

        <button type="button" class="numpad__key" @pointerdown.stop="pressDigit('1')">1</button>
        <button type="button" class="numpad__key" @pointerdown.stop="pressDigit('2')">2</button>
        <button type="button" class="numpad__key" @pointerdown.stop="pressDigit('3')">3</button>
        <!-- 確定：跨兩列 -->
        <button type="button" class="numpad__key numpad__key--confirm" @pointerdown.stop="pressConfirm"><span class="numpad__key-icon" v-html="iconCheck" /></button>

        <button type="button" class="numpad__key" @pointerdown.stop="pressDouble">00</button>
        <button type="button" class="numpad__key" @pointerdown.stop="pressDigit('0')">0</button>
        <button type="button" class="numpad__key" @pointerdown.stop="pressDot">.</button>
        <!-- 第 4 列第 4 欄由確定鍵佔用（grid-row span） -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.numpad {
  position: relative;
  height: 44px;
  background-color: var(--color-bg-sub);
  border-radius: var(--radius-xl);
  user-select: none;
  overflow: hidden;
  transition: height 150ms ease, border-radius 150ms ease;
}

.numpad--active {
  /* 顯示列 44px + 4 行按鍵各 48px = 236px */
  height: 236px;
  border-radius: var(--radius-lg);
  overflow: visible;
}

/* 收合顯示層 */
.numpad__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-md);
  cursor: pointer;
}

.numpad__overlay-text {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-text-main);
}

.numpad__overlay-text--placeholder {
  font-weight: 400;
  color: var(--color-text-muted);
}

.numpad__key-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
}

.numpad__key-icon :deep(svg) {
  width: 100%;
  height: 100%;
  stroke-width: 1.75;
}

/* 展開主體 */
.numpad__body {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 顯示列 */
.numpad__display {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-md);
  background-color: var(--color-secondary);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.numpad__display-value {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-text-main);
  letter-spacing: 0.04em;
}

/* 按鍵 Grid：3 欄數字 + 1 欄功能鍵，4 列 */
.numpad__grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr) 1fr;
  grid-template-rows: repeat(4, 1fr);
  gap: 1px;
  background-color: var(--color-secondary);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  overflow: hidden;
}

.numpad__key {
  background-color: var(--color-bg-sub);
  color: var(--color-text-main);
  border: none;
  font-family: var(--font-body);
  font-size: var(--font-size-lg);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 功能鍵（刪、退）：稍深背景區隔 */
.numpad__key--fn {
  background-color: var(--color-secondary);
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
}

/* 確定鍵：跨兩列（第 3-4 列，第 4 欄） */
.numpad__key--confirm {
  grid-column: 4;
  grid-row: 3 / 5;
  background-color: var(--color-primary);
  color: #000;
  font-weight: 700;
  font-size: var(--font-size-base);
}
</style>
