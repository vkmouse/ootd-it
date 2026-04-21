<script setup lang="ts">
import { useRoute } from 'vue-router'
import { iconShirt, iconShirtFilled, iconWardrobe, iconWardrobeFilled } from '@/utils/icons'

const route = useRoute()
</script>

<template>
  <nav class="bottom-nav">
    <RouterLink to="/wardrobe" class="bottom-nav__tab" :class="{ 'is-active': route.path.startsWith('/wardrobe') }">
      <span class="bottom-nav__pill">
        <span
          class="bottom-nav__icon"
          v-html="route.path.startsWith('/wardrobe') ? iconWardrobeFilled : iconWardrobe"
        />
        <span class="bottom-nav__label">衣櫥</span>
      </span>
    </RouterLink>
    <RouterLink to="/outfits" class="bottom-nav__tab" :class="{ 'is-active': route.path === '/outfits' }">
      <span class="bottom-nav__pill">
        <span
          class="bottom-nav__icon"
          v-html="route.path === '/outfits' ? iconShirtFilled : iconShirt"
        />
        <span class="bottom-nav__label">穿搭</span>
      </span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  display: flex;
  background-color: var(--color-bg-sub);
  height: 80px;
  flex-shrink: 0;
  align-items: flex-start;
  padding-top: var(--spacing-sm);
}

.bottom-nav__tab {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  text-decoration: none;
  color: var(--color-text-muted);
}

.bottom-nav__tab.is-active {
  color: var(--color-primary);
}

.bottom-nav__pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 20px;
  border-radius: 999px;
}

.bottom-nav__tab.is-active .bottom-nav__pill {
  background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.bottom-nav__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.bottom-nav__icon :deep(svg) {
  width: 20px;
  height: 20px;
}

.bottom-nav__label {
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
}

.bottom-nav__tab.is-active .bottom-nav__label {
  font-weight: 600;
}
</style>
