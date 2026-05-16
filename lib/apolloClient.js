import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { useMemo } from 'react'

// 브라우저에서는 Apollo Client 인스턴스를 재사용해서 캐시와 연결 객체를 유지한다.
let browserClient

// GraphQL API Route와 통신하는 Apollo Client를 만든다.
function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: '/api/graphql',
    }),
    cache: new InMemoryCache(),
  })
}

// 서버에서는 요청마다 새 client를 만들고, 브라우저에서는 하나만 만들어 재사용한다.
function initializeApollo() {
  if (typeof window === 'undefined') {
    return createApolloClient()
  }

  if (!browserClient) {
    browserClient = createApolloClient()
  }

  return browserClient
}

// React 컴포넌트에서 Apollo Client를 안정적으로 가져오기 위한 hook이다.
export function useApolloClient() {
  return useMemo(() => initializeApollo(), [])
}
