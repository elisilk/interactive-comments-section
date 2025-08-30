<script setup></script>

<template>
  <div class="comment__box">
    <slot></slot>
  </div>
</template>

<style scoped>
.comment__box {
  background-color: var(--color-background-comment);
  padding: var(--comment-box-padding);
  border-radius: var(--br-400);
}
</style>
