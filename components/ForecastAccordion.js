import { useState } from 'react'
import { formatTemperature } from '../lib/formatWeather'
import WeatherIcon from './WeatherIcon'
import styles from '../styles/Weather.module.css'

// 5일 예보 아코디언이다. 날짜를 클릭하면 해당 날짜의 3시간 단위 예보가 펼쳐진다.
export default function ForecastAccordion({ forecast }) {
  // 현재 펼쳐진 날짜의 dateKey를 저장한다. null이면 모두 접힌 상태이다.
  const [openDate, setOpenDate] = useState(null)

  return (
    <section className={styles.forecast} aria-labelledby="forecast-title">
      <h2 id="forecast-title">5-day Forecast</h2>
      {forecast.map((day) => {
        // 같은 날짜 버튼을 다시 누르면 접히고, 다른 날짜를 누르면 열린 날짜가 바뀐다.
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
