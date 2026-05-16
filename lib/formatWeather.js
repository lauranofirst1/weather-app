const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

const fullDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
})

export function formatTemperature(value) {
  if (typeof value !== 'number') {
    return '-'
  }

  return `${value.toFixed(2)}°C`
}

export function formatDateTime(timestamp) {
  return fullDateTimeFormatter.format(timestamp * 1000).replace(',', '')
}

export function formatForecastDate(timestamp) {
  return dateFormatter.format(timestamp * 1000)
}

export function formatForecastTime(timestamp) {
  return timeFormatter
    .format(timestamp * 1000)
    .replace(' AM', 'am')
    .replace(' PM', 'pm')
}
