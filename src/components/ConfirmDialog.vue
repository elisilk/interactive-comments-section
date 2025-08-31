<script setup>
import { ref, watch } from 'vue'
import ButtonBase from '@/components/ButtonBase.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const { dialogState, confirm, cancel } = useConfirmDialog()
const dialogElement = ref(null)

const focusableSelectors =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
let lastFocusedElement

watch(
  () => dialogState.value.isVisible,
  (isVisible) => {
    if (isVisible) {
      lastFocusedElement = document.activeElement // Save focus to restore later
      dialogElement.value.showModal()
      dialogElement.value.addEventListener('keydown', trapFocus)
    } else {
      dialogElement.value.close()
      dialogElement.value.removeEventListener('keydown', trapFocus)
      if (lastFocusedElement) lastFocusedElement.focus()
    }
  },
)

function trapFocus(e) {
  if (!dialogElement.value) return
  if (e.key !== 'Tab') return

  const focusableElements = Array.from(dialogElement.value.querySelectorAll(focusableSelectors))
  const first = focusableElements[0]
  const last = focusableElements[focusableElements.length - 1]

  if (e.shiftKey) {
    // Shift + Tab
    if (document.activeElement === first) {
      e.preventDefault()
      last.focus()
    }
  } else {
    // Tab
    if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

function handleConfirm() {
  confirm()
}

function handleCancel() {
  cancel()
}

// Special case for when the dialog is closed via the Escape key
function handleClose() {
  if (dialogState.value.isVisible) cancel()
}

function handleClick(event) {
  // clicked outside the modal, so close it with a "cancelled" status
  if (event.target.nodeName === event.currentTarget.nodeName) cancel()
}
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialogElement"
      class="comment__dialog"
      aria-modal="true"
      role="alertdialog"
      aria-labelledby="dialog-heading"
      aria-describedby="dialog-message"
      @click="handleClick"
      @close="handleClose"
    >
      <form class="dialog__inner" method="dialog">
        <h2 class="dialog__heading" id="dialog-heading">{{ dialogState.heading }}</h2>
        <p class="dialog__message" id="dialog-message">{{ dialogState.message }}</p>

        <menu class="dialog__controls">
          <li>
            <ButtonBase
              type="submit"
              value="cancel"
              class="button--full button--secondary"
              @click="handleCancel"
              autofocus
              >{{ dialogState.cancelLabel }}</ButtonBase
            >
          </li>
          <li>
            <ButtonBase
              type="submit"
              value="confirm"
              class="button--full button--warning"
              @click="handleConfirm"
              >{{ dialogState.confirmLabel }}</ButtonBase
            >
          </li>
        </menu>
      </form>
    </dialog>
  </Teleport>
</template>

<style scoped>
.comment__dialog {
  border: 0;
  padding: 0;
  inline-size: min(var(--dialog-inline-size-max), 100% - 2 * var(--dialog-inline-size-gutter));
  border-radius: var(--br-400);
}

.comment__dialog::backdrop {
  background-color: var(--dialog-backdrop-color);
}

.dialog__inner {
  padding: var(--space-350) var(--space-375);
  display: grid;
  gap: var(--space-300);
}

.dialog__controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-200);
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
