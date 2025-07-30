"use client"

import {
  useState,
  useEffect,
  useRef
} from "react"
import { useFormContext } from "react-hook-form"
import { useParams } from "next/navigation"
import { useServiceForm } from "@/lib/contexts/services-context"
import { listUsersByDomain } from "@/lib/integrations/360"
import ReactSelect, { SingleValue } from 'react-select'
import { apiClient } from "@/lib/integrations/amplify"
import { Checkbox } from "@/components/ui/checkbox"

export default function Step3() {
  const {
    setValue,
    watch,
    formState: { errors }
  } = useFormContext()

  const {
    hasLoadedUsers,
    setHasLoadedUsers,
    hasLoadedForms,
    setHasLoadedForms,
    users,
    setUsers,
    forms,
    setForms,
    enabledTasks,
    setEnabledTasks,
    protocolTasks,
    protocols
  } = useServiceForm()

  const params = useParams()
  const domainId = Number(params.domain)
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState<string | null>(null)
  const [formsLoading, setFormsLoading] = useState(false)
  const [formsError, setFormsError] = useState<string | null>(null)

  // Watch form values
  const tasks = watch("tasks")
  const protocolId = watch("protocolId")

  const selectAllRef = useRef<HTMLInputElement>(null)
  const hasInitializedTasks = useRef(false)

  // Inicializar todas las tareas como habilitadas cuando se cargan las tareas por primera vez
  useEffect(() => {
    if (tasks && tasks.length > 0 && !hasInitializedTasks.current) {
      const allTaskIndices = new Set<number>(tasks.map((_: any, index: number) => index))
      setEnabledTasks(allTaskIndices)
      hasInitializedTasks.current = true
    }
  }, [tasks?.length, setEnabledTasks]) // Changed from 'tasks' to 'tasks?.length' to only trigger when tasks array length changes

  // Reset initialization flag when tasks change (e.g., when protocol changes)
  useEffect(() => {
    hasInitializedTasks.current = false
  }, [protocolId])

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
        const formsData = await apiClient.listDomainForms(domainId.toString())
        setForms(formsData.items || [])
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

  const handleTaskUserChange = (taskIndex: number, userEmail: string) => {
    const updatedTasks = [...(tasks || [])]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      userEmail
    }
    setValue("tasks", updatedTasks)
  }

  const handleTaskFormChange = (taskIndex: number, formId: string) => {
    const updatedTasks = [...(tasks || [])]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      formId
    }
    setValue("tasks", updatedTasks)
  }

  const toggleTaskEnabled = (taskIndex: number) => {
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
                      onCheckedChange={() => toggleTaskEnabled(index)}
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
                            handleTaskFormChange(index, option ? option.value : "")
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
                        onChange={(option: SingleValue<{ value: string; label: string }>) => handleTaskUserChange(index, option ? option.value : "")}
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
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Validación de tareas habilitadas */}
      {errors?.tasks && !Array.isArray(errors.tasks) && typeof errors.tasks.message === 'string' && (
        <p className="text-red-500 mt-2">{errors.tasks.message}</p>
      )}
      
      {/* Mostrar errores específicos de cada tarea */}
      {Array.isArray(errors.tasks) && errors.tasks.map((taskError: any, index: number) => {
        if (!taskError) return null
        
        return (
          <div key={index} className="mt-2">
            {taskError.userEmail && (
              <p className="text-red-500 text-sm">Tarea {index + 1}: {taskError.userEmail.message}</p>
            )}
            {taskError.formId && (
              <p className="text-red-500 text-sm">Tarea {index + 1}: {taskError.formId.message}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

