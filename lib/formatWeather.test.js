import { formatTemperature } from './formatWeather'

describe('formatTemperature', () => {
  it('formats a numeric temperature with two decimals and celsius unit', () => {
    expect(formatTemperature(21)).toBe('21.00°C')
    expect(formatTemperature(-3.456)).toBe('-3.46°C')
  })

  it('returns a placeholder for non-number values', () => {
    expect(formatTemperature(null)).toBe('-')
    expect(formatTemperature('21')).toBe('-')
  })
})
