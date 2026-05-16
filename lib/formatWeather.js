// 날짜/시간 포맷터는 매번 새로 만들지 않고 재사용한다.
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

// 숫자 온도를 화면 표시용 문자열로 바꾼다.
export function formatTemperature(value) {
  if (typeof value !== 'number') {
    return '-'
  }

  return `${value.toFixed(2)}°C`
}

// OpenWeather timestamp는 초 단위라 JavaScript Date에서 쓰기 위해 1000을 곱한다.
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
