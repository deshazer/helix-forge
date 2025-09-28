import { authQueries, useRefreshToken } from '@/lib/auth/auth.query'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    try {
      const isAuth = await context.queryClient.ensureQueryData(
        authQueries.isAuthenticated(),
      )
      if (!isAuth) {
        toast.error('Session expired. Please log in again.')
        console.log('Not authenticated')
        throw redirect({ to: '/login' })
      }
    } catch (error) {
      console.error(error)
      toast.error('Session expired. Please log in again.')
      throw redirect({ to: '/login' })
    }
  },
  component: AuthenticatedComponent,
})

function AuthenticatedComponent() {
  useRefreshToken()
  return <Outlet />
}
