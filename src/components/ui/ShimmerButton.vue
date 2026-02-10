<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  shimmerColor?: string
  shimmerSize?: string
  background?: string
}

withDefaults(defineProps<Props>(), {
  className: '',
  shimmerColor: 'rgba(255, 255, 255, 0.15)',
  shimmerSize: '0.1em',
  background: 'var(--color-primary)',
})

const emit = defineEmits<{ click: [e: MouseEvent] }>()
</script>

<template>
  <button
    :class="cn('shimmer-btn', className)"
    :style="{ background }"
    @click="emit('click', $event)"
  >
    <span
      class="shimmer-btn__shimmer"
      :style="{ background: `linear-gradient(120deg, transparent 30%, ${shimmerColor} 50%, transparent 70%)` }"
    />
    <span class="shimmer-btn__content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.shimmer-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 14px 40px;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font-sans);
  color: var(--color-bg);
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition:
    box-shadow var(--transition-normal),
    transform var(--transition-fast);
  min-height: 48px;
}

.shimmer-btn:hover {
  box-shadow:
    0 0 20px var(--color-primary-glow),
    0 4px 16px rgba(0, 0, 0, 0.3);
  transform: translateY(-1px);
}

.shimmer-btn:active {
  transform: scale(0.97);
}

.shimmer-btn__shimmer {
  position: absolute;
  inset: 0;
  background-size: 250% 100%;
  animation: shimmer-slide 2.5s ease-in-out infinite;
}

.shimmer-btn__content {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

@keyframes shimmer-slide {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .shimmer-btn__shimmer {
    animation: none;
  }
}
</style>
