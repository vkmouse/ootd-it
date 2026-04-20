<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <nav class="bottom-nav">
    <RouterLink to="/wardrobe" class="bottom-nav__tab" :class="{ 'is-active': route.path.startsWith('/wardrobe') }">
      衣櫥
    </RouterLink>
    <RouterLink to="/outfits" class="bottom-nav__tab" :class="{ 'is-active': route.path === '/outfits' }">
      穿搭
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  display: flex;
  background-color: var(--color-bg-sub);
  flex-shrink: 0;
}

.bottom-nav__tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-decoration: none;
  height: 52px;
}

.bottom-nav__tab.is-active {
  color: var(--color-primary);
  font-weight: 600;
}
</style>
