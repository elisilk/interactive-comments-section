import { describe, test, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useInteractiveCommentsStore } from '@/stores/interactiveComments'

import sampleData from '@/assets/data.json'
import { toAbsoluteTimestamp } from '@/utils/timestamps'
import { nestedForEach } from '@/utils/nestedArrays'

// test use cases:
// - start the store, initialize with sample data
// - test the getters by finding a comment and the nextId
// - test the actions
//   - create a new comment
//   - create a new reply
//   - update a comment or reply
//   - update the score for a comment or reply (positve and negative)
//   - delete a comment or reply

describe('Interactive Comments Store', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  test('data saved and accessible in store', () => {
    const interactiveCommentsStore = useInteractiveCommentsStore()

    // Read in sample data
    // Save the sample current user
    interactiveCommentsStore.currentUser = sampleData.currentUser
    // Convert relative timestamp to an absolute one
    sampleData.comments.forEach((comment) =>
      nestedForEach(comment, 'replies', (comment) => {
        comment.createdAtTimestamp = toAbsoluteTimestamp(comment.createdAt)
        delete comment.createdAt
      }),
    )
    // Save the sample comments
    interactiveCommentsStore.comments = sampleData.comments

    expect(interactiveCommentsStore.currentUser.username).toBe('juliusomo')
    expect(interactiveCommentsStore.nextId).toBe(5)

    const {
      item: foundComment,
      // index: foundIndex,
      // array: foundArray,
    } = interactiveCommentsStore.findComment(2)
    // console.log(foundComment)
    expect(foundComment.id).toBe(2)
    expect(foundComment.score).toBe(5)
    expect(foundComment.replies.length).toBe(2)
  })
})
