<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  items: string[]
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isActive = ref(false)
let deactivateTimer: ReturnType<typeof setTimeout> | null = null
let touchStartY = 0
const localIndex = ref(0)

function syncIndex() {
  const idx = props.items.indexOf(props.modelValue)
  localIndex.value = idx >= 0 ? idx : 0
}

function activate() {
  if (deactivateTimer) {
    clearTimeout(deactivateTimer)
    deactivateTimer = null
  }
  if (!isActive.value) {
    syncIndex()
    if (props.modelValue === '' && props.items.length > 0) {
      emit('update:modelValue', props.items[0]!)
    }
    isActive.value = true
  }
}

function scheduleDeactivate() {
  if (deactivateTimer) clearTimeout(deactivateTimer)
  deactivateTimer = setTimeout(() => {
    isActive.value = false
  }, 600)
}

function move(dir: 1 | -1) {
  const next = Math.max(0, Math.min(props.items.length - 1, localIndex.value + dir))
  if (next !== localIndex.value) {
    localIndex.value = next
    emit('update:modelValue', props.items[next]!)
  }
}

function onTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  if (!touch) return
  touchStartY = touch.clientY
  activate()
}

function onTouchMove(e: TouchEvent) {
  const touch = e.touches[0]
  if (!touch) return
  const delta = touchStartY - touch.clientY
  if (Math.abs(delta) >= 8) {
    move(delta > 0 ? 1 : -1)
    touchStartY = touch.clientY
  }
}

function onTouchEnd() {
  scheduleDeactivate()
}

function onWheel(e: WheelEvent) {
  activate()
  move(e.deltaY > 0 ? 1 : -1)
  scheduleDeactivate()
}

const slotItems = computed(() =>
  ([-2, -1, 0, 1, 2] as const).map(offset => {
    const idx = localIndex.value + offset
    return {
      offset,
      text: idx >= 0 && idx < props.items.length ? props.items[idx]! : '',
    }
  })
)

function slotStyle(offset: number) {
  const abs = Math.abs(offset)
  const sign = offset < 0 ? -1 : 1
  const rotateX = abs === 0 ? 0 : sign * (abs === 1 ? 25 : 40)
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.55 : 0.25
  const fontWeight = abs === 0 ? 600 : 400
  const color = abs === 0 ? 'var(--color-text-main)' : 'var(--color-text-muted)'
  return { transform: `perspective(200px) rotateX(${rotateX}deg)`, opacity, fontWeight, color }
}

const overlayText = computed(() => props.modelValue !== '' ? props.modelValue : props.placeholder)
</script>

<template>
  <div
    class="wheel-picker"
    :class="{ 'wheel-picker--active': isActive }"
    @touchstart.prevent="onTouchStart"
    @touchmove.prevent="onTouchMove"
    @touchend="onTouchEnd"
    @wheel.prevent="onWheel"
  >
    <!-- 中心選取指示條（Filled Card 風格，無 border/shadow） -->
    <div class="wheel-picker__indicator" />

    <!-- 5 slot 滾筒，始終在 DOM 中，透過容器 overflow:hidden 裁切 -->
    <div class="wheel-picker__drum">
      <div
        v-for="slot in slotItems"
        :key="slot.offset"
        class="wheel-picker__slot"
        :style="slotStyle(slot.offset)"
      >
        {{ slot.text }}
      </div>
    </div>

    <!-- inactive 覆蓋層：顯示當前值或 placeholder -->
    <div v-show="!isActive" class="wheel-picker__overlay">
      <span
        class="wheel-picker__overlay-text"
        :class="{ 'wheel-picker__overlay-text--placeholder': modelValue === '' }"
      >{{ overlayText }}</span>
    </div>
  </div>
</template>

<style scoped>
.wheel-picker {
  position: relative;
  height: 44px;
  overflow: hidden;
  background-color: var(--color-bg-sub);
  border-radius: var(--radius-xl);
  user-select: none;
  touch-action: none;
  cursor: ns-resize;
  transition: height 150ms ease;
}

.wheel-picker--active {
  height: 220px;
}

/* 中心指示條：以背景色區隔，符合 Filled Card 無 border/shadow 原則 */
.wheel-picker__indicator {
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

/*
  滾筒：top: 50% + translateY(-50%) 使滾筒中心（第 3 個 slot）
  始終對齊容器垂直中心。inactive 時 opacity: 0 隱藏滾筒，
  避免 3D perspective 投影溢出至可見區域。
*/
.wheel-picker__drum {
  position: absolute;
  left: 0;
  right: 0;
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

.wheel-picker--active .wheel-picker__drum {
  opacity: 1;
}

.wheel-picker__slot {
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

/* inactive 覆蓋層：蓋在滾筒上，active 時隱藏 */
.wheel-picker__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
}

.wheel-picker__overlay-text {
  font-family: var(--font-body);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-main);
}

.wheel-picker__overlay-text--placeholder {
  font-weight: 400;
  color: var(--color-text-muted);
}
</style>
