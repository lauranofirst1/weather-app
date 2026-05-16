# Weather App

## 실행 방법

의존성을 설치한다.

```bash
npm install
```

환경 변수 파일을 생성한다.

```bash
cp .env.example .env.local
```

`.env.local`에 OpenWeather API 키를 입력한다.

```bash
OPENWEATHER_API_KEY=발급받은_API_KEY
```

개발 서버를 실행한다.

```bash
npm run dev
```

브라우저에서 아래 주소로 접속한다.

```text
http://localhost:3000
```

## 개념 설명

### Create Next App

Create Next App은 Next.js 프로젝트를 빠르게 시작할 수 있도록 기본 폴더 구조와 설정을 생성하는 공식 도구이다. `pages`, `public`, `styles`, `package.json`, `next.config.js` 같은 기본 구조를 제공하며, 별도 복잡한 설정 없이 개발 서버를 실행할 수 있게 해준다.

이 프로젝트는 `pages` 디렉터리 기반 라우팅을 사용한다. `pages/index.js`는 메인 페이지이고, `pages/[city].js`는 도시 이름에 따라 상세 페이지를 보여주는 동적 라우트이다.

```js
// pages/[city].js
export function getServerSideProps({ params }) {
  const city = findCity(params.city)

  if (!city) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      city,
    },
  }
}
```

### GraphQL

GraphQL은 클라이언트가 필요한 데이터의 구조를 직접 지정해서 요청할 수 있는 API 쿼리 언어이다. REST API처럼 여러 엔드포인트를 나누는 방식이 아니라, 하나의 GraphQL 엔드포인트에서 필요한 필드만 선택해 요청하는 방식이다.

이 프로젝트에서는 `pages/api/graphql.js`에서 GraphQL API를 구현하였다. 프론트엔드는 `/api/graphql`로 요청하고, 백엔드는 OpenWeather API에서 받은 데이터를 GraphQL 응답 형태로 가공한다.

```js
// pages/api/graphql.js
const typeDefs = gql`
  type Query {
    cityWeather(city: String!): CityWeather!
  }
`

const resolvers = {
  Query: {
    cityWeather: (_, { city }) => fetchCityWeather(city),
  },
}
```

프론트엔드에서는 필요한 필드만 선택해서 요청한다.

```js
// pages/[city].js
const WEATHER_QUERY = gql`
  query CityWeather($city: String!) {
    cityWeather(city: $city) {
      city
      country
      current {
        temperature
        description
        icon
      }
    }
  }
`
```

### Apollo

Apollo는 GraphQL을 프론트엔드와 백엔드에서 쉽게 사용할 수 있도록 도와주는 라이브러리이다. Apollo Server는 GraphQL 스키마와 resolver를 사용해 백엔드 GraphQL 서버를 구성할 때 사용한다. Apollo Client는 React 컴포넌트에서 GraphQL 쿼리를 실행하고 응답 데이터를 상태처럼 사용할 때 사용한다.

이 프로젝트에서는 `pages/api/graphql.js`에서 Apollo Server를 사용한다.

```js
// pages/api/graphql.js
const server = new ApolloServer({
  typeDefs,
  resolvers,
})
```

프론트엔드에서는 `lib/apolloClient.js`에서 Apollo Client를 생성하고, `pages/_app.js`에서 전체 앱을 `ApolloProvider`로 감싼다.

```js
// lib/apolloClient.js
function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: '/api/graphql',
    }),
    cache: new InMemoryCache(),
  })
}
```

```js
// pages/_app.js
function MyApp({ Component, pageProps }) {
  const apolloClient = useApolloClient()

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
```

### Jest 단위 테스트

Jest는 JavaScript 코드의 단위 테스트를 작성하고 실행하는 테스트 프레임워크이다. 특정 함수가 기대한 값을 반환하는지, 컴포넌트가 의도한 동작을 하는지 검증할 때 사용한다.

이 프로젝트에는 Jest 테스트 코드를 추가하지 않았지만, 예를 들어 `lib/formatWeather.js`의 `formatTemperature` 함수는 단위 테스트 대상으로 분리하기 좋은 코드이다.

```js
// lib/formatWeather.js
export function formatTemperature(value) {
  if (typeof value !== 'number') {
    return '-'
  }

  return `${value.toFixed(2)}°C`
}
```

위 함수는 숫자를 입력하면 소수점 둘째 자리까지 표시한 온도 문자열을 반환하고, 숫자가 아니면 `-`를 반환한다. 이러한 순수 함수는 입력과 출력이 명확하기 때문에 Jest로 테스트하기 적합하다.
