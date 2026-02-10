<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { cn } from '@/lib/utils'

interface Sparkle {
  id: number
  x: string
  y: string
  size: number
  color: string
  delay: string
  duration: string
}

interface Props {
  text: string
  className?: string
  sparklesCount?: number
  colors?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  sparklesCount: 10,
  colors: () => ['#FF7A00', '#FFB347', '#FFFFFF', '#FF9A33'],
})

let idCounter = 0
const sparkles = ref<Sparkle[]>([])
let interval: ReturnType<typeof setInterval> | null = null

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function createSparkle(): Sparkle {
  return {
    id: idCounter++,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: Math.random() * 6 + 4,
    color: randomPick(props.colors),
    delay: `${Math.random() * 2}s`,
    duration: `${Math.random() * 1.5 + 1}s`,
  }
}

function initSparkles() {
  sparkles.value = Array.from(
    { length: props.sparklesCount },
    () => createSparkle(),
  )
}

onMounted(() => {
  initSparkles()
  interval = setInterval(() => {
    const idx = Math.floor(Math.random() * sparkles.value.length)
    sparkles.value[idx] = createSparkle()
  }, 800)
})

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <span :class="cn('sparkles-text', className)">
    <span class="sparkles-text__inner">
      {{ text }}
      <span
        v-for="s in sparkles"
        :key="s.id"
        class="sparkles-text__particle"
        :style="{
          left: s.x,
          top: s.y,
          width: `${s.size}px`,
          height: `${s.size}px`,
          color: s.color,
          animationDelay: s.delay,
          animationDuration: s.duration,
        }"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z" />
        </svg>
      </span>
    </span>
  </span>
</template>

<style scoped>
.sparkles-text {
  display: inline-block;
  font-weight: 700;
  color: var(--color-primary);
}

.sparkles-text__inner {
  position: relative;
  display: inline-block;
}

.sparkles-text__particle {
  position: absolute;
  pointer-events: none;
  animation: sparkle-anim 1.5s ease-in-out infinite;
}

.sparkles-text__particle svg {
  width: 100%;
  height: 100%;
}

@keyframes sparkle-anim {
  0%, 100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sparkles-text__particle {
    animation: none;
    opacity: 0.6;
  }
}
</style>
