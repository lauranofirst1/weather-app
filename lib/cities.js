// 과제에서 허용한 도시 목록이다. 메인 버튼과 상세 페이지 검증에 함께 사용한다.
export const CITY_OPTIONS = ['Seoul', 'Tokyo', 'Paris', 'London']

// URL로 들어온 도시 이름을 대소문자 구분 없이 허용 목록과 비교한다.
export function findCity(value = '') {
  return CITY_OPTIONS.find((city) => city.toLowerCase() === value.toLowerCase()) || null
}
