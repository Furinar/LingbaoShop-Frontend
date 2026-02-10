<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  words: string
  delay?: number
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  className: '',
})

const started = ref(false)
const characters = computed(() => props.words.split(''))

onMounted(() => {
  setTimeout(() => {
    started.value = true
  }, props.delay)
})
</script>

<template>
  <span :class="cn('inline', className)">
    <span
      v-for="(char, i) in characters"
      :key="i"
      class="tge-char"
      :class="{ 'tge-char--visible': started }"
      :style="{ transitionDelay: started ? `${i * 50}ms` : '0ms' }"
    >{{ char === ' ' ? '\u00A0' : char }}</span>
  </span>
</template>

<style scoped>
.tge-char {
  opacity: 0;
  filter: blur(4px);
  transition:
    opacity 0.3s ease,
    filter 0.3s ease;
  display: inline;
}

.tge-char--visible {
  opacity: 1;
  filter: blur(0);
}
</style>
