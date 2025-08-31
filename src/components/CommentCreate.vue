<script setup>
import { ref } from 'vue'

import BoxBase from '@/components/BoxBase.vue'
import ButtonBase from '@/components/ButtonBase.vue'
import CommentUser from '@/components/CommentUser.vue'

import { trimFirstAtToken } from '@/utils'

import { useInteractiveCommentsStore } from '@/stores/interactiveComments'

const props = defineProps({
  isReply: {
    type: Boolean,
    default: false,
  },
  replyingToCommentId: {
    type: Number,
  },
  replyingToUsername: {
    type: String,
  },
})

const interactiveCommentsStore = useInteractiveCommentsStore()

const commentText = ref(props.replyingToUsername ? '@' + props.replyingToUsername + ' ' : '')

const emit = defineEmits(['processed'])

const vFocus = {
  mounted: (el, binding) => {
    if (binding.arg) el.focus()
  },
}

function handleCommentSubmit() {
  if (commentText.value) {
    if (props.isReply)
      interactiveCommentsStore.createReply(
        trimFirstAtToken(commentText.value),
        props.replyingToCommentId,
      )
    else {
      interactiveCommentsStore.createComment(trimFirstAtToken(commentText.value))
    }
  }

  // reset the text area
  commentText.value = ''

  // signal to the parent component that the new comment was processed by emitting the custom 'processed' event
  emit('processed')
}
</script>

<template>
  <BoxBase v-if="interactiveCommentsStore.currentUser" class="comment__create">
    <form class="edit__inner" id="form-new-comment" @submit.prevent="handleCommentSubmit">
      <CommentUser
        :user="interactiveCommentsStore.currentUser"
        class="edit__user"
        format="image-only"
      />

      <label for="textarea-new-comment" class="sr-only">Add a comment</label>
      <textarea
        class="edit__input"
        name="textarea-new-comment"
        id="textarea-new-comment"
        placeholder="Add a comment…"
        v-model="commentText"
        v-focus:[isReply]
      ></textarea>

      <div class="edit__controls">
        <ButtonBase type="submit">{{ isReply ? 'Reply' : 'Send' }}</ButtonBase>
      </div>
    </form>
  </BoxBase>
</template>

<style scoped>
.comment__create {
  margin-block-start: var(--comment-block-size-gap);
}

.edit__inner {
  display: grid;
  grid-template-areas:
    'input input'
    'user controls';
  grid-template-columns: auto 1fr;
  gap: var(--space-200); /* 16px */
  align-items: center;
}

.edit__user {
  grid-area: user;
}

.edit__input {
  grid-area: input;

  color: var(--color-text-input);
  line-height: inherit;
  display: block;
  inline-size: 100%;
  padding: var(--space-100) var(--space-200); /*  8px 16px */
  min-block-size: var(--space-1200); /* 96px */
  outline: 0;
  border-radius: var(--br-400);
  border: 1px solid var(--input-border-color);
}

.edit__input:hover,
.edit__input:focus-visible {
  border: 1px solid var(--input-border-color-active);
}

.edit__controls {
  grid-area: controls;
  justify-self: end;
}

/* viewport: mobile -> tablet */
@media (min-width: 40rem) {
  .edit__inner {
    grid-template-areas: 'user input controls';
    grid-template-columns: auto 1fr auto;
    align-items: start;
  }
}
</style>
