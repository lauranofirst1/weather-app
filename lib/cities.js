export const CITY_OPTIONS = ['Seoul', 'Tokyo', 'Paris', 'London']

export function findCity(value = '') {
  return CITY_OPTIONS.find((city) => city.toLowerCase() === value.toLowerCase()) || null
}
