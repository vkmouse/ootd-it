<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  yearItems: string[]
  monthItems: string[]
  yearValue: string
  monthValue: string
  yearPlaceholder?: string
  monthPlaceholder?: string
}>(), {
  yearPlaceholder: '年',
  monthPlaceholder: '月',
})

const emit = defineEmits<{
  'update:yearValue': [value: string]
  'update:monthValue': [value: string]
}>()

const isActive = ref(false)
const localYearIndex = ref(0)
const localMonthIndex = ref(0)
const rootEl = ref<HTMLElement | null>(null)

let pointerStartY = 0
let lastY = 0
let scrollDelta = 0
let currentPointerId = -1
let activeDrum: 'year' | 'month' = 'year'

function syncIndexes() {
  const yi = props.yearItems.indexOf(props.yearValue)
  localYearIndex.value = yi >= 0 ? yi : 0
  const mi = props.monthItems.indexOf(props.monthValue)
  localMonthIndex.value = mi >= 0 ? mi : 0
}

function moveYear(dir: 1 | -1) {
  const next = Math.max(0, Math.min(props.yearItems.length - 1, localYearIndex.value + dir))
  if (next !== localYearIndex.value) {
    localYearIndex.value = next
    emit('update:yearValue', props.yearItems[next]!)
  }
}

function moveMonth(dir: 1 | -1) {
  const next = Math.max(0, Math.min(props.monthItems.length - 1, localMonthIndex.value + dir))
  if (next !== localMonthIndex.value) {
    localMonthIndex.value = next
    emit('update:monthValue', props.monthItems[next]!)
  }
}

function onPointerDown(e: PointerEvent) {
  pointerStartY = e.clientY
  lastY = e.clientY
  scrollDelta = 0
  currentPointerId = e.pointerId
  const el = e.currentTarget as HTMLElement
  activeDrum = e.offsetX < el.offsetWidth / 2 ? 'year' : 'month'
  el.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (e.pointerId !== currentPointerId) return
  const delta = lastY - e.clientY
  lastY = e.clientY
  scrollDelta += delta
  if (Math.abs(scrollDelta) >= 28) {
    const dir = scrollDelta > 0 ? 1 : -1
    if (activeDrum === 'year') moveYear(dir)
    else moveMonth(dir)
    scrollDelta = scrollDelta - dir * 28
  }
}

function onPointerUp(e: PointerEvent) {
  if (e.pointerId !== currentPointerId) return
  ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  const totalDisplacement = Math.abs(e.clientY - pointerStartY)
  if (totalDisplacement < 28 && !isActive.value) {
    syncIndexes()
    isActive.value = true
  }
  currentPointerId = -1
}

function onOutsidePointerDown(e: PointerEvent) {
  if (isActive.value && rootEl.value && !rootEl.value.contains(e.target as Node)) {
    isActive.value = false
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onOutsidePointerDown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onOutsidePointerDown)
})

function computedSlots(localIndex: number, items: string[]) {
  return ([-2, -1, 0, 1, 2] as const).map(offset => {
    const idx = localIndex + offset
    return {
      offset,
      text: idx >= 0 && idx < items.length ? items[idx]! : '',
    }
  })
}

function slotStyle(offset: number) {
  const abs = Math.abs(offset)
  const sign = offset < 0 ? -1 : 1
  const rotateX = abs === 0 ? 0 : sign * (abs === 1 ? 25 : 40)
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.55 : 0.25
  const fontWeight = abs === 0 ? 600 : 400
  const color = abs === 0 ? 'var(--color-text-main)' : 'var(--color-text-muted)'
  return { transform: `perspective(200px) rotateX(${rotateX}deg)`, opacity, fontWeight, color }
}

const yearSlots = computed(() => computedSlots(localYearIndex.value, props.yearItems))
const monthSlots = computed(() => computedSlots(localMonthIndex.value, props.monthItems))

const overlayYearText = computed(() => props.yearValue !== '' ? props.yearValue : props.yearPlaceholder)
const overlayMonthText = computed(() => props.monthValue !== '' ? props.monthValue : props.monthPlaceholder)
const yearIsPlaceholder = computed(() => props.yearValue === '')
const monthIsPlaceholder = computed(() => props.monthValue === '')
</script>

<template>
  <div
    ref="rootEl"
    class="ym-picker"
    :class="{ 'ym-picker--active': isActive }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  >
    <!-- 中心指示條，橫跨整個容器寬度 -->
    <div class="ym-picker__indicator" />

    <!-- 年 drum（左半部） -->
    <div class="ym-picker__drum ym-picker__drum--year">
      <div
        v-for="slot in yearSlots"
        :key="slot.offset"
        class="ym-picker__slot"
        :style="slotStyle(slot.offset)"
      >
        {{ slot.text }}
      </div>
    </div>

    <!-- 月 drum（右半部） -->
    <div class="ym-picker__drum ym-picker__drum--month">
      <div
        v-for="slot in monthSlots"
        :key="slot.offset"
        class="ym-picker__slot"
        :style="slotStyle(slot.offset)"
      >
        {{ slot.text }}
      </div>
    </div>

    <!-- inactive 覆蓋層 -->
    <div v-show="!isActive" class="ym-picker__overlay">
      <span
        class="ym-picker__overlay-text"
        :class="{ 'ym-picker__overlay-text--placeholder': yearIsPlaceholder }"
      >{{ overlayYearText }}</span>
      <span class="ym-picker__overlay-sep">   </span>
      <span
        class="ym-picker__overlay-text"
        :class="{ 'ym-picker__overlay-text--placeholder': monthIsPlaceholder }"
      >{{ overlayMonthText }}</span>
    </div>
  </div>
</template>

<style scoped>
.ym-picker {
  position: relative;
  height: 44px;
  overflow: hidden;
  background-color: var(--color-bg-sub);
  border-radius: var(--radius-xl);
  user-select: none;
  touch-action: none;
  cursor: pointer;
  transition: height 150ms ease;
  display: flex;
  flex-direction: row;
}

.ym-picker--active {
  height: 220px;
}

/* 中心指示條：橫跨整個容器，符合 Filled Card 無 border/shadow 原則 */
.ym-picker__indicator {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 44px;
  transform: translateY(-50%);
  background-color: var(--color-secondary);
  pointer-events: none;
  z-index: 0;
}

/* 年/月 drum 各佔 50% 寬度，垂直方向置中顯示 5 個 slot */
.ym-picker__drum {
  flex: 1;
  position: relative;
  top: 50%;
  height: 220px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  transition: opacity 100ms ease;
}

.ym-picker--active .ym-picker__drum {
  opacity: 1;
}

.ym-picker__slot {
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  font-family: var(--font-body);
  font-size: var(--font-size-lg);
  will-change: transform;
}

/* inactive 覆蓋層 */
.ym-picker__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
  gap: 0;
}

.ym-picker__overlay-text {
  font-family: var(--font-body);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-main);
}

.ym-picker__overlay-text--placeholder {
  font-weight: 400;
  color: var(--color-text-muted);
}

.ym-picker__overlay-sep {
  font-family: var(--font-body);
  font-size: var(--font-size-lg);
  white-space: pre;
}
</style>
