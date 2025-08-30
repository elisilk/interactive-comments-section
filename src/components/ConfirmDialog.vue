<script setup>
import { ref, watch } from 'vue'
import ButtonBase from '@/components/ButtonBase.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const { dialogState, confirm, cancel } = useConfirmDialog()
const dialogElement = ref(null)

watch(
  () => dialogState.value.isVisible,
  (isVisible) => {
    if (isVisible) {
      dialogElement.value.showModal()
    } else {
      dialogElement.value.close()
    }
  },
)

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
    <dialog ref="dialogElement" class="comment__dialog" @click="handleClick" @close="handleClose">
      <div class="dialog__inner">
        <h2 class="dialog__heading">{{ dialogState.heading }}</h2>
        <p class="dialog__message">{{ dialogState.message }}</p>

        <div class="dialog__controls">
          <ButtonBase class="button--full button--secondary" @click="handleCancel">{{
            dialogState.cancelLabel
          }}</ButtonBase>
          <ButtonBase class="button--full button--warning" @click="handleConfirm">{{
            dialogState.confirmLabel
          }}</ButtonBase>
        </div>
      </div>
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
  display: flex;
  gap: var(--space-200);
}
</style>
