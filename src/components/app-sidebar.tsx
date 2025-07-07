"use client"

import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { useAppSelector } from "@/store/hooks"
import { NavUser } from "@/components/nav-user"
import { staffNavItems, departmentHeadNavItems, adminNavItems } from "@/constants/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector((state) => state.auth)
  const role = user?.role || 'STAFF'
  const router = useRouter()

  // Get navigation items based on role
  const getNavItems = () => {
    switch (role) {
      case 'ADMIN':
        return adminNavItems
      case 'DEPARTMENT_HEAD':
        return departmentHeadNavItems
      default:
        return staffNavItems
    }
  }

  const handleNavigation = (url: string) => {
    router.push(url)
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div onClick={() => handleNavigation('/dashboard')}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Dashboard</span>
                  <span className="truncate text-xs">{role.charAt(0).toUpperCase() + role.slice(1)} Portal</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {getNavItems().map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <div onClick={() => handleNavigation(item.url)} className="font-medium">
                    {item.icon && <item.icon className="mr-2 size-4" />}
                    {item.title}
                  </div>
                </SidebarMenuButton>
                {item.items && item.items.length > 0 && (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <div 
                            className="ml-2 cursor-pointer" 
                            onClick={() => handleNavigation(subItem.url)}
                          >
                            {subItem.title}
                          </div>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser user={user || { name: "User", email: "user@example.com", avatar: "/avatars/user.jpg" }} />
      </SidebarFooter>
    </Sidebar>
  )
}
