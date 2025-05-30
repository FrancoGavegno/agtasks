"use client"

import { useFormContext } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import type { Step3FormValues } from "./validation-schemas"
import { useServiceForm } from "@/lib/contexts/service-form-context"
// import type { Role } from "@/lib/interfaces"
import { User } from "@/lib/interfaces"
import { listUsersByDomain } from "@/lib/integrations/360"

export default function Step3Tasks() {
  const { domain } = useParams<{ domain: string }>()
  //const domainId = domain
  const domainId = Number.parseInt(domain, 10)
  const form = useFormContext<Step3FormValues>()
  const { updateFormValues } = useServiceForm()
  const taskAssignments = form.watch ? form.watch("taskAssignments") : []
  const errors = form.formState?.errors
  
  // Estado para roles y usuarios
  // const [roles, setRoles] = useState<Role[]>([])
  const [users, setUsers] = useState<User[]>([])

  // Estados de carga
  // const [rolesLoading, setRolesLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(true)

  // Estados de error
  // const [rolesError, setRolesError] = useState<string | null>(null)
  const [usersError, setUsersError] = useState<string | null>(null)

  // Cargar roles desde la API
  // useEffect(() => {
  //   const fetchRoles = async () => {
  //     try {
  //       setRolesLoading(true)
  //       const res = await fetch(`/api/v1/agtasks/domains/${domainId}/roles`)
  //       if (!res.ok) {
  //         throw new Error(`Error fetching roles: ${res.status}`)
  //       }
  //       const data = await res.json()
  //       const rolesData = Array.isArray(data) ? data : []
  //       const sortedRoles = [...rolesData].sort((a, b) => a.name.localeCompare(b.name))
  //       setRoles(sortedRoles)
  //       setRolesError(null)
  //     } catch (error) {
  //       console.error("Error fetching roles:", error)
  //       setRolesError("Failed to load roles. Please try again later.")
  //       setRoles([])
  //     } finally {
  //       setRolesLoading(false)
  //     }
  //   }

  //   fetchRoles()
  // }, [domainId])

  // Cargar usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true)
        // const domainIdNumber = Number.parseInt(domainId, 10)
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

  // Función para verificar si hay un error en un campo específico
  // const getFieldError = (index: number, field: "role" | "assignedTo") => {
  //   // Solo mostrar errores si el campo ha sido tocado o si se ha intentado enviar el formulario
  //   const fieldErrors = errors?.taskAssignments?.[index]?.[field]
  //   const isTouched = form.formState.touchedFields.taskAssignments?.[index]?.[field]

  //   if (fieldErrors && (isTouched || form.formState.isSubmitted)) {
  //     return fieldErrors.message
  //   }

  //   return null
  // }
  
  const getFieldError = (index: number, field: "assignedTo") => {
    // Solo mostrar errores si el campo ha sido tocado o si se ha intentado enviar el formulario
    const fieldErrors = errors?.taskAssignments?.[index]?.[field]
    const isTouched = form.formState.touchedFields.taskAssignments?.[index]?.[field]
    if (fieldErrors && (isTouched || form.formState.isSubmitted)) {
      return fieldErrors.message
    }
    return null
  }

  // Función para manejar la asignación de roles
  // const handleRoleAssignment = (taskIndex: number, role: string) => {
  //   const updatedTasks = [...taskAssignments]
  //   updatedTasks[taskIndex] = {
  //     ...updatedTasks[taskIndex],
  //     role,
  //     assignedTo: "", // Resetear el usuario asignado cuando cambia el rol
  //   }

  //   // Marcar el campo como "touched"
  //   form.setValue(`taskAssignments.${taskIndex}.role`, role, {
  //     shouldValidate: true,
  //     shouldTouch: true,
  //   })

  //   // Resetear el campo de usuario asignado
  //   form.setValue(`taskAssignments.${taskIndex}.assignedTo`, "", {
  //     shouldValidate: false,
  //   })

  //   // Update context
  //   updateFormValues({
  //     taskAssignments: updatedTasks,
  //   })
  // }

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

  // Función para obtener usuarios por rol
  // const getUsersByRole = (roleId: string) => {
  //   // En este caso, no filtramos por rol ya que no tenemos esa relación en los datos
  //   // Simplemente devolvemos todos los usuarios disponibles
  //   return users
  // }

  // console.log("taskAssignments en step3:", taskAssignments)
  // console.log("users: ", users)

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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{assignment.task}</td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                        {rolesError ? (
                          <div className="p-2 text-red-500 text-sm">{rolesError}</div>
                        ) : roles.length === 0 ? (
                          <div className="p-2 text-muted-foreground text-sm">No hay roles disponibles</div>
                        ) : (
                          roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {getFieldError(index, "role") && (
                      <p className="text-red-500 text-xs">{getFieldError(index, "role")}</p>
                    )}
                  </div>
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="space-y-1">
                    <Select
                      value={assignment.assignedTo || ""}
                      onValueChange={(value) => handleUserAssignment(index, value)}
                      // disabled={!assignment.role || usersLoading}
                      disabled={usersLoading}
                    >
                      <SelectTrigger className={`w-full ${getFieldError(index, "assignedTo") ? "border-red-500" : ""}`}>
                        <SelectValue placeholder={usersLoading ? "Cargando..." : "Seleccionar usuario"} />
                      </SelectTrigger>
                      <SelectContent>
                        {usersError ? (
                          <div className="p-2 text-red-500 text-sm">{usersError}</div>
                        ) : users.length === 0 ? (
                          <div className="p-2 text-muted-foreground text-sm">No hay usuarios disponibles</div>
                        ) : (
                          users.map((user) => (
                            <SelectItem key={user.email} value={user.email}>
                              {`${user.firstName} ${user.lastName}`.trim()}
                            </SelectItem>
                          ))
                          // getUsersByRole(assignment.role).map((user) => (
                          //   <SelectItem key={user.email} value={user.email}>
                          //     {`${user.firstName} ${user.lastName}`.trim()}
                          //   </SelectItem>
                          // ))
                        )}
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
