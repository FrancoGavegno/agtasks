"use client"

import { useFormContext } from "react-hook-form"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import type { Step3FormValues } from "./validation-schemas"
import { useServiceForm } from "@/lib/contexts/service-form-context"
import { User } from "@/lib/interfaces"
import { listUsersByDomain } from "@/lib/integrations/360"
import ReactSelect, { SingleValue } from 'react-select'

export default function Step3Tasks() {
  const { domain } = useParams<{ domain: string }>()
  const domainId = Number.parseInt(domain, 10)
  const form = useFormContext<Step3FormValues>()
  const { updateFormValues } = useServiceForm()
  const taskAssignments = form.watch ? form.watch("taskAssignments") : []
  const errors = form.formState?.errors
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState<string | null>(null)
  const [userSearch, setUserSearch] = useState<{ [index: number]: string }>({})

  // Cargar usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true)
        const usersData = await listUsersByDomain(domainId)
        if (usersData && usersData.length > 0) {
          // Ordenar usuarios alfabéticamente por nombre completo
          const sortedUsers = [...usersData].sort((a, b) => {
            const fullNameA = `${a.firstName} ${a.lastName}`.trim()
            const fullNameB = `${b.firstName} ${b.lastName}`.trim()
            return fullNameA.localeCompare(fullNameB)
          })
          setUsers(sortedUsers)
        } else {
          setUsers([])
        }
        setUsersError(null)
      } catch (error) {
        console.error("Error fetching users:", error)
        setUsersError("Failed to load users. Please try again later.")
        setUsers([])
      } finally {
        setUsersLoading(false)
      }
    }

    fetchUsers()
  }, [domainId])
  
  // Validar que todas las tareas tengan usuario asignado antes de permitir avanzar
  useEffect(() => {
    if (taskAssignments && taskAssignments.length > 0) {
      const allAssigned = taskAssignments.every((t) => t.assignedTo && t.assignedTo.length > 0)
      if (!allAssigned) {
        form.setError("taskAssignments", { type: "manual", message: "Todas las tareas deben tener un usuario asignado" })
      } else {
        form.clearErrors("taskAssignments")
      }
    }
  }, [taskAssignments])

  const getFieldError = (index: number, field: "assignedTo") => {
    // Solo mostrar errores si el campo ha sido tocado o si se ha intentado enviar el formulario
    const fieldErrors = errors?.taskAssignments?.[index]?.[field]
    const isTouched = form.formState.touchedFields.taskAssignments?.[index]?.[field]
    if (fieldErrors && (isTouched || form.formState.isSubmitted)) {
      return fieldErrors.message
    }
    return null
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

  // Si no hay tareas asignadas, mostrar mensaje
  if (!taskAssignments || taskAssignments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No hay tareas disponibles. Por favor, seleccione un protocolo en el paso 1.</p>
        <p className="mt-2 text-sm">
          Si ya seleccionó un protocolo, intente volver al paso 1 y seleccionarlo nuevamente.
        </p>
      </div>
    )
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
              {/* <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Rol
              </th> */}
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {assignment.task}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="space-y-1">
                    <ReactSelect
                      classNamePrefix="react-select"
                      isClearable
                      isSearchable
                      isDisabled={usersLoading}
                      value={users.find(u => u.email === assignment.assignedTo) ? {
                        value: assignment.assignedTo,
                        label: `${users.find(u => u.email === assignment.assignedTo)?.firstName || ''} ${users.find(u => u.email === assignment.assignedTo)?.lastName || ''} <${users.find(u => u.email === assignment.assignedTo)?.email || ''}>`.trim()
                      } : undefined}
                      onChange={(option: SingleValue<{ value: string; label: string }>) => handleUserAssignment(index, option ? option.value : "")}
                      options={users.map(user => ({
                        value: user.email,
                        label: `${user.firstName} ${user.lastName} <${user.email}>`.trim()
                      }))}
                      placeholder={usersLoading ? "Cargando..." : "Seleccionar usuario"}
                      noOptionsMessage={() => usersLoading ? "Cargando..." : "No hay usuarios disponibles"}
                      menuPortalTarget={typeof window !== "undefined" ? document.body : undefined}
                      menuPosition="fixed"
                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    />
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
