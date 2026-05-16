import { ApolloServer, gql } from 'apollo-server-micro'
import { fetchCityWeather } from '../../lib/openWeather'

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

const resolvers = {
  Query: {
    cityWeather: (_, { city }) => fetchCityWeather(city),
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const startServer = server.start()

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.end()
    return
  }

  await startServer
  await server.createHandler({ path: '/api/graphql' })(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
}
