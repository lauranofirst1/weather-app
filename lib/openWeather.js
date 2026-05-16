import { UserInputError } from 'apollo-server-micro'
import { CITY_OPTIONS, findCity } from './cities'
import { formatForecastDate, formatForecastTime } from './formatWeather'

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5'

// OpenWeather API를 호출하는 공통 함수이다.
// path에는 weather 또는 forecast가 들어가고, API key는 서버 환경 변수에서만 읽는다.
async function requestOpenWeather(path, city) {
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    throw new Error('OPENWEATHER_API_KEY is missing. Add your OpenWeather API key to .env.local.')
  }

  const params = new URLSearchParams({
    q: city,
    appid: apiKey,
    units: 'metric',
  })

  const response = await fetch(`${API_BASE_URL}/${path}?${params.toString()}`)
  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload?.message || 'Failed to fetch weather data from OpenWeather.')
  }

  return payload
}

// Current Weather API 응답에서 화면과 GraphQL 스키마에 필요한 필드만 추려낸다.
function normalizeCurrent(payload) {
  const weather = payload.weather?.[0] || {}

  return {
    timestamp: payload.dt,
    temperature: payload.main.temp,
    feelsLike: payload.main.feels_like,
    humidity: payload.main.humidity,
    windSpeed: payload.wind.speed,
    description: weather.description || 'unknown',
    icon: weather.icon || '01d',
  }
}

// 3시간 단위 forecast 목록을 날짜별로 묶고, 과제 요구에 맞게 최대 5일만 반환한다.
function groupForecastItems(items) {
  const groups = items.reduce((acc, item) => {
    const date = new Date(item.dt * 1000)
    const dateKey = date.toISOString().slice(0, 10)
    const weather = item.weather?.[0] || {}

    if (!acc[dateKey]) {
      acc[dateKey] = {
        dateKey,
        displayDate: formatForecastDate(item.dt),
        items: [],
      }
    }

    acc[dateKey].items.push({
      timestamp: item.dt,
      time: formatForecastTime(item.dt),
      minTemperature: item.main.temp_min,
      maxTemperature: item.main.temp_max,
      description: weather.description || 'unknown',
      icon: weather.icon || '01d',
    })

    return acc
  }, {})

  return Object.values(groups).slice(0, 5)
}

// GraphQL resolver에서 호출하는 서비스 함수이다.
// 도시 검증 후 현재 날씨와 5일 예보를 병렬로 요청한다.
export async function fetchCityWeather(cityValue) {
  const city = findCity(cityValue)

  if (!city) {
    throw new UserInputError(`City must be one of: ${CITY_OPTIONS.join(', ')}`)
  }

  const [current, forecast] = await Promise.all([
    requestOpenWeather('weather', city),
    requestOpenWeather('forecast', city),
  ])

  return {
    city: current.name,
    country: current.sys.country,
    population: forecast.city?.population || null,
    current: normalizeCurrent(current),
    forecast: groupForecastItems(forecast.list || []),
  }
}
