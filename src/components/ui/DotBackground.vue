<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  dotColor?: string
  dotSize?: string
  dotSpacing?: string
}

withDefaults(defineProps<Props>(), {
  className: '',
  dotColor: 'rgba(255, 122, 0, 0.15)',
  dotSize: '1px',
  dotSpacing: '22px',
})
</script>

<template>
  <div
    :class="cn('dot-bg', className)"
    :style="{
      backgroundImage: `radial-gradient(${dotColor} ${dotSize}, transparent ${dotSize})`,
      backgroundSize: `${dotSpacing} ${dotSpacing}`,
    }"
  >
    <div class="dot-bg__mask" />
    <div class="dot-bg__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.dot-bg {
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
}

.dot-bg__mask {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 20%,
    var(--color-bg) 80%
  );
  pointer-events: none;
}

.dot-bg__content {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
}
</style>
