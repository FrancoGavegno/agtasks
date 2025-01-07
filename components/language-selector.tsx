"use client"

import { usePathname, useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Languages } from 'lucide-react'

const languages = [
  {
    code: "en",
    name: "English",
    flag: "🇺🇸"
  },
  {
    code: "es",
    name: "Español",
    flag: "🇪🇸"
  },
  {
    code: "pt",
    name: "Português",
    flag: "🇧🇷"
  }
]

export function LanguageSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()

  const handleLanguageChange = (locale: string) => {
    // Remove the current locale from the pathname if it exists
    const newPathname = pathname.replace(/^\/[a-z]{2}/, '')
    router.push(`/${locale}${newPathname}`)
  }

  const currentLanguage = languages.find(lang => lang.code === currentLocale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-auto px-2 sm:px-4">
          <Languages className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline-block">{currentLanguage?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="cursor-pointer"
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

