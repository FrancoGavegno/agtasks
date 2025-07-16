"use client"

import { useFormContext } from "react-hook-form"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import type { TaskFormValues } from "./validation-schemas"
import { useServiceForm } from "@/lib/contexts/service-form-context"
import { User } from "@/lib/interfaces"
import { listUsersByDomain } from "@/lib/integrations/360"
import ReactSelect, { SingleValue } from 'react-select'
import { listDomainForms } from "@/lib/services/agtasks"
import type { Form as DomainForm } from "@/lib/interfaces"

export default function Step3Tasks() {
  const { domain } = useParams<{ domain: string }>()
  const domainId = Number.parseInt(domain, 10)
  const form = useFormContext<any>()
  const { updateFormValues } = useServiceForm()
  const tasks = form.watch ? form.watch("tasks") : []
  const errors = form.formState?.errors
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState<string | null>(null)
  const [userSearch, setUserSearch] = useState<{ [index: number]: string }>({})
  const [forms, setForms] = useState<DomainForm[]>([])
  const [formsLoading, setFormsLoading] = useState(false)
  const [formsError, setFormsError] = useState<string | null>(null)

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

  useEffect(() => {
    if (!domainId) return
    const fetchForms = async () => {
      try {
        setFormsLoading(true)
        const formsData = await listDomainForms(domainId.toString())
        setForms(formsData)
        setFormsError(null)
      } catch (error) {
        setFormsError("Error al cargar formularios")
        setForms([])
      } finally {
        setFormsLoading(false)
      }
    }
    fetchForms()
  }, [domainId])
  
  // Eliminar este useEffect:
  // useEffect(() => {
  //   if (tasks && tasks.length > 0) {
  //     const fixed = (tasks as any[]).map((t: any) => ({
  //       ...t,
  //       formId: typeof t.formId === "string" ? t.formId : "",
  //     }))
  //     form.setValue("tasks", fixed, { shouldValidate: false })
  //   }
  // }, [tasks])

  const getFieldError = (index: number, field: "userEmail") => {
    // Solo mostrar errores si el campo ha sido tocado o si se ha intentado enviar el formulario
    const fieldErrors = (errors?.tasks as any)?.[index]?.[field]
    const isTouched = (form.formState.touchedFields.tasks as any)?.[index]?.[field]
    if (fieldErrors && (isTouched || form.formState.isSubmitted)) {
      return fieldErrors.message
    }
    return null
  }
  // Función para manejar la asignación de usuarios
  const handleUserAssignment = (taskIndex: number, user: string) => {
    const updatedTasks = [...tasks]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      userEmail: user,
    }

    // Marcar el campo como "touched"
    form.setValue(`tasks.${taskIndex}.userEmail`, user, {
      shouldValidate: true,
      shouldTouch: true,
    })

    // Update context
    updateFormValues({
      tasks: updatedTasks,
    })
  }

  // Si no hay tareas asignadas, mostrar mensaje
  if (!tasks || tasks.length === 0) {
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
      {/* <h3 className="text-lg font-medium">Asignación de tareas</h3> */}
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
                Formulario
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
            {(tasks as any[]).map((assignment: any, index: any) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {assignment.taskName}
                </td>
                  
                <td>
                {(assignment.taskType === "fieldvisit") ? (
                  <div className="min-w-[220px]">
                    <ReactSelect
                      classNamePrefix="react-select"
                      isClearable
                      isSearchable
                      isDisabled={formsLoading}
                      value={forms.find(f => f.id === assignment.formId) ? {
                        value: assignment.formId,
                        label: forms.find(f => f.id === assignment.formId)?.name || ""
                      } : undefined}
                      onChange={(option: SingleValue<{ value: string; label: string }>) => {
                        const updatedTasks = [...tasks]
                        updatedTasks[index] = {
                          ...updatedTasks[index],
                          formId: option ? option.value : ""
                        }
                        form.setValue(`tasks.${index}.formId`, option ? option.value : "", {
                          shouldValidate: true,
                          shouldTouch: true,
                        })
                        updateFormValues({ tasks: updatedTasks })
                      }}
                      options={forms.map(form => ({
                        value: form.id,
                        label: form.name
                      }))}
                      placeholder={formsLoading ? "Cargando..." : "Seleccionar formulario"}
                      noOptionsMessage={() => formsLoading ? "Cargando..." : "No hay formularios disponibles"}
                      menuPortalTarget={typeof window !== "undefined" ? document.body : undefined}
                      menuPosition="fixed"
                      styles={{
                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                        option: (base) => ({ ...base, fontSize: '0.875rem' }),
                        singleValue: (base) => ({ ...base, fontSize: '0.875rem' }),
                        input: (base) => ({ ...base, fontSize: '0.875rem' }),
                        placeholder: (base) => ({ ...base, fontSize: '0.875rem' }),
                      }}
                    />
                    {formsError && <p className="text-red-500 text-xs mt-1">{formsError}</p>}
                    {/* Mostrar error de validación de formId si existe */}
                    {errors?.tasks && Array.isArray(errors.tasks) && errors.tasks[index]?.formId && (
                      <p className="text-red-500 text-xs mt-1">{errors.tasks[index].formId.message}</p>
                    )}
                  </div>
                ) : "" }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="min-w-[220px]">
                    <ReactSelect
                      classNamePrefix="react-select"
                      isClearable
                      isSearchable
                      isDisabled={usersLoading}
                      value={users.find(u => u.email === assignment.userEmail) ? {
                        value: assignment.userEmail,
                        label: `${users.find(u => u.email === assignment.userEmail)?.firstName || ''} ${users.find(u => u.email === assignment.userEmail)?.lastName || ''} <${users.find(u => u.email === assignment.userEmail)?.email || ''}>`.trim()
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
                      styles={{
                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                        option: (base) => ({ ...base, fontSize: '0.875rem' }),
                        singleValue: (base) => ({ ...base, fontSize: '0.875rem' }),
                        input: (base) => ({ ...base, fontSize: '0.875rem' }),
                        placeholder: (base) => ({ ...base, fontSize: '0.875rem' }),
                      }}
                    />
                    {typeof getFieldError(index, "userEmail") === 'string' && (
                      <p className="text-red-500 text-xs">{getFieldError(index, "userEmail")}</p>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {errors?.tasks && !Array.isArray(errors.tasks) && typeof errors.tasks.message === 'string' && (
        <p className="text-red-500 mt-2">{errors.tasks.message}</p>
      )}
    </div>
  )
}
