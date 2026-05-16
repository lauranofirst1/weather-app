import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { gql, useQuery } from '@apollo/client'
import { findCity } from '../lib/cities'
import { formatDateTime } from '../lib/formatWeather'
import WeatherSummary from '../components/WeatherSummary'
import styles from '../styles/Weather.module.css'

// 5일 예보 영역은 상세 페이지에서만 필요하므로 dynamic import로 코드 스플리팅한다.
const ForecastAccordion = dynamic(() => import('../components/ForecastAccordion'))

// Apollo Client가 /api/graphql로 보낼 GraphQL 쿼리이다.
// 화면에서 사용할 현재 날씨와 5일 예보 필드만 선택해서 요청한다.
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

// 도시 상세 페이지이다. URL의 city 값으로 GraphQL API에 날씨 데이터를 요청한다.
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

        {/* API 요청 중, 실패, 성공 상태를 각각 화면에 분기해서 보여준다. */}
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

// Next.js 서버에서 먼저 실행되는 함수이다.
// 허용된 도시가 아니면 404 페이지를 보여주고, 맞으면 city 값을 페이지 props로 넘긴다.
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
