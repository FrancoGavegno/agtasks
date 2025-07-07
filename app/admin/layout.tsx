import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const adminRoutes = [
  { name: "Projects", href: "/admin/project" },
  { name: "Protocols", href: "/admin/protocol" },
  { name: "Forms", href: "/admin/form" },
  { name: "Services", href: "/admin/service" },
  { name: "Tasks", href: "/admin/task" },
  { name: "Fields", href: "/admin/field" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-muted/40 p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <nav className="space-y-2">
            {adminRoutes.map((route) => (
              <Button key={route.href} variant="ghost" className="w-full justify-start" asChild>
                <Link href={route.href}>{route.name}</Link>
              </Button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
