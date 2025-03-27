"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const sidebarAdminNavItems = [
  {
    title: "Apps",
    href: "/apps",
  },
  {
    title: "Protocols",
    href: "/protocols",
  },
  {
    title: "Teams",
    href: "/teams",
  },
  {
    title: "Forms",
    href: "/forms",
  },
  {
    title: "Projects",
    href: "/projects",
  }
]

const sidebarMemberNavItems = [
  {
    title: "Projects",
    href: "/projects",
  }
]


// Navigation data
const sidebarNavItems = [
  {
    title: "Accounts",
    href: "/accounts",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Tasks",
    href: "/tasks",
  },
  {
    title: "Calendar",
    href: "/calendar",
  },
  {
    title: "Reports",
    href: "/reports",
  },
  {
    title: "Settings",
    href: "/settings",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="pt-12">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Agtasks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarMemberNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                    <Link href={item.href}>{item.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

