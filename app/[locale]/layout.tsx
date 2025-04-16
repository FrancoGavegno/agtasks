import { AppSidebar } from "@/components/sidebar"
import {
  SidebarProvider,
  SidebarInset
} from "@/components/ui/sidebar"
import { getUser } from "@/lib/360"

export default async function AppLayout({
  children
}: {
  children: React.ReactNode
}) {
  // TO DO: el user llega encriptado desde app switcher
  const user = await getUser("agoni@geoagro.com")

  return (
    <div className="flex flex-1 overflow-hidden">
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <main className="min-h-screen px-5">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

