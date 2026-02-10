<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import type { ShareCode, CardTier } from '@/types/sharecode'
import { useShareCode } from '@/services/api'

const props = defineProps<{
  item: ShareCode
}>()

const tier = computed<CardTier>(() => {
  if (props.item.price >= 850) return 'premium'
  if (props.item.used < 6) return 'new'
  return 'normal'
})

const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(props.item.code)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = props.item.code
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  copied.value = true
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copied.value = false
  }, 2000)

  // 调用后端接口增加使用人数
  try {
    await useShareCode(props.item.code)
    props.item.used++
  } catch {
    // 复制已成功，使用计数失败不影响用户体验
  }
}

onUnmounted(() => {
  if (copyTimer) {
    clearTimeout(copyTimer)
    copyTimer = null
  }
})

function formatTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - timestamp

  if (diff < 0) return '刚刚'
  if (diff < 60) return `${diff}秒前`
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`

  // 超过30天显示日期
  const date = new Date(timestamp * 1000)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}
</script>

<template>
  <div
    class="card"
    :class="[`card--${tier}`]"
    @click="handleCopy"
  >
    <div class="card__header">
      <span v-if="tier === 'new'" class="card__badge">NEW</span>
      <span v-else-if="tier === 'premium'" class="card__badge card__badge--premium">HOT</span>
      <span v-else class="card__badge card__badge--normal">SHARE</span>
      <span class="card__time">{{ formatTime(item.create_time) }}</span>
    </div>

    <div class="card__code">{{ item.code }}</div>

    <div class="card__used">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      {{ item.used }} 人使用
    </div>

    <div class="card__footer">
      <span class="card__price">
        <span class="card__price-symbol">¥</span>{{ item.price }}
      </span>

      <button
        class="card__copy-btn"
        :class="{ 'card__copy-btn--copied': copied }"
        @click.stop="handleCopy"
        :aria-label="copied ? '已复制' : '复制分享码'"
      >
        <svg
          v-if="!copied"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg
          v-else
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>{{ copied ? '已复制' : '复制' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition:
    background var(--transition-normal),
    box-shadow var(--transition-normal),
    transform var(--transition-normal);
  overflow: hidden;
}

.card:hover {
  background: var(--color-bg-card-hover);
  box-shadow: var(--shadow-card-hover);
}

.card:active {
  transform: scale(0.98);
}

.card--new {
  box-shadow: var(--shadow-card);
}

.card--new:hover {
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.1), var(--shadow-card-hover);
}

.card--premium {
  background: linear-gradient(
    180deg,
    rgba(255, 122, 0, 0.06) 0%,
    var(--color-bg-card) 40%
  );
}

.card--premium:hover {
  box-shadow: var(--shadow-glow), var(--shadow-card-hover);
}

.card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.card__badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: #22C55E;
  color: #FFFFFF;
  font-size: 9px;
  font-weight: 700;
  font-family: var(--font-mono);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.card__badge--premium {
  background: var(--color-primary);
}

.card__badge--normal {
  background: var(--color-bg-elevated);
  color: var(--color-text-muted);
}

.card__badge--normal svg {
  opacity: 0.6;
}

.card__time {
  font-size: 10px;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  white-space: nowrap;
}

.card__code {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 15px;
  color: var(--color-text);
  word-break: break-all;
  line-height: 1.4;
  margin-bottom: var(--spacing-xs);
}

.card__used {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  margin-bottom: var(--spacing-md);
}

.card__used svg {
  opacity: 0.5;
}

.card--premium .card__code {
  color: var(--color-primary);
}

.card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card__price {
  font-weight: 700;
  font-size: 14px;
  color: var(--color-primary);
  font-family: var(--font-mono);
}

.card__price-symbol {
  font-size: 11px;
  margin-right: 1px;
  opacity: 0.7;
}

.card--premium .card__price {
  color: #FFB347;
}

.card__copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-bg);
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  transition:
    background var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
  white-space: nowrap;
  min-height: 32px;
  min-width: 60px;
  justify-content: center;
}

.card__copy-btn:hover {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-glow);
}

.card__copy-btn:active {
  transform: scale(0.95);
}

.card__copy-btn--copied {
  background: var(--color-success);
}

.card__copy-btn--copied:hover {
  background: var(--color-success);
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.3);
}
</style>
