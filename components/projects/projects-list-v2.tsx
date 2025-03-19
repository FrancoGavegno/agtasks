"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLinkIcon } from "lucide-react"
import Link from "next/link"

// Tipos para el proyecto
type ServiceStatus = "Por hacer" | "En proceso" | "Realizado"

interface Service {
  id: string
  domain: string
  area: string
  workspace: string
  campaign: string
  establishment: string
  protocol: string
  assignedTo: string
  createdAt: string
  dueDate: string
  status: ServiceStatus
  progress: number
  url: string
}

// Datos simulados
const services: Service[] = [
  {
    id: "1",
    domain: "GeoAgro",
    area: "Norte",
    workspace: "AARCAS",
    campaign: "Jun22 - Jul23",
    establishment: "Otoño",
    protocol: "Monitoreo satelital y control de malezas",
    assignedTo: "Juan Pérez",
    createdAt: "2024-02-15",
    dueDate: "2024-03-15",
    status: "En proceso",
    progress: 45,
    url: "",
  },
  {
    id: "2",
    domain: "GeoAgro",
    area: "Sur",
    workspace: "AARCAS",
    campaign: "Jun22 - Jul23",
    establishment: "Primavera",
    protocol: "Siembra y/o Fertilización Variable",
    assignedTo: "María González",
    createdAt: "2024-02-10",
    dueDate: "2024-04-01",
    status: "Por hacer",
    progress: 0,
    url: "",
  },
  {
    id: "3",
    domain: "GeoAgro",
    area: "Este",
    workspace: "AARCAS",
    campaign: "Jun22 - Jul23",
    establishment: "Verano",
    protocol: "Monitoreo satelital y control de malezas",
    assignedTo: "Carlos Rodríguez",
    createdAt: "2024-01-20",
    dueDate: "2024-02-20",
    status: "Realizado",
    progress: 100,
    url: "",
  },
  {
    id: "4",
    domain: "GeoAgro",
    area: "Oeste",
    workspace: "AARCAS",
    campaign: "Jun22 - Jul23",
    establishment: "Invierno",
    protocol: "Siembra y/o Fertilización Variable",
    assignedTo: "Ana Martínez",
    createdAt: "2024-02-01",
    dueDate: "2024-03-30",
    status: "En proceso",
    progress: 75,
    url: "",
  },
]

const getStatusColor = (status: ServiceStatus) => {
  switch (status) {
    case "Por hacer":
      return "bg-yellow-500/15 text-yellow-500 hover:bg-yellow-500/25"
    case "En proceso":
      return "bg-blue-500/15 text-blue-500 hover:bg-blue-500/25"
    case "Realizado":
      return "bg-green-500/15 text-green-500 hover:bg-green-500/25"
    default:
      return ""
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function ServicesList() {
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Proyectos</CardTitle>
          <CardDescription>Lista de proyectos de monitoreo y control</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dominio</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Espacio de trabajo</TableHead>
                <TableHead>Campaña</TableHead>
                <TableHead>Establecimiento</TableHead>
                <TableHead>Protocolo</TableHead>
                <TableHead>Asignado a</TableHead>
                <TableHead>Fecha alta</TableHead>
                <TableHead>Fecha límite</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>TM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.domain}</TableCell>
                  <TableCell>{service.area}</TableCell>
                  <TableCell>{service.workspace}</TableCell>
                  <TableCell>{service.campaign}</TableCell>
                  <TableCell>{service.establishment}</TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate" title={service.protocol}>
                      {service.protocol}
                    </div>
                  </TableCell>
                  <TableCell>{service.assignedTo}</TableCell>
                  <TableCell>{formatDate(service.createdAt)}</TableCell>
                  <TableCell>{formatDate(service.dueDate)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(service.status)} variant="secondary">
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-[100px] flex items-center gap-2">
                      <Progress value={service.progress} className="h-2" />
                      <span className="text-xs text-muted-foreground">{service.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link href={service.url}>
                      <a className="text-blue-500 hover:underline">
                        <ExternalLinkIcon size={16} />
                      </a>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

