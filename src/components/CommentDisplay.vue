<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

import CommentBase from '@/components/CommentBase.vue'
import CommentList from '@/components/CommentList.vue'
import CommentCreate from '@/components/CommentCreate.vue'
import CommentUser from '@/components/CommentUser.vue'
import CommentScore from '@/components/CommentScore.vue'

import ButtonBase from '@/components/ButtonBase.vue'
import ButtonDelete from '@/components/ButtonDelete.vue'
import ButtonEdit from '@/components/ButtonEdit.vue'
import ButtonReply from '@/components/ButtonReply.vue'

import { trimFirstAtToken } from '@/utils'
import { toRelativeTime } from '@/utils/timestamps'

import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { useInteractiveCommentsStore } from '@/stores/interactiveComments'

const { show } = useConfirmDialog()
const interactiveCommentsStore = useInteractiveCommentsStore()

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})

const vFocus = {
  mounted: (el) => el.focus(),
}

const isCurrentUser = computed(
  () => interactiveCommentsStore.currentUser.username === props.comment.user.username,
)

const isEditing = ref(false)
const isReplying = ref(false)

const editableContent = ref('')

const handleDelete = async () => {
  const confirmed = await show(
    'Delete comment',
    'Are you sure you want to delete this comment? This will remove the comment and can’t be undone.',
    'Yes, delete',
    'No, cancel',
  )

  // User confirmed the deletion, so perform delete action
  if (confirmed) interactiveCommentsStore.deleteComment(props.comment.id)
}

// Event handlers

function handleEdit() {
  isEditing.value = !isEditing.value

  if (isEditing.value)
    editableContent.value =
      (props.comment.replyingTo ? '@' + props.comment.replyingTo + ' ' : '') + props.comment.content
}

function handleReply() {
  isReplying.value = !isReplying.value
}

function handleCommentEditSubmit() {
  interactiveCommentsStore.updateContent(props.comment.id, trimFirstAtToken(editableContent.value))
  isEditing.value = false
}

// Set up the relative timestamp to update on a time interval

const relativeTimeString = ref(toRelativeTime(props.comment.createdAtTimestamp))

let intervalId

function updateRelativeTime() {
  relativeTimeString.value = toRelativeTime(props.comment.createdAtTimestamp)
}

// Start interval only if page is visible
function startInterval() {
  updateRelativeTime() // update immediately
  intervalId = setInterval(updateRelativeTime, 1000)
}

// Clear the interval to stop updates
function stopInterval() {
  clearInterval(intervalId)
}

// Handle visibility changes
function handleVisibilityChange() {
  if (document.visibilityState === 'visible') {
    console.log('visible so starting the interval')
    startInterval()
  } else {
    console.log('not visible so stopping the interval')
    stopInterval()
  }
}

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Initialize based on current visibility
  if (document.visibilityState === 'visible') {
    startInterval()
  }
})

onUnmounted(() => {
  stopInterval()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <CommentBase>
    <div class="comment__inner" :id="'comment-' + comment.id">
      <CommentUser class="comment__user" :user="comment.user" :isCurrentUser="isCurrentUser" />

      <div class="comment__timestamp">{{ relativeTimeString }}</div>

      <CommentScore class="comment__score" :comment="comment" />

      <div class="comment__content">
        <form
          v-if="isEditing"
          class="comment__editing"
          :id="'form-edit-comment-' + comment.id"
          @submit.prevent="handleCommentEditSubmit"
        >
          <label :for="'textarea-edit-comment-' + comment.id" class="sr-only"
            >Update your comment</label
          >
          <textarea
            class="edit__input"
            :name="'textarea-edit-comment-' + comment.id"
            :id="'textarea-edit-comment-' + comment.id"
            v-model="editableContent"
            v-focus
          ></textarea>

          <div class="edit__controls">
            <ButtonBase type="submit">Update</ButtonBase>
          </div>
        </form>

        <p v-else>
          <span v-if="comment.replyingTo" class="comment__replyto">@{{ comment.replyingTo }}</span>
          {{ comment.content }}
        </p>
      </div>

      <div class="comment__controls">
        <ButtonDelete v-if="isCurrentUser" @click="handleDelete" />
        <ButtonEdit v-if="isCurrentUser" @click="handleEdit" />
        <ButtonReply v-if="!isCurrentUser" @click="handleReply" />
      </div>
    </div>

    <template #create__reply v-if="isReplying">
      <CommentCreate
        :isReply="true"
        :replyingToCommentId="comment.id"
        :replyingToUsername="comment.user.username"
        class="comment__edit--reply"
        @processed="isReplying = false"
      />
    </template>

    <template #replies v-if="comment.replies && comment.replies.length > 0">
      <CommentList :comments="comment.replies" :isFirstLevel="false" />
    </template>
  </CommentBase>
</template>

<style scoped>
.comment__inner {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    'user user timestamp'
    'content content content'
    'score controls controls';
  align-items: center;
  justify-items: start;
  row-gap: var(--space-200); /* 16px */
  column-gap: var(--space-300); /* 24px */
}

.comment__user {
  grid-area: user;
}

.comment__timestamp {
  grid-area: timestamp;
  justify-self: start;
  font-weight: var(--fw-regular);
}

.comment__score {
  grid-area: score;
  align-self: start;
}

.comment__content {
  grid-area: content;
  align-self: start;
  inline-size: 100%;
}

.comment__editing {
  display: grid;
  gap: var(--space-200);
  justify-items: end;
}

.edit__input {
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

.comment__controls {
  grid-area: controls;
  justify-self: end;
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  column-gap: var(--space-100); /* 24px - 8px * 2 */
  row-gap: var(--space-50); /* 8px */
  margin-inline-end: calc(-1 * var(--space-100));
}

.comment__replyto {
  color: var(--color-text-accent);
  font-weight: var(--fw-medium);
}

/* viewport: mobile -> tablet */
@media (min-width: 40rem) {
  .comment__inner {
    grid-template-columns: auto auto auto 1fr;
    grid-template-areas:
      'score user timestamp controls'
      'score content content content';
  }
}
</style>
