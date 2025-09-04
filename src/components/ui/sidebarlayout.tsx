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
import { Home as HomeIcon, AlertTriangle } from 'lucide-react'

// ✅ Named import — your datepicker exports Calendar28
import { Calendar28 } from '@/components/ui/datepicker'

// Date state shared via context
import { DateProvider, useDateContext } from './date-context'

function DateFilterBar() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateContext()
  return (
    <div className="flex flex-wrap items-end gap-6 border-b bg-muted/30 px-6 py-4">
      <Calendar28
        label="Start Date"
        selectedDate={startDate}
        onChange={(d) => d && setStartDate(d)}
      />
      <Calendar28
        label="End Date"
        selectedDate={endDate}
        onChange={(d) => d && setEndDate(d)}
      />
    </div>
  )
}

export default function SidebarLayout() {
  const location = useLocation()

  return (
    // Provide shared dates to all pages within the layout
    <DateProvider>
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
                        <HomeIcon className="size-4" />
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
          {/* Global Date Filters */}
          <DateFilterBar />

          {/* Page content */}
          <main className="p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </DateProvider>
  )
}
