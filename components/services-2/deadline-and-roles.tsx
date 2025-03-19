"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

// Datos de ejemplo
const TASKS = [
  { id: "Monitoreo de lotes utilizando imágenes satelitales", name: "Monitoreo de lotes utilizando imágenes satelitales" },
  { id: "Zonificación del índice", name: "Zonificación del índice" },
  { id: "Validación del mapa de zonas con recorrida a campo", name: "Validación del mapa de zonas con recorrida a campo" },
  { id: "Confección de la prescripción", name: "Confección de la prescripción" },
  { id: "Generar reporte de prescripción", name: "Generar reporte de prescripción" },
  { id: "Exportar prescripción o enviarla al Operations Center de John Deere", name: "Exportar prescripción o enviarla al Operations Center de John Deere" },
  { id: "Control satelital post-aplicación", name: "Control satelital post-aplicación" },
  { id: "Control de calidad de aplicación", name: "Control de calidad de aplicación" },
  { id: "Análisis de rindes vs prescripción de herbicida", name: "Análisis de rindes vs prescripción de herbicida" },
]

const ROLES = [
  { id: "Supervisor", name: "Supervisor" },
  { id: "Colector", name: "Colector" },
  { id: "Operario GIS", name: "Operario GIS" },
]

const USERS = [
  { id: "Damian Baldani", name: "Damian Baldani" },
  { id: "Sebastian Sartor", name: "Sebastian Sartor" },
  { id: "Georgina Ferro", name: "Georgina Ferro" },
]

type TaskAssignment = {
  taskId: string
  roleId: string
  userId: string
}

type DeadlineAndRolesProps = {
  onSelectionChange: (isValid: boolean) => void
}

export default function DeadlineAndRoles({ onSelectionChange }: DeadlineAndRolesProps) {
  const [deadline, setDeadline] = useState<Date | undefined>(undefined)
  const [assignments, setAssignments] = useState<TaskAssignment[]>(
    TASKS.map((task) => ({
      taskId: task.id,
      roleId: "",
      userId: "",
    })),
  )

  // Notificar al componente padre cuando cambia la fecha límite
  useEffect(() => {
    onSelectionChange(!!deadline)
  }, [deadline, onSelectionChange])

  // Manejar cambio de rol
  const handleRoleChange = (taskId: string, roleId: string) => {
    setAssignments((prev) =>
      prev.map((assignment) => (assignment.taskId === taskId ? { ...assignment, roleId, userId: "" } : assignment)),
    )
  }

  // Manejar cambio de usuario
  const handleUserChange = (taskId: string, userId: string) => {
    setAssignments((prev) =>
      prev.map((assignment) => (assignment.taskId === taskId ? { ...assignment, userId } : assignment)),
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="deadline">Fecha límite</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !deadline && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {deadline ? format(deadline, "PPP", { locale: es }) : "Seleccione una fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Asignación de roles y usuarios</h3>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarea</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Usuario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TASKS.map((task) => {
                  const assignment = assignments.find((a) => a.taskId === task.id)

                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>
                        <Select
                          value={assignment?.roleId || ""}
                          onValueChange={(value) => handleRoleChange(task.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione un rol" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={assignment?.userId || ""}
                          onValueChange={(value) => handleUserChange(task.id, value)}
                          disabled={!assignment?.roleId}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione un usuario" />
                          </SelectTrigger>
                          <SelectContent>
                            {USERS.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

