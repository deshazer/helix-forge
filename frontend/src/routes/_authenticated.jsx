import { authQueries, useRefreshToken } from '@/lib/auth/auth.query'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import AppSidebar from '@/components/layout/AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    // This will auto-redirect if the user is not logged in via the axios interceptor
    await context.queryClient.ensureQueryData(authQueries.isAuthenticated())
  },
  component: AuthenticatedComponent,
})

function AuthenticatedComponent() {
  useRefreshToken()
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 overflow-hidden p-2 sm:px-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
