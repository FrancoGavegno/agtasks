'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Edit, Layers, Plus, Search, Users } from "lucide-react"
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ServiceCard } from "@/components/portals/service-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"


interface Props {
  params: {
    portalId: string
  }
}

export default function PortalDetail({ params }: Props) {
  // Sample data for active services
  // const activeServices = [
  //   {
  //     id: "1",
  //     name: "Variable Seeding - North Field",
  //     technique: "Variable Seeding",
  //     progress: 65,
  //     startDate: "2025-02-15",
  //     endDate: "2025-04-30",
  //     teamCount: 4,
  //     status: "active",
  //   },
  //   {
  //     id: "2",
  //     name: "Precision Irrigation - East Field",
  //     technique: "Precision Irrigation",
  //     progress: 30,
  //     startDate: "2025-03-01",
  //     endDate: "2025-05-15",
  //     teamCount: 3,
  //     status: "active",
  //   },
  //   {
  //     id: "3",
  //     name: "Variable Fertilization - South Field",
  //     technique: "Variable Fertilization",
  //     progress: 80,
  //     startDate: "2025-01-10",
  //     endDate: "2025-03-25",
  //     teamCount: 5,
  //     status: "active",
  //   },
  // ]

  // Sample data for completed services
  // const completedServices = [
  //   {
  //     id: "4",
  //     name: "Soil Analysis - West Field",
  //     technique: "Soil Analysis",
  //     progress: 100,
  //     startDate: "2024-11-15",
  //     endDate: "2025-01-10",
  //     teamCount: 3,
  //     status: "completed",
  //   },
  //   {
  //     id: "5",
  //     name: "Harvest Monitoring - Central Field",
  //     technique: "Harvest Monitoring",
  //     progress: 100,
  //     startDate: "2024-10-01",
  //     endDate: "2024-12-15",
  //     teamCount: 4,
  //     status: "completed",
  //   },
  // ]

  const service = {
    id: params.portalId,
    name: "Variable Seeding - North Field",
    technique: "Variable Seeding",
    description:
      "Implementation of variable seeding rates based on soil analysis and historical yield data to optimize seed placement and density across different zones of the North Field.",
    progress: 65,
    startDate: "2025-02-15",
    endDate: "2025-04-30",
    fieldName: "North Field",
    fieldSize: 42,
    location: "Fresno County, CA",
    cropType: "Corn",
    status: "active",
    team: [
      { id: "1", name: "Maria Rodriguez", role: "Technical Lead", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "2", name: "John Smith", role: "Project Owner", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "3", name: "Carlos Mendez", role: "Field Operator", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "4", name: "Sarah Johnson", role: "Data Analyst", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    documents: [
      { id: "1", name: "Soil Analysis Report.pdf", date: "2025-02-10", type: "PDF" },
      { id: "2", name: "Seeding Prescription Map.jpg", date: "2025-02-20", type: "Image" },
      { id: "3", name: "Field History Data.xlsx", date: "2025-02-05", type: "Excel" },
    ],
  }

  // Lista de formularios KoboToolbox de ejemplo (duplicada para acceso local)
  const FORMULARIOS = [
    { id: "form1", nombre: "Formulario de Registro de Beneficiarios" },
    { id: "form2", nombre: "Encuesta de Satisfacción" },
    { id: "form3", nombre: "Evaluación de Necesidades" },
    { id: "form4", nombre: "Monitoreo de Actividades" },
    { id: "form5", nombre: "Registro de Incidentes" },
    { id: "form6", nombre: "Evaluación Post-Distribución" },
    { id: "form7", nombre: "Formulario de Consentimiento" },
    { id: "form8", nombre: "Evaluación de Vulnerabilidad" },
    { id: "form9", nombre: "Registro de Asistencia" },
    { id: "form10", nombre: "Formulario de Seguimiento" },
  ]
  
  const [filtro, setFiltro] = useState("")
  const [seleccion, setSeleccion] = useState<string[]>([])

  // Filtrar formularios según el texto de búsqueda
  const formulariosFiltrados = FORMULARIOS.filter((formulario) =>
    formulario.nombre.toLowerCase().includes(filtro.toLowerCase()),
  )

  // Manejar la selección/deselección de un formulario
  const toggleFormulario = (formularioId: string) => {
    setSeleccion((prevSeleccion) => {
      if (prevSeleccion.includes(formularioId)) {
        return prevSeleccion.filter((id) => id !== formularioId)
      } else {
        return [...prevSeleccion, formularioId]
      }
    })
  }

  return (
    <main className="container mx-auto p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portal</h1>
          <p className="text-muted-foreground mt-1">Manage your portal configuration</p>
        </div>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Información detallada del portal de servicio</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Dominio</dt>
                <dd className="text-sm">Rigran Tech</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Área</dt>
                <dd className="text-sm">Area 1</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Espacio de trabajo</dt>
                <dd className="text-sm">Espacio 1</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Proyecto</dt>
                <dd className="text-sm">CLIENTE 1</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeServices.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Across all services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Within the next 7 days</p>
          </CardContent>
        </Card>
      </div> */}


        <Tabs defaultValue="protocols" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="protocols">Protocols</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
          </TabsList>

          <TabsContent value="protocols" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Protocols</CardTitle>
                    <CardDescription>Protocols associated with this portal</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <ul className="list-disc list-inside text-sm">
                    <li>Monitoreo satelital y control de malezas</li>
                    <li>Protocolo Siembra y/o Fertilización Variable</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>People assigned to this portal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {service.team.map((member) => (
                      <div key={member.id} className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Roles</CardTitle>
                      <CardDescription>Roles associated with this portal</CardDescription>
                    </div>
                    <Button variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ul className="list-disc list-inside text-sm">
                      <li>Supervisor</li>
                      <li>Colector</li>
                      <li>Operador GIS</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forms">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Forms</CardTitle>
                    <CardDescription>Kobo Toolbox Forms associated with this portal</CardDescription>
                  </div>
                  {/* <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button> */}
                </div>
              </CardHeader>
              <CardContent>
                {/* <div className="space-y-6">
                  <ul className="list-disc list-inside text-sm">
                    <li>Evaluación de Necesidades</li>
                    <li>Monitoreo de Actividades</li>
                    <li>Registro de Incidentes</li>
                    <li>Formulario de Seguimiento</li>
                    <li>Encuesta de Satisfacción</li>
                  </ul>
                </div> */}

                {/* <div className="relative my-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Filtrar formularios..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="pl-10"
                  />
                </div> */}

                <div className="max-h-[200px] overflow-y-auto pr-1">
                  {formulariosFiltrados.length > 0 ? (
                    <div className="space-y-4">
                      {formulariosFiltrados.map((formulario) => (
                        <div key={formulario.id} className="flex items-center justify-between">
                          <Label htmlFor={`formulario-${formulario.id}`} className="flex-1 cursor-pointer">
                            {formulario.nombre} 
                          </Label>
                          <Switch
                            id={`formulario-${formulario.id}`}
                            checked={seleccion.includes(formulario.id)}
                            onCheckedChange={() => toggleFormulario(formulario.id)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                      <p className="text-sm text-muted-foreground">No se encontraron formularios.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>


        {/* <Tabs defaultValue="active" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Protocols</h2>
            <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList> 
          </div>

          <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>
        </Tabs>*/}

      </div>
    </main>
  )
}
