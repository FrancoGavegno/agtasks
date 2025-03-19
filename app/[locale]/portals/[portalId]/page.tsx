import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Layers, Plus, Users } from "lucide-react"
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ServiceCard } from "@/components/portals/service-card"

export default function Home() {
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

  // Lista de formularios KoboToolbox de ejemplo (duplicada para acceso local)
  const FORMS = [
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

  return (
    <main className="container mx-auto p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Home</h1>
          <p className="text-muted-foreground mt-1">Manage your portal configuration</p>
        </div>
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

        <Tabs defaultValue="active" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Protocols</h2>
            {/* <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList> */}
          </div>

          {/* <TabsContent value="active" className="space-y-4">
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
        </TabsContent>*/}
        </Tabs>


      </div>



    </main>
  )
}
