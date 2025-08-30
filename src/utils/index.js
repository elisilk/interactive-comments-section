export const deepCopy = (originalObject) => JSON.parse(JSON.stringify(originalObject))

export const trimFirstAtToken = (string) => {
  // check if string begins with an @ username
  const regex = /^@[\w\d]+/g
  const atTokenMatch = string.match(regex)

  // none found, so just return the string as is
  if (!atTokenMatch) return string

  // one found, so separate it out
  return string.substring(atTokenMatch[0].length + 1)
}
