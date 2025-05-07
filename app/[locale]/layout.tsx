import { cookies } from 'next/headers';
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer";

export default async function AppLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const cookiesList = cookies();
  const userEmail = cookiesList.get('user-email')?.value || "";
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <AppSidebar user={userEmail} />
          <SidebarInset>
            <main className="min-h-screen px-5">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
      <Toaster />
      <Footer />
    </NextIntlClientProvider>
  );
}