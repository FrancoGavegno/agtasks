import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import ReactQueryProvider from '@/components/react-query-provider';
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
// import { Geist } from "next/font/geist";
// import { Geist_Mono } from "next/font/geistMono";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Agtasks",
  description: "Agricultural Task Management System",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side 
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        //className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col`}
        className={`antialiased flex flex-col`}
      >
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
        >
          <ReactQueryProvider>
            <Navbar />
            <main className="min-h-screen px-2">
              {children}
            </main>
            <Toaster />
            <Footer />
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}