import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10_000,
        structuralSharing: false,
        retry(failureCount, error) {
          const status = error?.response?.status
          if (status === 401) {
            return false // let the axios interceptor handle this
          }
          return failureCount < 3
        },
      },
      mutations: {
        retry(failureCount, error) {
          const status = error?.response?.status
          if (status === 401) {
            return false // let the axios interceptor handle this
          }
          return failureCount < 1
        },
      },
    },
  })
  return { queryClient }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
