import { useState } from 'react'
import { formatTemperature } from '../lib/formatWeather'
import WeatherIcon from './WeatherIcon'
import styles from '../styles/Weather.module.css'

export default function ForecastAccordion({ forecast }) {
  const [openDate, setOpenDate] = useState(null)

  return (
    <section className={styles.forecast} aria-labelledby="forecast-title">
      <h2 id="forecast-title">5-day Forecast</h2>
      {forecast.map((day) => {
        const isOpen = day.dateKey === openDate

        return (
          <article className={styles.forecastDay} key={day.dateKey}>
            <button
              className={styles.dayButton}
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenDate(isOpen ? null : day.dateKey)}
            >
              <span>{day.displayDate}</span>
              <span className={styles.chevron} aria-hidden="true" />
            </button>
            {isOpen && (
              <div className={styles.dayPanel}>
                {day.items.map((item) => (
                  <div className={styles.forecastItem} key={item.timestamp}>
                    <div className={styles.forecastTime}>
                      <WeatherIcon
                        icon={item.icon}
                        description={item.description}
                        size="small"
                      />
                      <strong>{item.time}</strong>
                    </div>
                    <div className={styles.forecastTemp}>
                      <span>{item.description}</span>
                      <strong>
                        {formatTemperature(item.minTemperature)} /{' '}
                        {formatTemperature(item.maxTemperature)}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        )
      })}
    </section>
  )
}
