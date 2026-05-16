import { UserInputError } from 'apollo-server-micro'
import { CITY_OPTIONS, findCity } from './cities'
import { formatForecastDate, formatForecastTime } from './formatWeather'

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5'

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
