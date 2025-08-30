<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
  format: {
    type: String,
    default: 'text-only',
    // 'text-only' | 'icon-only' | 'icon-text' | 'text-icon'
  },
  inverted: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button
    class="button"
    :class="{ 'button--inverted': inverted, 'button--icon-first': format === 'icon-text' }"
    :type="type"
  >
    <span class="button__text" :class="{ 'sr-only': format === 'icon-only' }">
      <slot></slot>
    </span>
    <span v-if="format !== 'text-only'" class="button__icon">
      <slot name="icon"></slot>
    </span>
  </button>
</template>

<style scoped>
.button {
  --_btn-clr-txt: var(--btn-clr-txt, var(--btn-clr-primary-txt));
  --_btn-clr-bkg: var(--btn-clr-bkg, var(--btn-clr-primary-bkg));
  --_btn-clr-txt-active: var(--btn-clr-txt-active, var(--btn-clr-primary-txt-active));
  --_btn-clr-bkg-active: var(--btn-clr-bkg-active, var(--btn-clr-primary-bkg-active));

  color: var(--_btn-clr-txt);
  background-color: var(--_btn-clr-bkg);

  border-radius: var(--br-400);

  block-size: var(--button-base-block-size); /* 48px */
  inline-size: var(--button-base-inline-size); /* 104px */

  font-weight: var(--fw-medium);
  text-transform: uppercase;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-100);
}

.button:hover,
.button:focus-visible {
  color: var(--_btn-clr-txt-active);
  background-color: var(--_btn-clr-bkg-active);
}

.button:focus-visible {
  outline: 2px dashed var(--_btn-clr-bkg-active);
  outline-offset: 2px;
}

.button--secondary {
  --btn-clr-bkg: var(--btn-clr-secondary-bkg);
  --btn-clr-bkg-active: var(--btn-clr-secondary-bkg-active);
}

.button--warning {
  --btn-clr-bkg: var(--btn-clr-warning-bkg);
  --btn-clr-bkg-active: var(--btn-clr-warning-bkg-active);
}

/* full - fill the available inline space */

.button--full {
  inline-size: 100%;
}

/* inverted - switch text and background colors */

.button--inverted {
  color: var(--_btn-clr-bkg);
  background-color: transparent;
  text-transform: none;

  block-size: var(--space-300);
  inline-size: auto;
  padding-inline: var(--space-100);
}

.button--inverted:hover,
.button--inverted:focus-visible {
  color: var(--_btn-clr-bkg-active);
  background-color: transparent;
}

/* icon */

.button__icon {
  inline-size: var(--space-175); /* 14px */
}

.button--icon-first {
  flex-direction: row-reverse;
}
</style>
