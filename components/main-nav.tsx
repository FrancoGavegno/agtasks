"use client"

//import Link from "next/link"
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  BarChart3, 
  Settings, 
  Link2, 
  LayoutTemplate,
  CreditCard, 
  Users, 
  FolderKanban,
  Bell, 
  HelpCircle, 
  Menu,
  Monitor,
  CalendarCheck2
} from 'lucide-react'

const menuItems = [
  // {
  //   title: "Dashboard",
  //   href: "/",
  //   icon: BarChart3,
  //   description: "View your dashboard and analytics"
  // },
  {
    title: "Accounts",
    href: "/accounts",
    icon: Link2,
    description: "Manage your connected accounts"
  },
  {
    title: "Portals",
    href: "/portals",
    icon: Monitor,
    description: "Manage your service portals"
  },
  {
    title: "Protocols",
    href: "/protocols",
    icon: LayoutTemplate,
    description: "Browse and use protocols templates"
  },
  // {
  //   title: "Projects",
  //   href: "/projects",
  //   icon: FolderKanban,
  //   description: "Manage your projects"
  // },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CalendarCheck2,
    description: "View and manage your service tasks"
  },
  {
    title: "Team",
    href: "/team",
    icon: Users,
    description: "Manage your team members"
  },
  {
    title: "Subscriptions",
    href: "/subscriptions",
    icon: CreditCard,
    description: "Manage your subscription plans"
  },
  // {
  //   title: "Notifications",
  //   href: "/notifications",
  //   icon: Bell,
  //   description: "View your notifications"
  // },
  {
    title: "Help & Support",
    href: "/support",
    icon: HelpCircle,
    description: "Get help and documentation"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Manage your account settings"
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[240px]">
          <DropdownMenuLabel>Navigation</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <DropdownMenuItem key={item.href} asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 py-2",
                    pathname === item.href && "font-bold"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <div className="flex flex-col gap-1">
                    <span>{item.title}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

