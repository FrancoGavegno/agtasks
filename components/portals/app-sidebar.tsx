"use client"

import {
  BarChart3,
  Calendar,
  CheckSquare,
  BriefcaseBusiness,
  Map,
  MessageSquare,
  Settings,
  Users,
  Layers,
  MonitorCheck,
  Plus,
  Home
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { usePathname } from "next/navigation"

export function AppSidebar() {
  const pathname = usePathname()

  //console.log("pathname: ", pathname);
  

  const mainNavItems = [
    //Dashboard link is commented out but code is preserved
    {
      title: "Home",
      href: "/",
      icon: Home,
    },
    {
      title: "Services",
      href: "/services",
      icon: BriefcaseBusiness,
    },
    {
      title: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
    },
    // {
    //   title: "Team",
    //   href: "/team",
    //   icon: Users,
    // },
    // {
    //   title: "Maps",
    //   href: "/maps",
    //   icon: Map,
    // },
    // {
    //   title: "Calendar",
    //   href: "/calendar",
    //   icon: Calendar,
    // },
    // {
    //   title: "Analytics",
    //   href: "/analytics",
    //   icon: BarChart3,
    // },
    // {
    //   title: "Messages",
    //   href: "/messages",
    //   icon: MessageSquare,
    // },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-green-600 p-1">
            <MonitorCheck className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">Portal Name</span>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={`/portals/1${item.href}`}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Dario Baldati</span>
            <span className="text-xs text-muted-foreground">Agronomist</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

