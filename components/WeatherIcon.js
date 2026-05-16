import Image from 'next/image'
import styles from '../styles/Weather.module.css'

// OpenWeather가 내려주는 icon 코드(예: 01d, 10n)를 공식 아이콘 이미지 URL로 바꿔 표시한다.
export default function WeatherIcon({ icon, description, size = 'large' }) {
  const src = `https://openweathermap.org/img/wn/${icon}@2x.png`
  const imageSize = size === 'small' ? 60 : 80

  return (
    <span className={`${styles.weatherIcon} ${styles[size]}`}>
      <Image src={src} alt={description} width={imageSize} height={imageSize} />
    </span>
  )
}
