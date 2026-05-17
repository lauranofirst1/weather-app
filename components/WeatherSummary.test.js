import { render, screen } from '@testing-library/react'
import WeatherSummary from './WeatherSummary'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...props }) => <img alt={alt} {...props} />,
}))

describe('WeatherSummary', () => {
  const current = {
    icon: '01d',
    description: 'clear sky',
    temperature: 18.234,
    feelsLike: 17.1,
    windSpeed: 3.456,
    humidity: 61,
  }

  it('renders current weather details for a city', () => {
    render(
      <WeatherSummary
        city="Seoul"
        dateTime="May 17 10:00 AM"
        population={9720846}
        current={current}
      />
    )

    expect(screen.getByRole('region', { name: 'Current weather' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Seoul' })).toBeInTheDocument()
    expect(screen.getByText('May 17 10:00 AM')).toBeInTheDocument()
    expect(screen.getByText('(인구수 : 9,720,846)')).toBeInTheDocument()
    expect(screen.getByText('18.23°C')).toBeInTheDocument()
    expect(screen.getByText(/Feels like 17.10°C clear sky/)).toBeInTheDocument()
    expect(screen.getByText(/풍속 3.46m\/s 습도 61%/)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'clear sky' })).toHaveAttribute(
      'src',
      'https://openweathermap.org/img/wn/01d@2x.png'
    )
  })

  it('does not render population when it is missing', () => {
    render(<WeatherSummary city="Seoul" dateTime="May 17 10:00 AM" current={current} />)

    expect(screen.queryByText(/인구수/)).not.toBeInTheDocument()
  })
})
