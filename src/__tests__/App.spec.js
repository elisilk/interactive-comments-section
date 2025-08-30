import { ref } from 'vue'
import { describe, test, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest'

import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import App from '@/App.vue'
// import ConfirmDialog from '@/components/ConfirmDialog.vue'
// import { useInteractiveCommentsStore } from '@/stores/interactiveComments'

import * as useConfirmDialogModule from '@/composables/useConfirmDialog'

// test use cases:
// - the app mounts and renders with comments displayed
// - a new comment is successfully created and displayed
// - existing comments are successfully upvoted or downvoted
// - a new reply to a comment is successfully created and displayed
// - an existing comment is successfully deleted
// - an existing comment is successfully updated/edited
// - comments are reordered when the relative scoring changes

describe('App', () => {
  let wrapper = null
  // let store = null

  beforeAll(() => {
    HTMLDialogElement.prototype.show = vi.fn()
    HTMLDialogElement.prototype.showModal = vi.fn()
    HTMLDialogElement.prototype.close = vi.fn()
  })

  // SETUP - run prior to each unit test
  beforeEach(() => {
    // render the component
    wrapper = mount(App, {
      global: {
        // teleport: true,
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
      },
    })

    // Mock the useConfirmDialog composable
    vi.spyOn(useConfirmDialogModule, 'useConfirmDialog').mockReturnValue({
      dialogState: ref({
        isVisible: true,
      }),
      show: vi.fn(() => Promise.resolve(true)),
      // return true to mock that the user confirmed that the comment should indeed be deleted
    })

    // create the data store using the testing pinia
    // store = useInteractiveCommentsStore()
  })

  // TEARDOWN - run after each unit test
  afterEach(() => {
    wrapper.unmount()
  })

  test('#1 - mounts renders properly', () => {
    expect(wrapper.text()).toContain('Interactive comments section')
  })

  test('#2 - new comment creation/deletion', async () => {
    // find the key form + input elements
    const newCommentForm = wrapper.get('#form-new-comment')
    // console.log(newCommentForm.html())

    const newCommentTextareaInput = wrapper.get('#textarea-new-comment')
    const commentCreateComponent = wrapper.getComponent({ name: 'CommentCreate' })

    expect(newCommentTextareaInput.element.value).toBe('')

    // find the key output elements
    // check the value of the output elements (before new comment)
    expect(wrapper.findAll('.comment').length).toEqual(4)

    // set the value of the input elements
    const newCommentText = 'This is a new comment at the top level.'
    await newCommentTextareaInput.setValue(newCommentText)
    expect(newCommentTextareaInput.element.value).toBe(newCommentText)

    // Simulate submitting the form
    await newCommentForm.trigger('submit')

    // check the value of the output elements
    // should now have 5 comments (1 more than before)
    expect(commentCreateComponent.emitted('processed')).toBeTruthy()
    expect(wrapper.findAll('.comment').length).toEqual(5)

    // find the newest comment and trigger its deletion
    const newComment = wrapper.findAll('.comment')[4]
    const newCommentDeleteButton = newComment
      .findAll('button')
      .filter((node) => node.text() === 'Delete')
      .at(0)
    await newCommentDeleteButton.trigger('click')

    expect(useConfirmDialogModule.useConfirmDialog().show).toHaveBeenCalled() // Assert show was called

    // expect only 4 comments to remain after a successful deletion
    expect(wrapper.findAll('.comment').length).toEqual(4)
  })

  test('#3 - comments are upvoted/downvoted', async () => {
    expect(wrapper.findAll('.comment').length).toEqual(4)

    const comment2 = wrapper.findAll('.comment')[1]
    const comment2Score = comment2.find('.comment__score')

    const [comment2UpvoteButton, comment2DownvoteButton] = comment2Score.findAll('button')
    const comment2ScoreCurrent = comment2Score.find('.score__current')

    expect(comment2ScoreCurrent.text()).toEqual('5')

    // console.log(comment2UpvoteButton.text())
    // console.log(comment2DownvoteButton.text())
    console.log(comment2ScoreCurrent.text())

    await comment2UpvoteButton.trigger('click')
    expect(comment2ScoreCurrent.text()).toEqual('6')

    await comment2DownvoteButton.trigger('click')
    await comment2DownvoteButton.trigger('click')
    expect(comment2ScoreCurrent.text()).toEqual('4')
  })
})
