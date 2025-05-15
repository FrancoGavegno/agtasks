"use client"

import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  SignUpButton, 
  UserButton 
} from "@clerk/nextjs"
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { LanguageSelector } from "@/components/language-selector"
// import { MainNav } from "@/components/navbar/main-nav"

export function Navbar() {
  const t = useTranslations("Navbar")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto">
        <Link href="/" className="font-bold">
          Agtasks
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav>
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
                {/* <MainNav /> */}
                <UserButton />
              </SignedIn>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

