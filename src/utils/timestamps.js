export function toAbsoluteTimestamp(relativeTimestamp) {
  const tokens = relativeTimestamp.split(' ')
  const [quantity, unit] = tokens

  const now = Date.now()
  let unitInMs

  if (unit === 'month' || unit === 'months') unitInMs = 30 * 24 * 60 * 60 * 1000
  else if (unit === 'week' || unit === 'weeks') unitInMs = 7 * 24 * 60 * 60 * 1000
  else if (unit === 'day' || unit === 'days') unitInMs = 1 * 24 * 60 * 60 * 1000
  else {
    console.error('unknown unit:', unit)
    return null // Stop and return a safe fallback
  }

  const timestampInPast = now - Number(quantity) * unitInMs
  return timestampInPast
}

export function toRelativeTime(time, lang = navigator.language) {
  // Allow dates or times to be passed
  const timeMs = typeof time === 'number' ? time : time.getTime()

  // Get the amount of seconds between the given date and now
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000)

  // Array representing one minute, hour, day, week, month, etc in seconds
  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity]

  // Array equivalent to the above but in the string representation of the units
  const units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year']

  // Grab the ideal cutoff unit
  const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds))

  // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor is one day in seconds, so we can divide our seconds by this to get the # of days
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1

  // Intl.RelativeTimeFormat do its magic
  // const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'always' })
  // return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex])
  return rtf.format(Math.ceil(deltaSeconds / divisor), units[unitIndex])
}
