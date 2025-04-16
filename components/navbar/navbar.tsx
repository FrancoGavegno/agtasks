"use client"

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link"
import { useTranslations } from "next-intl"
import { MainNav } from "@/components/navbar/main-nav"
//import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, CircleUserRound } from 'lucide-react'
import { User } from "@/lib/interfaces"

// interface Props {
//   user: User
// }

// export function Navbar({ user }: Props) {
export function Navbar() {
  const t = useTranslations("nav")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto">

        <Link href="/" className="font-bold">
          Agtasks
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* <nav className="flex items-center space-x-2"> */}
          <nav>
            {/* <ThemeToggle /> */}
            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                {/* <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">{t("notifications")}</span>
                </Button> */}
                <LanguageSelector />
                <MainNav />
                <UserButton />
              </SignedIn>
            </div>

          </nav>
        </div>
      </div>
    </header>
  )
}

