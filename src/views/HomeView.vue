<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useShareCodeStore } from '@/stores/sharecode'
import type { SortType } from '@/types/sharecode'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import StatsBar from '@/components/StatsBar.vue'
import ShareCodeCard from '@/components/ShareCodeCard.vue'
import AddShareCodeModal from '@/components/AddShareCodeModal.vue'
import AnimatedGroup from '@/components/ui/AnimatedGroup.vue'

const store = useShareCodeStore()

function handleSort(sort: SortType) {
  store.setSort(sort)
}

const showAddModal = ref(false)

const countdown = ref(5)
const countdownKey = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

function startCountdown() {
  stopCountdown()
  countdown.value = 5
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      store.refreshShareCodes()
      countdown.value = 5
      countdownKey.value++
    }
  }, 1000)
}

function stopCountdown() {
  if (countdownTimer !== null) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

onMounted(() => {
  store.loadShareCodes()
  startCountdown()
})

onUnmounted(() => {
  stopCountdown()
})
</script>

<template>
  <div class="home">
    <AppHeader :sort-by="store.sortBy" @sort="handleSort" />

    <div class="countdown-float">
      <svg class="countdown-float__ring" width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="13" fill="none" stroke="var(--color-bg-elevated)" stroke-width="2" />
        <circle :key="countdownKey" cx="16" cy="16" r="13" fill="none" stroke="var(--color-primary)" stroke-width="2"
          stroke-linecap="round" class="countdown-float__arc" />
      </svg>
      <span class="countdown-float__text">{{ countdown }}</span>
    </div>

    <main class="home__main page-container">
      <StatsBar
        :total="store.total"
        :loading="store.loading && store.shareCodes.length === 0"
        class="home__stats"
      />

      <div v-if="store.error" class="home__error">
        <div class="home__error-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p class="home__error-text">{{ store.error }}</p>
        <button class="home__error-retry" @click="store.loadShareCodes()">
          重试
        </button>
      </div>

      <div
        v-if="store.loading && store.shareCodes.length === 0"
        class="home__grid"
      >
        <div v-for="i in 6" :key="i" class="skeleton-card">
          <div class="skeleton-card__label" />
          <div class="skeleton-card__code" />
          <div class="skeleton-card__footer">
            <div class="skeleton-card__price" />
            <div class="skeleton-card__btn" />
          </div>
        </div>
      </div>

      <AnimatedGroup
        v-else-if="store.shareCodes.length > 0"
        class="home__grid"
        :delay="100"
        :stagger="80"
      >
        <ShareCodeCard
          v-for="item in store.shareCodes"
          :key="item.code"
          :item="item"
        />
      </AnimatedGroup>

      <div
        v-else-if="!store.loading && !store.error"
        class="home__empty"
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="home__empty-icon">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.29 7 12 12 20.71 7" />
          <line x1="12" y1="22" x2="12" y2="12" />
        </svg>
        <p class="home__empty-text">暂无分享码</p>
        <p class="home__empty-hint">稍后再来看看吧</p>
      </div>

      <div v-if="store.shareCodes.length > 0" class="home__load-more">
        <div v-if="store.loading && store.shareCodes.length > 0" class="home__loading-indicator">
          <span class="home__spinner" />
          <span>加载中...</span>
        </div>
        <button
          v-else-if="store.hasMore"
          class="home__load-more-btn"
          @click="store.loadMore()"
        >
          获取更多
        </button>
        <p v-else class="home__load-more-end">
          -- 已显示全部 {{ store.total }} 条分享码 --
        </p>
      </div>
    </main>

    <AppFooter />

    <button
      class="fab"
      @click="showAddModal = true"
      aria-label="新增分享码"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>

    <AddShareCodeModal
      v-if="showAddModal"
      @close="showAddModal = false"
    />
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

.home__main {
  padding-top: var(--spacing-lg);
  padding-bottom: var(--spacing-xl);
}

.home__stats {
  margin-bottom: var(--spacing-lg);
}

.home__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

@media (min-width: 768px) {
  .home__grid {
    gap: var(--spacing-lg);
  }
}

.home__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;
}

.home__error-icon {
  color: var(--color-primary);
}

.home__error-text {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.home__error-retry {
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-bg);
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  transition:
    background var(--transition-fast),
    box-shadow var(--transition-fast);
  min-height: 36px;
}

.home__error-retry:hover {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-glow);
}

.skeleton-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}

.skeleton-card__label {
  width: 40px;
  height: 12px;
  background: var(--color-bg-elevated);
  border-radius: 4px;
  margin-bottom: var(--spacing-sm);
}

.skeleton-card__code {
  width: 100%;
  height: 18px;
  background: linear-gradient(
    90deg,
    var(--color-bg-elevated) 0%,
    var(--color-bg-surface) 50%,
    var(--color-bg-elevated) 100%
  );
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: var(--spacing-md);
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skeleton-card__price {
  width: 36px;
  height: 14px;
  background: var(--color-bg-elevated);
  border-radius: 4px;
}

.skeleton-card__btn {
  width: 52px;
  height: 28px;
  background: var(--color-bg-elevated);
  border-radius: var(--radius-sm);
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.home__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: 64px var(--spacing-lg);
  text-align: center;
}

.home__empty-icon {
  color: var(--color-text-muted);
  opacity: 0.3;
}

.home__empty-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.home__empty-hint {
  font-size: 13px;
  color: var(--color-text-muted);
}

.home__load-more {
  display: flex;
  justify-content: center;
  padding: var(--spacing-xl) 0;
}

.home__loading-indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 13px;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.home__load-more-end {
  font-size: 12px;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.home__load-more-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 32px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
  background: transparent;
  border: 1px solid var(--color-primary-dim);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  cursor: pointer;
  min-height: 40px;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.home__load-more-btn:hover {
  background: var(--color-primary-dim);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.home__load-more-btn:active {
  transform: scale(0.97);
}

.home__spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid var(--color-primary-dim);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.countdown-float {
  position: fixed;
  top: 60px;
  right: 16px;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  box-shadow: var(--shadow-card);
}

.countdown-float__ring {
  position: absolute;
  inset: 0;
}

.countdown-float__arc {
  stroke-dasharray: 81.68;
  stroke-dashoffset: 0;
  transform: rotate(-90deg);
  transform-origin: center;
  animation: countdown-float-drain 5s linear forwards;
}

@keyframes countdown-float-drain {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: 81.68; }
}

.countdown-float__text {
  position: relative;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  line-height: 1;
}

@media (prefers-reduced-motion: reduce) {
  .countdown-float__arc {
    animation: none;
  }
}

.fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-bg);
  box-shadow:
    0 4px 14px rgba(255, 122, 0, 0.4),
    0 2px 6px rgba(0, 0, 0, 0.3);
  transition:
    background var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
}

.fab:hover {
  background: var(--color-primary-hover);
  box-shadow:
    0 6px 20px rgba(255, 122, 0, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.4);
  transform: scale(1.08);
}

.fab:active {
  transform: scale(0.95);
}

@media (min-width: 768px) {
  .fab {
    bottom: 32px;
    right: 32px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-card__code {
    animation: none;
  }
  .home__spinner {
    animation: none;
  }
}
</style>
