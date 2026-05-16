import { ApolloProvider } from '@apollo/client'
import { useApolloClient } from '../lib/apolloClient'
import '../styles/globals.css'

// 모든 페이지를 감싸는 Next.js App 컴포넌트이다.
// ApolloProvider를 여기서 한 번만 적용하면 하위 페이지 어디서든 useQuery를 사용할 수 있다.
function MyApp({ Component, pageProps }) {
  const apolloClient = useApolloClient()

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp
