"use client"

import { useFormContext } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Step3FormValues } from "./validation-schemas"
import { useServiceForm } from "@/lib/contexts/service-form-context"

export default function Step3Tasks() {
  const form = useFormContext<Step3FormValues>()
  const { roles, getUsersByRole, rolesLoading, usersLoading, updateFormValues } = useServiceForm()
  const taskAssignments = form.watch ? form.watch("taskAssignments") : []
  const errors = form.formState?.errors

  // Función para verificar si hay un error en un campo específico
  const getFieldError = (index: number, field: "role" | "assignedTo") => {
    // Mostrar errores cuando existan, independientemente del estado touched
    const fieldErrors = errors?.taskAssignments?.[index]?.[field]

    if (fieldErrors) {
      return fieldErrors.message
    }

    return null
  }

  // Función para manejar la asignación de roles
  const handleRoleAssignment = (taskIndex: number, role: string) => {
    const updatedTasks = [...taskAssignments]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      role,
      assignedTo: "", // Resetear el usuario asignado cuando cambia el rol
    }

    // Marcar el campo como "touched"
    form.setValue(`taskAssignments.${taskIndex}.role`, role, {
      shouldValidate: true,
      shouldTouch: true,
    })

    // Resetear el campo de usuario asignado
    form.setValue(`taskAssignments.${taskIndex}.assignedTo`, "", {
      shouldValidate: false,
    })

    // Update context
    updateFormValues({
      taskAssignments: updatedTasks,
    })
  }

  // Función para manejar la asignación de usuarios
  const handleUserAssignment = (taskIndex: number, user: string) => {
    const updatedTasks = [...taskAssignments]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      assignedTo: user,
    }

    // Marcar el campo como "touched"
    form.setValue(`taskAssignments.${taskIndex}.assignedTo`, user, {
      shouldValidate: true,
      shouldTouch: true,
    })

    // Update context
    updateFormValues({
      taskAssignments: updatedTasks,
    })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Asigne roles y usuarios a cada tarea</h3>
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
                    <Select
                      value={assignment.role || ""}
                      onValueChange={(value) => handleRoleAssignment(index, value)}
                      disabled={rolesLoading}
                    >
                      <SelectTrigger className={`w-full ${getFieldError(index, "role") ? "border-red-500" : ""}`}>
                        <SelectValue placeholder={rolesLoading ? "Cargando..." : "Seleccionar rol"} />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
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
                      disabled={!assignment.role || usersLoading}
                    >
                      <SelectTrigger className={`w-full ${getFieldError(index, "assignedTo") ? "border-red-500" : ""}`}>
                        <SelectValue placeholder={usersLoading ? "Cargando..." : "Seleccionar usuario"} />
                      </SelectTrigger>
                      <SelectContent>
                        {assignment.role &&
                          getUsersByRole(assignment.role).map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
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
      {/* Mensaje de error general para tareas */}
      {errors?.taskAssignments && !Array.isArray(errors.taskAssignments) && (
        <p className="text-red-500 mt-2">{errors.taskAssignments.message}</p>
      )}
      {/* Mensaje adicional para guiar al usuario */}
      {taskAssignments.some((task) => task.role && !task.assignedTo) && (
        <p className="text-amber-500 mt-2">Debe asignar usuarios a todas las tareas con roles seleccionados</p>
      )}
    </div>
  )
}
