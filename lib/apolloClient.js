import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { useMemo } from 'react'

let browserClient

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: '/api/graphql',
    }),
    cache: new InMemoryCache(),
  })
}

function initializeApollo() {
  if (typeof window === 'undefined') {
    return createApolloClient()
  }

  if (!browserClient) {
    browserClient = createApolloClient()
  }

  return browserClient
}

export function useApolloClient() {
  return useMemo(() => initializeApollo(), [])
}
