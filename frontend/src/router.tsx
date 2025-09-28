import { createRouter } from '@tanstack/react-router'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'
import DefaultNotFound from '@/components/error/DefaultNotFound'
import DefaultPending from '@/components/error/DefaultPending'
import DefaultError from '@/components/error/DefaultError'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

const rqContext = TanstackQuery.getContext()
export const { queryClient } = rqContext

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    defaultNotFoundComponent: DefaultNotFound,
    defaultPendingComponent: DefaultPending,
    defaultErrorComponent: DefaultError,
    context: { ...rqContext },
    defaultPreload: 'intent',
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <TanstackQuery.Provider {...rqContext}>
          {props.children}
        </TanstackQuery.Provider>
      )
    },
  })

  return router
}
