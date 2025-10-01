import { useAuthState, useLogoutMutation } from '@/lib/auth/auth.query'
import { Link } from '@tanstack/react-router'
import {
  ChartNoAxesCombined,
  ChevronRight,
  Cog,
  DollarSign,
  History,
  Home,
  Landmark,
  LogOut,
  NotebookPen,
} from 'lucide-react'
import Logo from '../logo/Logo'
import LogoIcon from '../logo/LogoIcon'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible'
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../ui/sidebar'

const AppSidebar = () => {
  const { mutateAsync: logout } = useLogoutMutation()
  const { data: user } = useAuthState()
  const name = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim()
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/home">
              <Logo className="max-w-[calc(var(--sidebar-width)-3rem)] group-data-[state=collapsed]:hidden" />
              <LogoIcon className="w-8 group-data-[state=expanded]:hidden" />
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem className="group-data-[state=collapsed]:hidden">
            👋 {name}
          </SidebarMenuItem>
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/transactions">
                    <DollarSign /> Transactions
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/accounts">
                    <Landmark /> Accounts
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* REPORTS */}
              <Collapsible asChild className="group/collapsible" defaultOpen>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <ChartNoAxesCombined /> Reports{' '}
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/reports/quotes">
                            <NotebookPen /> Quotes
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      {/* <SidebarMenuSubItem> */}
                      {/*   <SidebarMenuSubButton asChild> */}
                      {/*     <Link to="/reports/price-history"> */}
                      {/*       <History /> Price History */}
                      {/*     </Link> */}
                      {/*   </SidebarMenuSubButton> */}
                      {/* </SidebarMenuSubItem> */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link to="/reports/options">
                            <DollarSign /> Options Premium
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              {/* END REPORTS */}
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
