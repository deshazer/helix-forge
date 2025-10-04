import AppSidebar from '@/components/layout/AppSidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { authQueries } from '@/lib/auth/auth.query'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(authQueries.user())
  },
  component: AuthenticatedComponent,
})

function AuthenticatedComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="z-50" />
          </TooltipTrigger>
          <TooltipContent>Toggle Sidebar (Ctrl+B)</TooltipContent>
        </Tooltip>
        <main className="flex-1 overflow-hidden p-2 sm:px-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
