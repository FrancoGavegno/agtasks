"use client"

import { useFormContext } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Step3FormValues } from "./validation-schemas"

// Datos de ejemplo para roles y usuarios
const roles = ["Agrónomo", "Técnico", "Supervisor", "Administrador", "Operario"]

const usersByRole = {
  Agrónomo: ["Juan Pérez", "María González", "Carlos Rodríguez"],
  Técnico: ["Ana Martínez", "Luis Sánchez", "Elena Díaz"],
  Supervisor: ["Roberto Fernández", "Sofía López"],
  Administrador: ["Miguel Torres", "Laura García"],
  Operario: ["Pedro Ramírez", "Javier Morales", "Lucía Vega", "Valentina Castro"],
}

export default function Step3Tasks() {
  const form = useFormContext<Step3FormValues>()
  const taskAssignments = form.watch ? form.watch("taskAssignments") : []
  const errors = form.formState?.errors

  // Función para manejar la asignación de roles
  const handleRoleAssignment = (taskIndex: number, role: string) => {
    const updatedTasks = [...taskAssignments]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      role,
      assignedTo: "", // Resetear el usuario asignado cuando cambia el rol
    }
    form.setValue("taskAssignments", updatedTasks, { shouldValidate: true })
  }

  // Función para manejar la asignación de usuarios
  const handleUserAssignment = (taskIndex: number, user: string) => {
    const updatedTasks = [...taskAssignments]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      assignedTo: user,
    }
    form.setValue("taskAssignments", updatedTasks, { shouldValidate: true })
  }

  // Función para verificar si hay un error en un campo específico
  const getFieldError = (index: number, field: "role" | "assignedTo") => {
    return errors?.taskAssignments?.[index]?.[field]?.message
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Asignación de tareas</h3>
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tarea
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Rol
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Asignado a
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {taskAssignments.map((assignment, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{assignment.task}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="space-y-1">
                    <Select value={assignment.role || ""} onValueChange={(value) => handleRoleAssignment(index, value)}>
                      <SelectTrigger className={`w-full ${getFieldError(index, "role") ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getFieldError(index, "role") && (
                      <p className="text-red-500 text-xs">{getFieldError(index, "role")}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="space-y-1">
                    <Select
                      value={assignment.assignedTo || ""}
                      onValueChange={(value) => handleUserAssignment(index, value)}
                      disabled={!assignment.role}
                    >
                      <SelectTrigger className={`w-full ${getFieldError(index, "assignedTo") ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Seleccionar usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        {assignment.role &&
                          usersByRole[assignment.role as keyof typeof usersByRole]?.map((user) => (
                            <SelectItem key={user} value={user}>
                              {user}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {getFieldError(index, "assignedTo") && (
                      <p className="text-red-500 text-xs">{getFieldError(index, "assignedTo")}</p>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {errors?.taskAssignments && !Array.isArray(errors.taskAssignments) && (
        <p className="text-red-500 mt-2">{errors.taskAssignments.message}</p>
      )}
    </div>
  )
}
