"use client"

import { 
  useState, 
  useEffect,
  useRef
} from "react"
import { useFormContext } from "react-hook-form"
import { useParams } from "next/navigation"
import { useServiceForm } from "@/lib/contexts/service-form-context"
import { User } from "@/lib/interfaces/360"
import { listUsersByDomain } from "@/lib/integrations/360"
import ReactSelect, { SingleValue } from 'react-select'
import { listDomainForms } from "@/lib/services/agtasks"
import type { Form as DomainForm } from "@/lib/interfaces/agtasks"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  FormField, 
  FormItem, 
  FormMessage 
} from "@/components/ui/form"
import { validateEnabledTasks } from "@/lib/schemas"

export default function Step3Tasks() {
  const { domain } = useParams<{ domain: string }>()
  const domainId = Number.parseInt(domain, 10)
  const form = useFormContext<any>()
  const { 
    updateFormValues, 
    formValues,
    hasLoadedUsers,
    hasLoadedForms,
    setHasLoadedUsers,
    setHasLoadedForms,
    users,
    setUsers,
    forms,
    setForms,
    enabledTasks,
    setEnabledTasks
  } = useServiceForm()
  const tasks = form.watch ? form.watch("tasks") : []
  const errors = form.formState?.errors
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState<string | null>(null)
  const [userSearch, setUserSearch] = useState<{ [index: number]: string }>({})
  const [formsLoading, setFormsLoading] = useState(false)
  const [formsError, setFormsError] = useState<string | null>(null)

  const selectAllRef = useRef<HTMLInputElement>(null)

  // Validación contextual de tareas habilitadas
  const contextualErrors = validateEnabledTasks(tasks, enabledTasks)

  // Inicializar todas las tareas como habilitadas cuando se cargan las tareas por primera vez
  useEffect(() => {
    if (tasks && tasks.length > 0 && enabledTasks.size === 0) {
      const allTaskIndices = new Set<number>(tasks.map((_: any, index: number) => index))
      setEnabledTasks(allTaskIndices)
    }
  }, [tasks, enabledTasks.size, setEnabledTasks])

  // Manejar estado indeterminado del checkbox "Seleccionar todos"
  const allTaskIndices = tasks ? tasks.map((_: any, index: number) => index) : []
  const allEnabled = allTaskIndices.length > 0 && allTaskIndices.every((index: number) => enabledTasks.has(index))
  const someEnabled = allTaskIndices.some((index: number) => enabledTasks.has(index)) && !allEnabled

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someEnabled
    }
  }, [someEnabled])

  // Cargar usuarios desde la API solo si no se han cargado antes
  useEffect(() => {
    const fetchUsers = async () => {
      if (!domainId) return
      
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
        setHasLoadedUsers(true)
      } catch (error) {
        console.error("Error fetching users:", error)
        setUsersError("Failed to load users. Please try again later.")
        setUsers([])
      } finally {
        setUsersLoading(false)
      }
    }

    if (!hasLoadedUsers) {
      fetchUsers()
    } else {
      setUsersLoading(false)
    }
  }, [domainId, hasLoadedUsers, setHasLoadedUsers, setUsers])

  // Cargar formularios solo si no se han cargado antes
  useEffect(() => {
    if (!domainId) return
    
    const fetchForms = async () => {
      try {
        setFormsLoading(true)
        const formsData = await listDomainForms(domainId.toString())
        setForms(formsData)
        setFormsError(null)
        setHasLoadedForms(true)
      } catch (error) {
        setFormsError("Error al cargar formularios")
        setForms([])
      } finally {
        setFormsLoading(false)
      }
    }
    
    if (!hasLoadedForms) {
      fetchForms()
    } else {
      setFormsLoading(false)
    }
  }, [domainId, hasLoadedForms, setHasLoadedForms, setForms])

  const getFieldError = (index: number, field: "userEmail" | "formId") => {
    // Usar validación contextual para tareas habilitadas
    const contextualError = contextualErrors[`tasks.${index}.${field}`]
    if (contextualError) {
      return contextualError
    }
    
    // Fallback a validación del formulario si existe
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

  // Función para manejar la selección individual de tareas
  const handleTaskSelection = (taskIndex: number) => {
    const newEnabledTasks = new Set(enabledTasks)
    if (newEnabledTasks.has(taskIndex)) {
      newEnabledTasks.delete(taskIndex)
    } else {
      newEnabledTasks.add(taskIndex)
    }
    setEnabledTasks(newEnabledTasks)
  }

  // Función para manejar la selección/deselección de todas las tareas
  const handleToggleAllTasks = () => {
    if (allEnabled) {
      // Deshabilitar todas las tareas
      setEnabledTasks(new Set())
    } else {
      // Habilitar todas las tareas
      const allTaskIndices = tasks.map((_: any, index: number) => index)
      setEnabledTasks(new Set<number>(allTaskIndices))
    }
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
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <input
                  type="checkbox"
                  ref={selectAllRef}
                  checked={allEnabled}
                  onChange={handleToggleAllTasks}
                  aria-label="Seleccionar todas las tareas"
                  className="h-4 w-4 accent-primary rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </th>
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
                Formulario <span className="text-red-700 font-medium">*</span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Asignado a <span className="text-red-700 font-medium">*</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(tasks as any[]).map((assignment: any, index: any) => {
              const isTaskEnabled = enabledTasks.has(index)
              return (
                <tr key={index} className={!isTaskEnabled ? "opacity-50" : ""}>
                  <td className="px-6 whitespace-nowrap">
                    <Checkbox
                      id={`task-${index}`}
                      checked={isTaskEnabled}
                      onCheckedChange={() => handleTaskSelection(index)}
                    />
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {assignment.taskName}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                  {(assignment.taskType === "fieldvisit") ? (
                    <div className="min-w-[220px]">
                      <ReactSelect
                        classNamePrefix="react-select"
                        isClearable
                        isSearchable
                        isDisabled={formsLoading || !isTaskEnabled}
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
                    {isTaskEnabled && getFieldError(index, "formId") && (
                      <p className="text-red-500 text-xs mt-1">{getFieldError(index, "formId")}</p>
                    )}
                  </div>
                ) : "" }
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                  <div className="min-w-[220px]">
                      <ReactSelect
                        classNamePrefix="react-select"
                        isClearable
                        isSearchable
                        isDisabled={usersLoading || !isTaskEnabled}
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
                    {isTaskEnabled && getFieldError(index, "userEmail") && (
                      <p className="text-red-500 text-xs mt-1">{getFieldError(index, "userEmail")}</p>
                    )}
                  </div>
                </td>
              </tr>
            )
            })}
          </tbody>
        </table>
      </div>

      {/* Validación de tareas habilitadas */}
      <FormField
        control={form.control}
        name="enabledTasks"
        render={({ field, fieldState }) => (
          <FormItem>
            {enabledTasks.size === 0 && (
              <FormMessage className="text-red-500">
                Al menos una tarea debe estar habilitada para continuar.
              </FormMessage>
            )}
          </FormItem>
        )}
      />

      {errors?.tasks && !Array.isArray(errors.tasks) && typeof errors.tasks.message === 'string' && (
        <p className="text-red-500 mt-2">{errors.tasks.message}</p>
      )}
    </div>
  )
}
