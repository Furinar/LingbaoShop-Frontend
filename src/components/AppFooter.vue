<script setup lang="ts">
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <img
          src="/Lingbao-Shop.svg"
          alt="灵宝集市"
          class="footer__logo"
        />
        <span class="footer__name">灵宝集市</span>
      </div>

      <p class="footer__copyright">
        Copyright &copy; 2026 灵宝集市分享码
      </p>

      <p class="footer__disclaimer">
        本站仅供学习交流使用，请勿用于商业用途
      </p>

      <p class="footer__contact">
        <a href="mailto:2102733232@qq.com" class="footer__link">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          2102733232@qq.com
        </a>
      </p>

      <div class="footer__credits">
        <span class="footer__credits-label">Made by</span>
        <div class="footer__credits-names">
          <span>Frontend <strong>Furina</strong></span>
          <span class="footer__credits-divider">|</span>
          <span>Backend <strong>QiChenSn</strong></span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-xl) var(--spacing-lg) var(--spacing-2xl);
}

.footer__inner {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  text-align: center;
}

@media (min-width: 1024px) {
  .footer__inner {
    max-width: 480px;
  }
}

.footer__brand {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: var(--spacing-xs);
}

.footer__logo {
  height: 18px;
  width: auto;
  opacity: 0.6;
}

.footer__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.footer__copyright {
  font-size: 11px;
  color: var(--color-text-muted);
}

.footer__disclaimer {
  font-size: 10px;
  color: var(--color-text-muted);
  opacity: 0.7;
}

.footer__contact {
  margin-top: var(--spacing-xs);
}

.footer__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.footer__link:hover {
  color: var(--color-primary);
}

.footer__credits {
  margin-top: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.footer__credits-label {
  font-size: 10px;
  color: var(--color-text-muted);
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer__credits-names {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--color-text-muted);
}

.footer__credits-names strong {
  color: var(--color-text-secondary);
  font-weight: 600;
}

.footer__credits-divider {
  opacity: 0.3;
}
</style>
