"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Datos de ejemplo para simular las selecciones del usuario
// En una aplicación real, estos datos vendrían de un estado global o contexto
const SUMMARY_DATA = {
  // Step 1: Protocolo
  protocol: {
    id: "variable-seeding",
    name: "Protocolo Siembra y/o Fertilización Variable",
    issueKey: "AGRO-123",
    status: "En progreso",
  },

  // Step 2: Selección de espacio de trabajo, etc.
  workspace: {
    name: "Espacio 1",
    campaign: "Campaña 2",
    establishment: "Establecimiento 3",
    lots: [
      { id: "lot1", name: "Lote 1", area: "10 ha", crop: "Maíz" },
      { id: "lot3", name: "Lote 3", area: "20 ha", crop: "Trigo" },
    ],
  },

  // Step 3: Fecha límite y asignaciones
  deadline: new Date(2025, 5, 15), // 15 de junio de 2025
  assignments: [
    { task: "Tarea 1", role: "Rol 2", user: "Usuario 1" },
    { task: "Tarea 2", role: "Rol 1", user: "Usuario 3" },
    { task: "Tarea 3", role: "Rol 3", user: "Usuario 2" },
  ],
}

export default function FormSummary() {
  return (
    <div className="space-y-6">
      {/* Sección de Protocolo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Protocolo de servicio a aplicar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{SUMMARY_DATA.protocol.name}</span>
              {/* <Badge variant="outline">{SUMMARY_DATA.protocol.status}</Badge> */}
            </div>
            {/* <p className="text-sm text-muted-foreground">Issue: {SUMMARY_DATA.protocol.issueKey}</p> */}
          </div>
        </CardContent>
      </Card>

      {/* Sección de Espacio de trabajo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Espacio de trabajo, Campaña, Establecimiento y Lotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Espacio de trabajo</p>
                <p className="font-medium">{SUMMARY_DATA.workspace.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Campaña</p>
                <p className="font-medium">{SUMMARY_DATA.workspace.campaign}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Establecimiento</p>
                <p className="font-medium">{SUMMARY_DATA.workspace.establishment}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Lotes seleccionados</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Cultivo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SUMMARY_DATA.workspace.lots.map((lot) => (
                    <TableRow key={lot.id}>
                      <TableCell className="font-medium">{lot.name}</TableCell>
                      <TableCell>{lot.area}</TableCell>
                      <TableCell>{lot.crop}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección de Fecha límite y asignaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fecha límite, Roles y Usuarios asignados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Fecha límite</p>
              <p className="font-medium">{format(SUMMARY_DATA.deadline, "PPP", { locale: es })}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Asignaciones</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarea</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Usuario</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SUMMARY_DATA.assignments.map((assignment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{assignment.task}</TableCell>
                      <TableCell>{assignment.role}</TableCell>
                      <TableCell>{assignment.user}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

