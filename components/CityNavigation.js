import Link from 'next/link'
import { CITY_OPTIONS } from '../lib/cities'
import styles from '../styles/Home.module.css'

// 메인 페이지의 도시 버튼 목록이다. Next Link를 사용해 새로고침 없이 상세 페이지로 이동한다.
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
