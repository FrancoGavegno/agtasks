import type React from "react"
import ReactQueryProvider from "@/components/react-query-provider"
import { ClerkProvider } from '@clerk/nextjs'
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar/navbar"
import { Footer } from "@/components/footer"
import "./globals.css"

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { locale: string }
}) {
    const { locale } = await params

    // Providing all messages to the client side
    const messages = await getMessages({ locale })

    return (
        <ClerkProvider>
            <html lang={locale} suppressHydrationWarning>
                <body className={`antialiased flex flex-col`}>
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        <ReactQueryProvider>
                            {/* <Navbar user={user} /> */}
                            <Navbar />
                            {children}
                            <Toaster />
                            <Footer />
                        </ReactQueryProvider>
                    </NextIntlClientProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}