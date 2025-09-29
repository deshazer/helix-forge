import { Link } from '@tanstack/react-router'
import Logo from '../logo/Logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar'
import { Cog, Home, LogOut } from 'lucide-react'
import { useAuthState, useLogoutMutation } from '@/lib/auth/auth.query'

const AppSidebar = () => {
  const { mutateAsync: logout } = useLogoutMutation()
  const { data: user } = useAuthState()
  const name = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim()
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem asChild>
            <Link to="/home">
              <Logo className="max-w-[calc(var(--sidebar-width)-3rem)]" />
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem asChild>{name}</SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/home">
                    <Home /> Home
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/settings">
                <Cog /> Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout}>
              <LogOut />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
