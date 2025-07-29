import type React from "react";
import ReactQueryProvider from "@/components/react-query-provider";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

export const metadata = {
  title: 'AgTasks',
  description: 'Agricultural Task Management System',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </head>
        <body className="antialiased flex flex-col">
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}