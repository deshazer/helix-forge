import { useAuthState, useLogoutMutation } from '@/lib/auth/auth.query'
import { Link, useLocation } from '@tanstack/react-router'
import {
  ChartNoAxesCombined,
  ChevronRight,
  Cog,
  DollarSign,
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

const topLinks = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/transactions', icon: DollarSign, label: 'Transactions' },
  { to: '/accounts', icon: Landmark, label: 'Accounts' },
  {
    icon: Landmark,
    label: 'Reports',
    to: [
      { to: '/reports/quotes', label: 'Quotes', icon: NotebookPen },
      { to: '/reports/profit', label: 'Profit', icon: ChartNoAxesCombined },
    ],
  },
]

const bottomLinks = [{ to: '/settings', icon: Cog, label: 'Settings' }]

const SidebarLink = ({ to, label, icon: Icon }) => {
  const location = useLocation()
  const isActive = typeof to === 'string' && location.pathname.startsWith(to)

  return (
    <>
      {Array.isArray(to) ? (
        <Collapsible asChild className="group/collapsible" defaultOpen>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <Icon /> {label}
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {to.map(({ to, icon: Icon, label }) => {
                  const isActive = location.pathname.startsWith(to)
                  return (
                    <SidebarMenuSubItem key={label}>
                      <SidebarMenuSubButton asChild isActive={isActive}>
                        <Link to={to}>
                          <Icon />
                          {label}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      ) : (
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={isActive}>
            <Link to={to}>
              <Icon /> {label}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </>
  )
}

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
              <LogoIcon className="w-8 hidden group-data-[state=collapsed]:inline" />
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
              {topLinks.map(({ label, to, icon }) => (
                <SidebarLink key={label} to={to} label={label} icon={icon} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {bottomLinks.map(({ label, to, icon }) => (
            <SidebarLink key={label} to={to} label={label} icon={icon} />
          ))}
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
