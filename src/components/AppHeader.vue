<script setup lang="ts">
import type { SortType } from '@/types/sharecode'

defineProps<{
  sortBy: SortType
}>()

const emit = defineEmits<{
  sort: [value: SortType]
}>()

function handleSort(sort: SortType) {
  emit('sort', sort)
}
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <div class="header__brand">
        <img
          src="/Lingbao-Shop.svg"
          alt="灵宝集市"
          class="header__logo"
        />
        <span class="header__title">灵宝集市</span>
      </div>

      <div class="header__sort-group">
        <button
          class="header__sort-btn"
          :class="{ 'header__sort-btn--active': sortBy === 'time' }"
          @click="handleSort('time')"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          最新
        </button>
        <button
          class="header__sort-btn"
          :class="{ 'header__sort-btn--active': sortBy === 'price' }"
          @click="handleSort('price')"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          价格
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(18, 18, 18, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}

.header__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  max-width: 600px;
  margin: 0 auto;
}

@media (min-width: 1024px) {
  .header__inner {
    max-width: 480px;
  }
}

.header__brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.header__logo {
  height: 35px;
  width: auto;
  flex-shrink: 0;
}

.header__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.3px;
}

.header__sort-group {
  display: flex;
  gap: 2px;
  background: var(--color-bg-card);
  border-radius: var(--radius-sm);
  padding: 2px;
}

.header__sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
  border-radius: calc(var(--radius-sm) - 2px);
  transition:
    color var(--transition-fast),
    background var(--transition-fast);
  min-height: 32px;
}

.header__sort-btn:hover {
  color: var(--color-text-secondary);
}

.header__sort-btn--active {
  color: var(--color-primary);
  background: var(--color-bg-elevated);
}

.header__sort-btn--active:hover {
  color: var(--color-primary);
}
</style>
