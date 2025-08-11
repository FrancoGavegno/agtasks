import { cookies } from 'next/headers';
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/footer";
import ClientLayoutWithDomainProject from "@/components/client-layout-domain-project";
import RootProviders from "./providers";

interface AppLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const { locale } = params;
  const cookiesList = cookies();
  const userEmail = cookiesList.get('user-email')?.value || "";
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <RootProviders>
        <ClientLayoutWithDomainProject userEmail={userEmail}>
          {children}
        </ClientLayoutWithDomainProject>
        <Toaster />
        <Footer />
      </RootProviders>
    </NextIntlClientProvider>
  );
}