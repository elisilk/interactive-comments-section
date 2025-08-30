<script setup>
import { computed } from 'vue'

import CommentDisplay from '@/components/CommentDisplay.vue'

const props = defineProps({
  comments: {
    type: Array,
    required: true,
  },
  isFirstLevel: {
    type: Boolean,
    default: true,
  },
})

// Sort the comments (or replies)
// - first level comments sorted by score (higher scores at top)
// - deeper level comments (replies) sorted by timestamp (more recent comments at bottom)
const commentsSorted = computed(() =>
  props.isFirstLevel
    ? [...props.comments].sort((a, b) => b.score - a.score)
    : [...props.comments].sort((a, b) => a.createdAtTimestamp - b.createdAtTimestamp),
)
</script>

<template>
  <TransitionGroup tag="div" name="list" class="comment__list" v-if="comments.length > 0">
    <CommentDisplay
      v-for="comment in commentsSorted"
      :comment="comment"
      :key="'comment-' + comment.id"
    />
  </TransitionGroup>
</template>

<style scoped>
.comment__list {
  position: relative;
  display: grid;
  gap: var(--comment-block-size-gap); /* (m) 16px -> (t) 24px */
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* ensure leaving items are taken out of layout flow so that moving animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
