import type React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { routing } from "@/i18n/routing"
import ReactQueryProvider from "@/components/react-query-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar/navbar"
import { Footer } from "@/components/footer"
import { AppSidebar } from "@/components/sidebar"
import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger 
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import "./globals.css"

// export const metadata: Metadata = {
//   title: "Agtasks",
//   description: "Agricultural Task Management System",
// }

import { getUser } from "@/lib/360"

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = await params
  const user = await getUser("fmaggioni@geoagro.com")

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client side
  const messages = await getMessages({ locale })

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        //className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col`}
        className={`antialiased flex flex-col`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReactQueryProvider>
            <Navbar user={user} />
            <div className="flex flex-1 overflow-hidden">
              <SidebarProvider>
                <AppSidebar user={user} />
                <SidebarInset>
                  {/* <header className="flex h-14 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="h-4" />
                    <div className="font-medium">Agtasks</div>
                  </header> */}
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

