<script setup>
defineProps({
  user: {
    type: Object,
    required: true,
  },
  isCurrentUser: {
    type: Boolean,
    default: false,
  },
  format: {
    type: String,
    default: 'full',
    // 'full' | 'image-only'
  },
})
</script>

<template>
  <div class="user" :class="{ 'user--image-only': format !== 'full' }">
    <img class="user__image" :src="user.image.webp" alt="user avatar" />
    <div v-if="format === 'full'" class="user__name">{{ user.username }}</div>
    <div v-if="format === 'full' && isCurrentUser" class="user__tag">you</div>
  </div>
</template>

<style scoped>
.user {
  display: flex;
  align-items: center;
  column-gap: var(--space-200); /* 16px */
  row-gap: var(--space-100); /* 8px */
  flex-wrap: wrap;
}

.user__image {
  aspect-ratio: 1 / 1;
  block-size: var(--space-400); /* 32px */
}

.user__name {
  font-weight: var(--fw-medium);
}

.user__tag {
  background-color: var(--tag-background-color);
  color: var(--color-text-tag);
  border-radius: var(--br-300);
  font-weight: var(--fw-medium);
  font-size: var(--fs-300);
  line-height: var(--lh-300);
  text-transform: lowercase;
  inline-size: 36px;
  block-size: 19px;
  display: grid;
  align-items: center;
  justify-content: center;
}

/* viewport: mobile -> tablet */
@media (min-width: 40rem) {
  .user--image-only .user__image {
    block-size: var(--space-500); /* (m) 32px -> (t) 40px */
  }
}
</style>
