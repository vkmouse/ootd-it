<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}>(), {
  confirmLabel: '確認',
  cancelLabel: '取消',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <div class="modal-overlay" @click.self="emit('cancel')">
    <div class="modal-card">
      <h2 class="modal-title">{{ title }}</h2>
      <p class="modal-message">{{ message }}</p>
      <div class="modal-actions">
        <button type="button" class="modal-btn modal-btn--cancel" @click="emit('cancel')">
          {{ cancelLabel }}
        </button>
        <button type="button" class="modal-btn modal-btn--confirm" @click="emit('confirm')">
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
}

.modal-card {
  background-color: var(--color-bg-sub);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.modal-title {
  font-family: var(--font-body);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0;
}

.modal-message {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.modal-btn {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.modal-btn--cancel {
  background-color: var(--color-secondary);
  color: var(--color-text-muted);
}

.modal-btn--confirm {
  background-color: var(--color-primary);
  color: var(--color-bg-main);
}
</style>
