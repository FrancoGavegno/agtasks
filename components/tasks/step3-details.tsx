"use client"
import { useFormContext } from "react-hook-form"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams } from "next/navigation"
import { listUsersByDomain } from "@/lib/integrations/360"
import { User } from "@/lib/interfaces"
import ReactSelect, { SingleValue } from 'react-select'

export default function Step3Details({ services, projectName }: { services: any[], projectName: string }) {
  const { register, setValue, watch } = useFormContext()
  const { domain } = useParams<{ domain: string }>()
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState<string | null>(null)
  const selectedService = watch("serviceId")
  const selectedUserEmail = watch("userEmail")

  useEffect(() => {
    const fetchUsers = async () => {
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
        } else {
          setUsers([])
        }
        setUsersError(null)
      } catch (error) {
        setUsersError("Failed to load users. Please try again later.")
        setUsers([])
      } finally {
        setUsersLoading(false)
      }
    }
    fetchUsers()
  }, [domain])

  return (
    <div className="space-y-4">
      <div>
        <Label>Proyecto</Label>
        <Input value={projectName} disabled />
      </div>
      <div>
        <Label>Servicio</Label>
        <Select
          value={selectedService || "none"}
          onValueChange={v => setValue("serviceId", v === "none" ? "" : v)}
          required={false}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un servicio (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin servicio</SelectItem>
            {services.map(service => (
              <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Usuario asignado *</Label>
        <ReactSelect
          classNamePrefix="react-select"
          isClearable
          isSearchable
          isDisabled={usersLoading}
          value={users.find(u => u.email === selectedUserEmail) ? {
            value: selectedUserEmail,
            label: `${users.find(u => u.email === selectedUserEmail)?.firstName || ''} ${users.find(u => u.email === selectedUserEmail)?.lastName || ''} <${users.find(u => u.email === selectedUserEmail)?.email || ''}>`.trim()
          } : undefined}
          onChange={(option: SingleValue<{ value: string; label: string }>) => setValue("userEmail", option ? option.value : "")}
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
        {usersError && <p className="text-red-500 text-xs mt-1">{usersError}</p>}
      </div>
    </div>
  )
} 