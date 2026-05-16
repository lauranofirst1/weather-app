import { ApolloProvider } from '@apollo/client'
import { useApolloClient } from '../lib/apolloClient'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const apolloClient = useApolloClient()

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp
