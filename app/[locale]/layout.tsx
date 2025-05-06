import { cookies } from 'next/headers';
import { AppSidebar } from "@/components/sidebar"
import {
  SidebarProvider,
  SidebarInset
} from "@/components/ui/sidebar"

// import { getUser } from "@/lib/integrations/360"
// import { getUserEmail } from "@/lib/integrations/clerk"

export default async function AppLayout({
  children
}: {
  children: React.ReactNode
}) {
  const cookiesList = cookies();
  const userEmail = cookiesList.get('user-email')?.value || "";
  // console.log('Locale Layout - userEmail:', userEmail);
  
  return (
    <div className="flex flex-1 overflow-hidden">
      <SidebarProvider>
        <AppSidebar user={userEmail}/>
        <SidebarInset>
          <main className="min-h-screen px-5">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

