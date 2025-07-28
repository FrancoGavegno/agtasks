"use client"

import { Link } from '@/i18n/routing';
import { usePathname } from "next/navigation"
import { useTranslations } from 'next-intl';
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
  HelpCircle, 
  Menu,
} from 'lucide-react'

export function MainNav() {
  const pathname = usePathname()
  const t = useTranslations("MainNav")

  const menuItems = [
    {
      title: t("help-title"),
      href: "/support",
      icon: HelpCircle,
      description: t("help-description")
    },
  ]

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

