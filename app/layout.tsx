import type React from "react";
import ReactQueryProvider from "@/components/react-query-provider";
import "./globals.css";

export const metadata = {
  title: 'Agtasks',
  description: 'Sistema de Gestión de Tareas Agrícolas',
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
  );
}