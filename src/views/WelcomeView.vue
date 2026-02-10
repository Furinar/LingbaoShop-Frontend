<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DotBackground from '@/components/ui/DotBackground.vue'
import SparklesText from '@/components/ui/SparklesText.vue'
import TextGenerateEffect from '@/components/ui/TextGenerateEffect.vue'
import ShimmerButton from '@/components/ui/ShimmerButton.vue'

const router = useRouter()

const showLogo = ref(false)
const showTitle = ref(false)
const showDesc = ref(false)
const showButton = ref(false)
const showFooter = ref(false)

function handleStart() {
  localStorage.setItem('lingbao_visited', 'true')
  router.push('/')
}

onMounted(() => {
  setTimeout(() => { showLogo.value = true }, 100)
  setTimeout(() => { showTitle.value = true }, 400)
  setTimeout(() => { showDesc.value = true }, 700)
  setTimeout(() => { showButton.value = true }, 1300)
  setTimeout(() => { showFooter.value = true }, 1600)
})
</script>

<template>
  <DotBackground class="welcome">
    <div class="welcome__container">
      <Transition name="fade-up">
        <div v-if="showLogo" class="welcome__logo-wrap">
          <img src="/Lingbao-Shop.png" alt="灵宝集市"
            class="welcome__logo" />
        </div>
      </Transition>

      <Transition name="fade-up">
        <div v-if="showTitle" class="welcome__title-wrap">
          <SparklesText text="灵宝集市"
            class="welcome__title" :sparkles-count="12" />
        </div>
      </Transition>

      <div v-if="showDesc" class="welcome__desc">
        <TextGenerateEffect
          words="发现优质分享码，一键复制，即刻使用"
          class="welcome__desc-text" />
      </div>

      <Transition name="fade-up">
        <div v-if="showButton" class="welcome__action">
          <ShimmerButton @click="handleStart">
            <svg width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
            开始使用
          </ShimmerButton>
        </div>
      </Transition>

      <Transition name="fade">
        <p v-if="showFooter" class="welcome__footer">
          v0.0.1 · 仅供学习交流使用
        </p>
      </Transition>
    </div>
  </DotBackground>
</template>

<style scoped>
.welcome__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: var(--spacing-xl) var(--spacing-lg);
  text-align: center;
  gap: var(--spacing-lg);
}

.welcome__logo-wrap {
  margin-bottom: var(--spacing-sm);
}

.welcome__logo {
  height: 64px;
  width: auto;
  filter: drop-shadow(0 0 20px var(--color-primary-glow));
}

.welcome__title-wrap {
  margin-bottom: var(--spacing-xs);
}

.welcome__title {
  font-size: 32px;
  letter-spacing: -0.5px;
}

.welcome__desc {
  max-width: 280px;
}

.welcome__desc-text {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.welcome__action {
  margin-top: var(--spacing-lg);
}

.welcome__footer {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  white-space: nowrap;
}

.fade-up-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up-leave-active {
  transition: all 0.3s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from {
  opacity: 0;
}
</style>
