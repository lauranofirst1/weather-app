import { formatTemperature } from '../lib/formatWeather'
import WeatherIcon from './WeatherIcon'
import styles from '../styles/Weather.module.css'

export default function WeatherSummary({ city, dateTime, population, current }) {
  return (
    <section className={styles.summary} aria-label="Current weather">
      <div className={styles.summaryInfo}>
        <WeatherIcon icon={current.icon} description={current.description} />
        <div>
          <p className={styles.dateTime}>{dateTime}</p>
          <h2>{city}</h2>
          {population ? (
            <span className={styles.population}>(인구수 : {population.toLocaleString()})</span>
          ) : null}
        </div>
      </div>
      <div className={styles.temperature}>
        <strong>{formatTemperature(current.temperature)}</strong>
        <p>
          Feels like {formatTemperature(current.feelsLike)} {current.description} 풍속{' '}
          {current.windSpeed.toFixed(2)}m/s 습도 {current.humidity}%
        </p>
      </div>
    </section>
  )
}
