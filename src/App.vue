<script setup>
import { computed, onMounted } from 'vue'

import CommentList from '@/components/CommentList.vue'
import CommentCreate from '@/components/CommentCreate.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

import {
  getDataFromLocalStorage,
  setDataInLocalStorage,
  storageAvailable,
} from '@/utils/localStorage'
import { toAbsoluteTimestamp } from '@/utils/timestamps'
import { nestedForEach } from '@/utils/nestedArrays'

import existingDataFromFile from '@/assets/data.json'
import { useInteractiveCommentsStore } from '@/stores/interactiveComments'

const interactiveCommentsStore = useInteractiveCommentsStore()

// initialize data (from local storage or a data file)

const localStorageKey = 'interactiveComments'

function loadExistingData(localStorageKey) {
  // get existing data from local storage (if they exist)
  const existingDataFromLocalStorage = getDataFromLocalStorage(localStorageKey)

  if (existingDataFromLocalStorage) {
    // if local storage data exist, then save them to the store
    interactiveCommentsStore.currentUser = existingDataFromLocalStorage.currentUser
    interactiveCommentsStore.comments = existingDataFromLocalStorage.comments
  } else if (existingDataFromFile) {
    // else, save data from the local data file to the store
    interactiveCommentsStore.currentUser = existingDataFromFile.currentUser
    // Convert relative timestamp to an absolute one
    existingDataFromFile.comments.forEach((comment) =>
      nestedForEach(comment, 'replies', (comment) => {
        comment.createdAtTimestamp = toAbsoluteTimestamp(comment.createdAt)
        delete comment.createdAt
      }),
    )
    interactiveCommentsStore.comments = existingDataFromFile.comments
  } else {
    // if neither exist, then do nothing (use store's default)
    return
  }
}

const isLocalStorageAvailable = computed(() => storageAvailable('localStorage'))

onMounted(() => {
  if (isLocalStorageAvailable.value) loadExistingData(localStorageKey)
})

// Subscribe to state changes and save to local storage
interactiveCommentsStore.$subscribe((mutation, state) => {
  // persist the whole state to the local storage whenever it changes
  if (isLocalStorageAvailable.value) setDataInLocalStorage(localStorageKey, state)
})
</script>

<template>
  <main class="app__main">
    <h1 class="sr-only">Interactive comments section</h1>
    <CommentList :comments="interactiveCommentsStore.comments" />
    <CommentCreate class="comment__edit--top-level" />
    <ConfirmDialog />
  </main>
</template>

<style scoped>
.app__main {
  inline-size: min(100% - 2 * var(--main-inline-size-gutter), var(--main-inline-size-max));

  margin-inline: auto;
  padding-block: var(--main-block-size-margin);
}
</style>
