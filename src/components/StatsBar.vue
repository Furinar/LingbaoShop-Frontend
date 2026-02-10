<script setup lang="ts">
defineProps<{
  total: number
  loading: boolean
}>()
</script>

<template>
  <div class="stats">
    <div class="stats__item">
      <div class="stats__value">
        <span v-show="loading" class="stats__skeleton" />
        <span v-show="!loading" class="stats__number">{{ total }}</span>
      </div>
      <div class="stats__label">今日分享码总数</div>
    </div>

    <div class="stats__divider" />

    <div class="stats__item">
      <div class="stats__value">
        <span class="stats__dot" />
        <span class="stats__number stats__number--live">在线</span>
      </div>
      <div class="stats__label">服务状态</div>
    </div>
  </div>
</template>

<style scoped>
.stats {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.stats__item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stats__value {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stats__number {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 20px;
  color: var(--color-primary);
  min-width: 48px;
}

.stats__number--live {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-success);
}

.stats__label {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 500;
}

.stats__divider {
  width: 1px;
  height: 32px;
  background: var(--color-border);
  flex-shrink: 0;
}

.stats__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-success);
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.stats__skeleton {
  display: inline-block;
  width: 48px;
  height: 24px;
  background: linear-gradient(
    90deg,
    var(--color-bg-elevated) 0%,
    var(--color-bg-surface) 50%,
    var(--color-bg-elevated) 100%
  );
  background-size: 200% 100%;
  border-radius: var(--radius-sm);
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .stats__dot {
    animation: none;
  }
  .stats__skeleton {
    animation: none;
  }
}
</style>
