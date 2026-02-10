<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'

interface Props {
  delay?: number
  stagger?: number
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  stagger: 80,
})

const containerRef = useTemplateRef<HTMLElement>('containerRef')
const ready = ref(false)

onMounted(() => {
  const el = containerRef.value
  if (!el) return
  const children = Array.from(el.children) as HTMLElement[]
  children.forEach((child, i) => {
    child.style.opacity = '0'
    child.style.transform = 'translateY(16px)'
    child.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
    child.style.transitionDelay = `${props.delay + i * props.stagger}ms`
  })
  // 触发reflow后显示
  void el.offsetWidth
  ready.value = true
  children.forEach((child) => {
    child.style.opacity = '1'
    child.style.transform = 'translateY(0)'
  })
})
</script>

<template>
  <div ref="containerRef">
    <slot />
  </div>
</template>
