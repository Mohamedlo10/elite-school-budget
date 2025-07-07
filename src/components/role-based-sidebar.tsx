"use client"

import * as React from "react"
import { useAppSelector } from "@/store/hooks"
import { NavUser } from "@/components/nav-user"
import { adminNavItems, departmentHeadNavItems, staffNavItems } from "@/constants/navigation"
import { Command } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
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
} from "@/components/ui/sidebar"

export function RoleBasedSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector((state) => state.auth)
  const role = user?.role || 'STUDENT'
  const router = useRouter()
  const pathname = usePathname()

  // Get navigation items based on role
  const getNavItems = () => {
    switch (role) {
      case 'DEPARTMENT_HEAD':
        return departmentHeadNavItems;
      case 'STAFF':
        return staffNavItems;
      default:
        return adminNavItems;
    }
  }

  // Get initial active item based on current pathname
  const getInitialActiveItem = () => {
    const navItems = getNavItems()
    const path = pathname.split('/')[2] // Get the second segment of the path
    return navItems.find(item => item.url.includes(path)) || navItems[0]
  }

  const [activeItem, setActiveItem] = React.useState(getInitialActiveItem())

  // Update active item when pathname changes
  React.useEffect(() => {
    setActiveItem(getInitialActiveItem())
  }, [pathname])


  // Handle navigation item click
  const handleItemClick = (url: string) => {
    router.push(url)
  }

  return (
    <Sidebar
      collapsible="icon"
      className="border-r"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Dashboard</span>
                  <span className="truncate text-xs">{role.charAt(0).toUpperCase() + role.slice(1)} Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {getNavItems().map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={activeItem?.title === item.title}
                    onClick={() => handleItemClick(item.url)}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user || { name: "User", email: "user@example.com", avatar: "/avatars/user.jpg" }} />
      </SidebarFooter>
    </Sidebar>
  )
} 