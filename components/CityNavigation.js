import Link from 'next/link'
import { CITY_OPTIONS } from '../lib/cities'
import styles from '../styles/Home.module.css'

export default function CityNavigation() {
  return (
    <nav className={styles.cityNav} aria-label="City list">
      {CITY_OPTIONS.map((city) => (
        <Link href={`/${city}`} key={city}>
          <a className={styles.cityButton}>{city}</a>
        </Link>
      ))}
    </nav>
  )
}
