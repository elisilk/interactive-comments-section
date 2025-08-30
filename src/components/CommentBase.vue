<script setup>
import BoxBase from '@/components/BoxBase.vue'
</script>

<template>
  <div class="comment-plus-replies">
    <BoxBase class="comment">
      <slot></slot>
    </BoxBase>

    <div v-if="$slots.create__reply" class="create__reply">
      <slot name="create__reply"></slot>
    </div>

    <div v-if="$slots.replies" class="replies">
      <slot name="replies"></slot>
    </div>
  </div>
</template>

<style scoped>
.replies {
  margin-block-start: var(--comment-block-size-gap); /* (m) 16px -> (t) 24px */
  margin-inline-start: var(--replies-margin-inline);
  padding-inline-start: var(--replies-padding-inline);
  display: grid;
  gap: var(--space-200);
  border-inline-start: var(--replies-border-width) solid var(--replies-border-color);
}
</style>
