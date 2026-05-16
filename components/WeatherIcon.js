import Image from 'next/image'
import styles from '../styles/Weather.module.css'

export default function WeatherIcon({ icon, description, size = 'large' }) {
  const src = `https://openweathermap.org/img/wn/${icon}@2x.png`
  const imageSize = size === 'small' ? 60 : 80

  return (
    <span className={`${styles.weatherIcon} ${styles[size]}`}>
      <Image src={src} alt={description} width={imageSize} height={imageSize} />
    </span>
  )
}
