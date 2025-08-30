export const highestId = (arr, idKey = 'id', nestingKey = 'children') =>
  arr.reduce(
    (acc, curr) =>
      Math.max(acc, curr[idKey], curr[nestingKey] ? highestId(curr[nestingKey]) : -Infinity),
    -Infinity,
  )

export const findItemNested = (arr, itemId, nestingKey) =>
  arr.reduce(
    (foundItem, currentItem, currentIndex, currentArray) => {
      // Match already found, so returning that up the chain
      if (foundItem.index !== -1) return foundItem

      // Match is found for first time, so return it
      if (currentItem.id === itemId)
        return { item: currentItem, index: currentIndex, array: currentArray }

      // Search through the nested children recursively
      if (currentItem[nestingKey])
        return findItemNested(currentItem[nestingKey], itemId, nestingKey)

      // No matches found and no nested children to search through, so return the default accumulator value
      return foundItem
    },
    { item: null, index: -1, array: null },
  )

export const nestedForEach = (node, nestingKey, callback) => {
  // Apply the callback to the current node
  callback(node)

  // If the node has children (e.g., an array of children)
  if (node[nestingKey] && Array.isArray(node[nestingKey])) {
    // Recursively call nestedForEach for each child
    node[nestingKey].forEach((child) => {
      nestedForEach(child, nestingKey, callback)
    })
  }
}
