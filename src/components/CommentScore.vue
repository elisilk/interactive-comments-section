<script setup>
import { useInteractiveCommentsStore } from '@/stores/interactiveComments'
const interactiveCommentsStore = useInteractiveCommentsStore()

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})

function handleVoteClick(direction) {
  interactiveCommentsStore.updateScore(props.comment.id, direction)
}
</script>

<template>
  <div class="score">
    <button class="score__button" type="button" @click="handleVoteClick('positive')">
      <span class="sr-only">Vote positive</span>
      <svg viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
          fill="currentColor"
        />
      </svg>
    </button>
    <div class="score__current">{{ comment.score }}</div>
    <button class="score__button" type="button" @click="handleVoteClick('negative')">
      <span class="sr-only">Vote negative</span>
      <svg viewBox="0 0 11 3" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
          fill="currentColor"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.score {
  background-color: var(--score-background-color);
  border-radius: var(--br-500);
  block-size: var(--space-500); /* (m) 40px -> (t) 100px */
  inline-size: var(--space-1250); /* (m) 100px -> (t) 40px */
  display: flex;
  gap: var(--score-controls-gap); /* 16px */
  place-items: center;
  place-content: center;
}

.score__current {
  color: var(--color-text-score);
  font-weight: var(--fw-medium);
}

.score__button {
  color: var(--btn-clr-primary-bkg-active);
  padding: var(--space-125);
}

.score__button:hover,
.score__button:focus-visible {
  color: var(--btn-clr-primary-bkg);
}

.score__button:focus-visible {
  outline: 2px dashed var(--btn-clr-primary-bkg);
}

.score__button svg {
  inline-size: var(--space-125); /* 10px */
}

/* viewport: mobile -> tablet */
@media (min-width: 40rem) {
  .score {
    display: grid;
    block-size: var(--space-1250); /* (m) 40px -> (t) 100px */
    inline-size: var(--space-500); /* (m) 100px -> (t) 40px */
  }
}
</style>
