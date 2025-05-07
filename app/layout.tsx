import type React from "react";
import ReactQueryProvider from "@/components/react-query-provider";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html suppressHydrationWarning>
        <body className="antialiased flex flex-col">
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}