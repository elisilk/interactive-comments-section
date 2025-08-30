// useConfirmDialog.js
import { ref } from 'vue'

const dialogState = ref({
  isVisible: false,
  heading: 'Confirm',
  message: 'Are you sure?',
  confirmLabel: "Yes, I'm sure",
  cancelLabel: 'Cancel',
  resolve: () => {},
})

export function useConfirmDialog() {
  const show = (heading, message, confirmLabel, cancelLabel) => {
    return new Promise((resolve) => {
      dialogState.value.heading = heading
      dialogState.value.message = message
      dialogState.value.confirmLabel = confirmLabel
      dialogState.value.cancelLabel = cancelLabel
      dialogState.value.isVisible = true
      dialogState.value.resolve = resolve
    })
  }

  const confirm = () => {
    dialogState.value.isVisible = false
    dialogState.value.resolve(true)
  }

  const cancel = () => {
    dialogState.value.isVisible = false
    dialogState.value.resolve(false)
  }

  return {
    dialogState,
    show,
    confirm,
    cancel,
  }
}
