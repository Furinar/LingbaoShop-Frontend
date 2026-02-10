<script setup lang="ts">
import { ref, computed } from 'vue'
import { useShareCodeStore } from '@/stores/sharecode'
import VanishingInput from '@/components/ui/VanishingInput.vue'

const emit = defineEmits<{
  close: []
}>()

const store = useShareCodeStore()

const rawText = ref('')
const parsedCode = ref('')
const parsedPrice = ref<number | null>(null)
const submitting = ref(false)
const submitResult = ref<{ success: boolean; msg: string } | null>(null)
const pasteError = ref('')

const forbiddenPrices = [999, 998, 991]
const isPriceForbidden = computed(() => parsedPrice.value !== null && forbiddenPrices.includes(parsedPrice.value))
const isPriceOutOfRange = computed(() => parsedPrice.value !== null && (parsedPrice.value < 100 || parsedPrice.value > 999))

const isValid = computed(() => {
  return parsedCode.value.trim().length > 0 && parsedPrice.value !== null && parsedPrice.value > 0 && !isPriceForbidden.value && !isPriceOutOfRange.value
})

const placeholders = [
  '  粘贴分享信息到这里...',
  '  例如：王者荣耀【星空之诺M2XLLN】...',
  '  自动提取分享码和价格',
  '  支持一键粘贴按钮',
]

function parseShareInfo(text: string) {
  const codeMatch = text.match(/【(.+?)】/)
  const priceMatch = text.match(/(\d+)\s*块/)
  return {
    code: codeMatch?.[1] ?? '',
    price: priceMatch?.[1] ? parseInt(priceMatch[1], 10) : 0,
  }
}

function handleInputSubmit(text: string) {
  rawText.value = text
  applyParsedResult(text)
}

function handleInputChange(e: { target: { value: string } }) {
  rawText.value = e.target.value
}

function applyParsedResult(text: string) {
  const result = parseShareInfo(text)
  if (result.code) {
    parsedCode.value = result.code
    parsedPrice.value = result.price || null
    pasteError.value = ''
  } else {
    pasteError.value = '未能识别分享码，请检查格式是否包含【分享码】'
  }
}

async function handlePaste() {
  pasteError.value = ''
  try {
    const text = await navigator.clipboard.readText()
    if (!text.trim()) {
      pasteError.value = '剪贴板内容为空'
      return
    }
    rawText.value = text
    applyParsedResult(text)
  } catch {
    pasteError.value = '无法访问剪贴板，请手动粘贴'
  }
}

async function handleSubmit() {
  if (!isValid.value || submitting.value) return

  submitting.value = true
  submitResult.value = null

  const result = await store.addShareCode(parsedCode.value.trim(), parsedPrice.value!)

  submitResult.value = result
  submitting.value = false

  if (result.success) {
    setTimeout(() => {
      emit('close')
    }, 1500)
  }
}

function handleClose() {
  emit('close')
}

function handleOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-panel">
        <div class="modal-header">
          <h2 class="modal-title">新增分享码</h2>
          <button class="modal-close" @click="handleClose" aria-label="关闭">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div class="modal-section">
          <label class="modal-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            </svg>
            粘贴分享信息
          </label>
          <p class="modal-hint">将游戏内复制的分享信息粘贴到输入框，或点击粘贴按钮自动读取</p>

          <div class="paste-row">
            <div class="paste-input-wrap">
              <VanishingInput v-model="rawText" :placeholders="placeholders" @submit="handleInputSubmit"
                @change="handleInputChange" />
            </div>
            <button class="paste-btn" @click="handlePaste" title="从剪贴板粘贴">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              </svg>
              粘贴
            </button>
          </div>

          <p v-if="pasteError" class="modal-error">{{ pasteError }}</p>
        </div>

        <div class="modal-section">
          <label class="modal-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            解析结果
          </label>

          <div class="result-fields">
            <div class="field-group">
              <label class="field-label">分享码</label>
              <input v-model="parsedCode" type="text" class="field-input" placeholder="自动识别或手动输入" />
            </div>

            <div class="field-group">
              <label class="field-label">价格 (元)</label>
              <input v-model.number="parsedPrice" type="number" class="field-input" placeholder="自动识别或手动输入" min="1" />
              <p v-if="isPriceOutOfRange" class="modal-error">价格必须在 100 ~ 999 之间</p>
              <p v-else-if="isPriceForbidden" class="modal-error">不允许提交价格为 {{ parsedPrice }} 的分享码</p>
            </div>
          </div>
        </div>

        <div v-if="submitResult" class="modal-result"
          :class="submitResult.success ? 'modal-result--success' : 'modal-result--error'">
          <svg v-if="submitResult.success" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {{ submitResult.msg }}
        </div>

        <button class="submit-btn" :class="{ 'submit-btn--disabled': !isValid || submitting }"
          :disabled="!isValid || submitting" @click="handleSubmit">
          <span v-if="submitting" class="submit-spinner" />
          <span v-else>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </span>
          {{ submitting ? '提交中...' : '提交分享码' }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: var(--spacing-lg);
  animation: overlay-in 200ms ease;
}

@keyframes overlay-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.modal-panel {
  width: 100%;
  max-width: 440px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: panel-in 250ms ease;
  max-height: 90vh;
  overflow-y: auto;
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.3px;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  transition:
    color var(--transition-fast),
    background var(--transition-fast);
}

.modal-close:hover {
  color: var(--color-text);
  background: var(--color-bg-elevated);
}

.modal-section {
  margin-bottom: var(--spacing-xl);
}

.modal-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.modal-hint {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
  line-height: 1.5;
}

.modal-error {
  font-size: 12px;
  color: var(--color-hot);
  margin-top: var(--spacing-sm);
}

.paste-row {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.paste-input-wrap {
  flex: 1;
  min-width: 0;
}

.paste-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-primary-dim);
  border-radius: var(--radius-full);
  white-space: nowrap;
  transition:
    background var(--transition-fast),
    box-shadow var(--transition-fast);
  flex-shrink: 0;
  height: 48px;
}

.paste-btn:hover {
  background: rgba(255, 122, 0, 0.25);
  box-shadow: var(--shadow-glow);
}

.paste-btn:active {
  transform: scale(0.96);
}

.result-fields {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.field-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: var(--font-mono);
}

.field-input {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--color-text);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.field-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-dim);
}

.field-input::placeholder {
  color: var(--color-text-muted);
  font-weight: 400;
}

.field-input[type="number"]::-webkit-inner-spin-button,
.field-input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.field-input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

.modal-result {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: var(--spacing-lg);
}

.modal-result--success {
  background: rgba(34, 197, 94, 0.1);
  color: var(--color-success);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.modal-result--error {
  background: rgba(255, 77, 77, 0.1);
  color: var(--color-hot);
  border: 1px solid rgba(255, 77, 77, 0.2);
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: 14px;
  font-size: 15px;
  font-weight: 700;
  color: var(--color-bg);
  background: var(--color-primary);
  border-radius: var(--radius-md);
  transition:
    background var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
  min-height: 48px;
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-glow);
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.submit-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    align-items: flex-end;
    padding: 0;
  }

  .modal-panel {
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    max-height: 85vh;
    animation: panel-slide-up 300ms ease;
  }

  @keyframes panel-slide-up {
    from {
      opacity: 0;
      transform: translateY(100%);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
