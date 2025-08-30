export function getDataFromLocalStorage(localStorageKey) {
  if (!storageAvailable('localStorage')) {
    console.error('Local storage not available')
    return null
  }
  return JSON.parse(localStorage.getItem(localStorageKey))
}

export function setDataInLocalStorage(localStorageKey, newData) {
  if (!storageAvailable('localStorage')) {
    console.error('Local storage not available')
    return
  }
  localStorage.setItem(localStorageKey, JSON.stringify(newData))
}

export function storageAvailable(type) {
  let storage
  try {
    storage = window[type]
    const x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === 'QuotaExceededError' &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    )
  }
}
