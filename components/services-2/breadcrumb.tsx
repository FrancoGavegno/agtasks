import { ChevronRight } from "lucide-react"

interface BreadcrumbProps {
  portalName: string
  projectName: string
}

export function Breadcrumb({ portalName, projectName }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-muted-foreground p-4">
      <span>{portalName}</span>
      <span className="mx-2 text-muted-foreground/50">({projectName})</span>
      <ChevronRight className="h-4 w-4 mx-1" />
      <span>Nuevo Pedido de Servicio</span>
    </nav>
  )
}

