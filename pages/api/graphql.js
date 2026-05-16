import { ApolloServer, gql } from 'apollo-server-micro'
import { fetchCityWeather } from '../../lib/openWeather'

// GraphQL 스키마이다. 프론트엔드가 어떤 데이터 구조를 요청할 수 있는지 정의한다.
const typeDefs = gql`
  type WeatherNow {
    timestamp: Int!
    temperature: Float!
    feelsLike: Float!
    humidity: Int!
    windSpeed: Float!
    description: String!
    icon: String!
  }

  type ForecastItem {
    timestamp: Int!
    time: String!
    minTemperature: Float!
    maxTemperature: Float!
    description: String!
    icon: String!
  }

  type ForecastDay {
    dateKey: String!
    displayDate: String!
    items: [ForecastItem!]!
  }

  type CityWeather {
    city: String!
    country: String!
    population: Int
    current: WeatherNow!
    forecast: [ForecastDay!]!
  }

  type Query {
    cityWeather(city: String!): CityWeather!
  }
`

// resolver는 GraphQL 요청을 실제 데이터 조회 함수에 연결한다.
const resolvers = {
  Query: {
    cityWeather: (_, { city }) => fetchCityWeather(city),
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Apollo Server 시작은 비동기 작업이므로, 요청마다 새로 시작하지 않도록 Promise를 재사용한다.
const startServer = server.start()

// Next.js API Route를 GraphQL 엔드포인트로 사용하는 핸들러이다.
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.end()
    return
  }

  await startServer
  await server.createHandler({ path: '/api/graphql' })(req, res)
}

// Apollo Server가 요청 본문을 직접 처리해야 하므로 Next.js 기본 bodyParser를 끈다.
export const config = {
  api: {
    bodyParser: false,
  },
}
