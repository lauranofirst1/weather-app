import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { gql, useQuery } from '@apollo/client'
import { findCity } from '../lib/cities'
import { formatDateTime } from '../lib/formatWeather'
import WeatherSummary from '../components/WeatherSummary'
import styles from '../styles/Weather.module.css'

const ForecastAccordion = dynamic(() => import('../components/ForecastAccordion'))

const WEATHER_QUERY = gql`
  query CityWeather($city: String!) {
    cityWeather(city: $city) {
      city
      country
      population
      current {
        timestamp
        temperature
        feelsLike
        humidity
        windSpeed
        description
        icon
      }
      forecast {
        dateKey
        displayDate
        items {
          timestamp
          time
          minTemperature
          maxTemperature
          description
          icon
        }
      }
    }
  }
`

export default function CityWeatherPage({ city }) {
  const { data, loading, error } = useQuery(WEATHER_QUERY, {
    variables: { city },
  })

  const weather = data?.cityWeather
  const title = `Weather Information for ${city}`

  return (
    <div className={styles.page}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={`${city} weather and 5-day forecast`} />
      </Head>

      <main className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.logoImage}>
            <Image src="/img.png" alt="Weather globe" width={54} height={42} priority />
          </div>
          <h1>{title}</h1>
        </header>

        {loading && <p className={styles.notice}>Loading weather information...</p>}
        {error && (
          <p className={styles.notice} role="alert">
            {error.message}
          </p>
        )}

        {weather && (
          <>
            <WeatherSummary
              city={`${weather.city}, ${weather.country}`}
              dateTime={formatDateTime(weather.current.timestamp)}
              population={weather.population}
              current={weather.current}
            />
            <ForecastAccordion forecast={weather.forecast} />
          </>
        )}
      </main>
    </div>
  )
}

export function getServerSideProps({ params }) {
  const city = findCity(params.city)

  if (!city) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      city,
    },
  }
}
