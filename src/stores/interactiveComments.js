import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { deepCopy } from '@/utils'
import { highestId, findItemNested } from '@/utils/nestedArrays'

export const useInteractiveCommentsStore = defineStore('interactiveComments', () => {
  // state properties
  const currentUser = ref(null)
  const comments = ref([])

  // getters
  const findComment = computed(
    () => (commentId) => findItemNested(comments.value, commentId, 'replies'),
  )

  const nextId = computed(() =>
    comments.value.length > 0 ? 1 + highestId(comments.value, 'id', 'replies') : 1,
  )

  // actions (CRUD)

  // CREATE
  function createComment(content) {
    comments.value.push({
      id: this.nextId,
      content,
      createdAtTimestamp: Date.now(),
      score: 0,
      user: deepCopy(currentUser.value),
      replies: [],
    })
  }

  function createReply(content, replyingToCommentId) {
    const { item: foundReplyToComment } = this.findComment(replyingToCommentId)

    // if existing comment to reply to not found, then error
    if (!foundReplyToComment) {
      console.error('Comment to reply to not found:', replyingToCommentId)
      return
    }

    // if existing comment to reply to does not have a replies property, then add one with an empty array
    if (!foundReplyToComment.replies) foundReplyToComment.replies = []

    // add the new comment to the replies of the existing comment
    foundReplyToComment.replies.push({
      id: this.nextId,
      content,
      createdAtTimestamp: Date.now(),
      score: 0,
      replyingTo: foundReplyToComment.user.username,
      user: deepCopy(currentUser.value),
      replies: [],
    })
  }

  // UPDATE
  function updateContent(commentId, newContent) {
    // Find the comment
    const { item: foundComment } = this.findComment(commentId)
    foundComment.content = newContent
  }

  function updateScore(commentId, direction) {
    // console.log('Store updating comment score:', commentId, direction)

    // Find the comment
    const { item: foundComment } = this.findComment(commentId)

    if (direction === 'positive') foundComment.score++
    else if (direction === 'negative' && foundComment.score > 0) foundComment.score--
  }

  // DELETE
  // function delete(id)
  function deleteComment(commentId) {
    // console.log('Store deleting comment:', commentId)

    // Find the comment
    const { index: foundCommentIndex, array: foundCommentArray } = this.findComment(commentId)

    // Comment not found, so do nothing
    if (foundCommentIndex === -1) return

    // Comment found, so splice it from the array
    foundCommentArray.splice(foundCommentIndex, 1)
  }

  return {
    currentUser,
    comments,
    findComment,
    nextId,
    createComment,
    createReply,
    updateContent,
    updateScore,
    deleteComment,
  }
})
