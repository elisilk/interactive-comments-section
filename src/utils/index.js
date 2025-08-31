export const deepCopy = (originalObject) => JSON.parse(JSON.stringify(originalObject))

export const trimFirstAtToken = (string) => {
  // match @username plus any following spaces at start
  const regex = /^@[\w\d]+\s*/
  const atTokenMatch = string.match(regex)

  // none found, so just return the string as is
  if (!atTokenMatch) return string

  // one found, so remove entire matched portion (username + spaces)
  return string.substring(atTokenMatch[0].length)
}
