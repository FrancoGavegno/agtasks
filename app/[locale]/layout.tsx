import type React from "react"
import ReactQueryProvider from "@/components/react-query-provider"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar/navbar"
import { Footer } from "@/components/footer"
import { AppSidebar } from "@/components/sidebar"
import { 
  SidebarProvider, 
  SidebarInset 
} from "@/components/ui/sidebar"
import "./globals.css"
import { getUser } from "@/lib/360"

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = await params

  // TO DO: el user llega encriptado desde app switcher
  const user = await getUser("agoni@geoagro.com")

  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client side
  const messages = await getMessages({ locale })

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`antialiased flex flex-col`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReactQueryProvider>
            <Navbar user={user} />
            <div className="flex flex-1 overflow-hidden">
              <SidebarProvider>
                <AppSidebar user={user} />
                <SidebarInset>
                  <main className="min-h-screen px-5">{children}</main>
                </SidebarInset>
              </SidebarProvider>
            </div>
            <Toaster />
            <Footer />
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

