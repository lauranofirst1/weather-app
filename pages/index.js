import Head from 'next/head'
import Image from 'next/image'
import CityNavigation from '../components/CityNavigation'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <Head>
        <title>Weather App</title>
        <meta
          name="description"
          content="Check current weather and 5-day forecasts for Seoul, Tokyo, Paris, and London."
        />
      </Head>

      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="home-title">
          <h1 id="home-title" className={styles.title}>
            <span>Welcome to</span>
            <strong>Weather App!</strong>
          </h1>
          <p className={styles.description}>
            Choose a city from the list below to check the weather.
          </p>
          <CityNavigation />
          <div className={styles.globeImage}>
            <Image src="/img.png" alt="Weather globe" width={430} height={331} priority />
          </div>
        </section>
      </main>
    </div>
  )
}
