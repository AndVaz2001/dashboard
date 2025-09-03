import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Home, AlertTriangle } from 'lucide-react' // 👈 added icon for Severities

export default function SidebarLayout() {
  const location = useLocation()

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon" variant="inset">
        {/* Sidebar header */}
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>

        {/* Sidebar content */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Home */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === '/'}
                    tooltip="Home"
                  >
                    <Link to="/">
                      <Home className="size-4" />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Severities */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === '/severities'}
                    tooltip="Severities"
                  >
                    <Link to="/severities">
                      <AlertTriangle className="size-4" />
                      <span>Severities</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator />

        {/* Sidebar footer */}
        <SidebarFooter>
          <p className="text-xs text-muted-foreground">© 2025 My App</p>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Main content */}
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
