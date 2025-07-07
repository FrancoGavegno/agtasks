import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import Link from "next/link"

const adminModules = [
  {
    title: "Projects",
    description: "Manage domain-specific projects",
    href: "/admin/project",
    count: "Manage all projects",
  },
  {
    title: "Protocols",
    description: "Manage domain-specific protocols",
    href: "/admin/protocol",
    count: "Manage protocols",
  },
  {
    title: "Forms",
    description: "Manage domain-specific collect data templates/forms",
    href: "/admin/form",
    count: "Manage forms",
  },
  {
    title: "Services",
    description: "Manage services associated with projects",
    href: "/admin/service",
    count: "Manage all services",
  },
  {
    title: "Tasks",
    description: "Manage tasks associated with projects or services",
    href: "/admin/task",
    count: "Manage all tasks",
  },
  {
    title: "Fields",
    description: "Manage fields data information",
    href: "/admin/field",
    count: "Manage all fields",
  },
]

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage all your application data from this central admin panel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminModules.map((module) => (
          <Link key={module.href} href={module.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{module.count}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
