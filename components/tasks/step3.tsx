"use client"

import { 
  useEffect, 
  useState 
} from "react"
import { useParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { useTaskForm } from "@/lib/contexts/tasks-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/components/ui/select"
import { listUsersByDomain } from "@/lib/integrations/360"
// import { User } from "@/lib/interfaces/360"
import ReactSelect, { SingleValue } from 'react-select'
import { Service } from "@/lib/schemas"


interface Step3DetailsProps {
  services: Service[]
  projectName: string
  mode?: 'create' | 'edit'
}

export default function Step3Details({ services, projectName, mode }: Step3DetailsProps) {

  const { register, setValue, watch } = useFormContext()
  const { 
    mode: contextMode,
    tempUserEmail,
    setTempUserEmail,
    users,
    setUsers,
    hasLoadedUsers,
    setHasLoadedUsers
  } = useTaskForm()
  const { domain } = useParams<{ domain: string }>()
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState<string | null>(null)
  const selectedService = watch("serviceId")
  
  // Usar email temporal si está disponible, sino usar el del formulario
  const selectedUserEmail = tempUserEmail || watch("userEmail")
  
  // Use context mode if not provided as prop
  const currentMode = mode || contextMode
  const isEditMode = currentMode === 'edit'

  useEffect(() => {
    // Solo cargar usuarios en modo creación, no en modo edición
    if (isEditMode) {
      return
    }

    const fetchUsers = async () => {
      if (hasLoadedUsers) {
        setUsersLoading(false)
        return
      }
      
      try {
        setUsersLoading(true)
        const usersData = await listUsersByDomain(Number(domain))
        if (usersData && usersData.length > 0) {
          const sortedUsers = [...usersData].sort((a, b) => {
            const fullNameA = `${a.firstName} ${a.lastName}`.trim()
            const fullNameB = `${b.firstName} ${b.lastName}`.trim()
            return fullNameA.localeCompare(fullNameB)
          })
          setUsers(sortedUsers)
          setUsersError(null)
          setHasLoadedUsers(true)
        } else {
          setUsers([])
          setUsersError("No users found for this domain")
        }
      } catch (error) {
        console.error("Error fetching users:", error)
        setUsersError("Failed to load users. Please try again later.")
        setUsers([])
      } finally {
        setUsersLoading(false)
      }
    }

    if (domain && !hasLoadedUsers) {
      fetchUsers()
    } else if (hasLoadedUsers) {
      setUsersLoading(false)
    }
  }, [domain, hasLoadedUsers]) // Removidos setters del contexto para evitar renderizado infinito

  // En modo edición, mostrar el usuario asignado como texto simple
  if (isEditMode) {
    return (
      <div className="space-y-4">
        <div>
          <Label>Proyecto</Label>
          <Input value={projectName} disabled />
        </div>
        {/* <div>
          <Label>Servicio</Label>
          <Select
            value={selectedService || "none"}
            onValueChange={v => setValue("serviceId", v === "none" ? undefined : v)}
            required={false}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un servicio (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin servicio</SelectItem>
              {Array.isArray(services) && services.length > 0 ? (
                services
                  .filter(service => typeof service.id === 'string' && service.id.trim() !== '')
                  .map(service => (
                    <SelectItem key={service.id!} value={service.id!}>
                     {service.requestId} {service.name}
                    </SelectItem>
                  ))
              ) : (
                <SelectItem value="no-services" disabled>No hay servicios disponibles</SelectItem>
              )}
            </SelectContent>
          </Select>
          {!Array.isArray(services) && (
            <p className="text-red-500 text-xs mt-1">Error: No se pudieron cargar los servicios</p>
          )}
          {Array.isArray(services) && services.length === 0 && (
            <p className="text-muted-foreground text-xs mt-1">No hay servicios configurados para este proyecto</p>
          )}
        </div> */}
        <div className="text-sm">
          <Label>Usuario asignado</Label>
          <Input 
            value={selectedUserEmail || "No asignado"} 
            disabled 
            className="bg-gray-50"
          />
        </div>
      </div>
    )
  }

  // En modo creación, mantener la funcionalidad original
  return (
    <div className="space-y-4">
      <div>
        <Label>Proyecto</Label>
        <Input value={projectName} disabled />
      </div>
      {/* <div>
        <Label>Servicio</Label>
        <Select
          value={selectedService || "none"}
          onValueChange={v => setValue("serviceId", v === "none" ? undefined : v)}
          required={false}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un servicio (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin servicio</SelectItem>
            {Array.isArray(services) && services.length > 0 ? (
              services
                .filter(service => typeof service.id === 'string' && service.id.trim() !== '')
                .map(service => (
                  <SelectItem key={service.id!} value={service.id!}>
                   {service.requestId} {service.name}
                  </SelectItem>
                ))
            ) : (
              <SelectItem value="no-services" disabled>No hay servicios disponibles</SelectItem>
            )}
          </SelectContent>
        </Select>
        {!Array.isArray(services) && (
          <p className="text-red-500 text-xs mt-1">Error: No se pudieron cargar los servicios</p>
        )}
        {Array.isArray(services) && services.length === 0 && (
          <p className="text-muted-foreground text-xs mt-1">No hay servicios configurados para este proyecto</p>
        )}
      </div> */}
      <div className="text-sm">
        <Label>Usuario asignado *</Label>
        <ReactSelect
          classNamePrefix="react-select"
          isClearable
          isSearchable
          isDisabled={usersLoading}
          value={Array.isArray(users) && users.find(u => u.email === selectedUserEmail) ? {
            value: selectedUserEmail,
            label: `${users.find(u => u.email === selectedUserEmail)?.firstName || ''} ${users.find(u => u.email === selectedUserEmail)?.lastName || ''} <${users.find(u => u.email === selectedUserEmail)?.email || ''}>`.trim()
          } : undefined}
          onChange={(option: SingleValue<{ value: string; label: string }>) => {
            const email = option ? option.value : ""
            setValue("userEmail", email)
          }}
          options={Array.isArray(users) ? users.map(user => ({
            value: user.email,
            label: `${user.firstName} ${user.lastName} <${user.email}>`.trim()
          })) : []}
          placeholder={usersLoading ? "Cargando..." : "Seleccionar usuario"}
          noOptionsMessage={() => usersLoading ? "Cargando..." : "No hay usuarios disponibles"}
          menuPortalTarget={typeof window !== "undefined" ? document.body : undefined}
          menuPosition="fixed"
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />
        {usersError && <p className="text-red-500 text-xs mt-1">{usersError}</p>}
        {!Array.isArray(users) && !usersLoading && (
          <p className="text-red-500 text-xs mt-1">Error: No se pudieron cargar los usuarios</p>
        )}
      </div>
    </div>
  )
} 