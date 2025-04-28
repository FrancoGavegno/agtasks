"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Protocol, Role, Form } from "@/lib/interfaces"
import { listAssets } from "@/lib/integrations/kobotoolbox"

// Interfaz genérica para el contexto de configuraciones
interface SettingsContextType {
  // Datos de protocolos
  protocols: Protocol[]
  allProtocols: Protocol[]
  selectedProtocols: string[]
  protocolsLoading: boolean
  setProtocols: (protocols: Protocol[]) => void
  setAllProtocols: (protocols: Protocol[]) => void
  setSelectedProtocols: (ids: string[]) => void
  refreshProtocols: () => void
  isRefreshingProtocols: boolean

  // Datos de roles
  roles: Role[]
  allRoles: Role[]
  selectedRoles: string[]
  rolesLoading: boolean
  setRoles: (roles: Role[]) => void
  setAllRoles: (roles: Role[]) => void
  setSelectedRoles: (ids: string[]) => void
  refreshRoles: () => void
  isRefreshingRoles: boolean

  // Datos de formularios
  forms: Form[]
  allForms: Form[]
  selectedForms: string[]
  formsLoading: boolean
  setForms: (forms: Form[]) => void
  setAllForms: (forms: Form[]) => void
  setSelectedForms: (ids: string[]) => void
  refreshForms: () => void
  isRefreshingForms: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Estado para protocolos
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [allProtocols, setAllProtocols] = useState<Protocol[]>([])
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([])
  const [protocolsLoading, setProtocolsLoading] = useState(true)
  const [isRefreshingProtocols, setIsRefreshingProtocols] = useState(false)
  const [shouldRefetchProtocols, setShouldRefetchProtocols] = useState(true)

  // Estado para roles
  const [roles, setRoles] = useState<Role[]>([])
  const [allRoles, setAllRoles] = useState<Role[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [rolesLoading, setRolesLoading] = useState(true)
  const [isRefreshingRoles, setIsRefreshingRoles] = useState(false)
  const [shouldRefetchRoles, setShouldRefetchRoles] = useState(true)

  // Estado para formularios
  const [forms, setForms] = useState<Form[]>([])
  const [allForms, setAllForms] = useState<Form[]>([])
  const [selectedForms, setSelectedForms] = useState<string[]>([])
  const [formsLoading, setFormsLoading] = useState(true)
  const [isRefreshingForms, setIsRefreshingForms] = useState(false)
  const [shouldRefetchForms, setShouldRefetchForms] = useState(true)

  // Fetch domain protocols
  useEffect(() => {
    const fetchDomainProtocols = async () => {
      if (!shouldRefetchProtocols && protocols.length > 0) return

      try {
        setProtocolsLoading(true)
        const res = await fetch("/api/domain-protocol?domainId=dd8ae98f-2231-444e-8daf-120a4c416d15")
        const data = await res.json()
        setProtocols(data.data)
        setSelectedProtocols(data.data.map((p: Protocol) => p.tmProtocolId))
        setShouldRefetchProtocols(false)
      } catch (error) {
        console.error("Error fetching protocols:", error)
      } finally {
        setProtocolsLoading(false)
      }
    }

    fetchDomainProtocols()
  }, [shouldRefetchProtocols, protocols.length])

  // Fetch all protocols
  useEffect(() => {
    const fetchAllProtocols = async () => {
      if (allProtocols.length > 0 || protocols.length === 0) return

      try {
        const res = await fetch("/api/tm-protocol?projectId=TEM&queueId=82")
        const data = await res.json()

        // Mapear los datos de tm-protocol y buscar el id correspondiente en protocols
        const newProtocols = data.data.values.map((protocol: any) => {
          // Buscar el protocolo en protocols que coincida con tmProtocolId
          const matchingProtocol = protocols.find((p) => p.tmProtocolId === protocol.key)

          return {
            id: matchingProtocol ? matchingProtocol.id : protocol.id,
            name: protocol.fields.summary,
            language: protocol.fields.labels[0] || "N/A",
            tmProtocolId: protocol.key,
          }
        })

        setAllProtocols(newProtocols)
      } catch (error) {
        console.error("Error fetching task manager protocols:", error)
      }
    }

    fetchAllProtocols()
  }, [protocols, allProtocols.length])

  // Fetch domain roles
  useEffect(() => {
    const fetchDomainRoles = async () => {
      if (!shouldRefetchRoles && roles.length > 0) return

      try {
        setRolesLoading(true)
        const res = await fetch("/api/domain-role?domainId=dd8ae98f-2231-444e-8daf-120a4c416d15")
        const data = await res.json()

        // Ensure we have unique roles (no duplicates with same name and language)
        const uniqueRoles = data.data.reduce((acc: Role[], current: Role) => {
          const isDuplicate = acc.find(
            (item) => item.name === current.name && item.language.toLowerCase() === current.language.toLowerCase(),
          )
          if (!isDuplicate) {
            return acc.concat([current])
          }
          return acc
        }, [])

        setRoles(uniqueRoles)
        setSelectedRoles(uniqueRoles.map((r: Role) => r.id))
        setShouldRefetchRoles(false)
      } catch (error) {
        console.error("Error fetching roles:", error)
      } finally {
        setRolesLoading(false)
      }
    }

    fetchDomainRoles()
  }, [shouldRefetchRoles, roles.length])

  // Fetch all roles (from service)
  useEffect(() => {
    const fetchAllRoles = async () => {
      if (allRoles.length > 0) return

      try {
        // Aquí usamos el servicio que devuelve todos los roles disponibles
        const data = await import("@/lib/services/agtasks").then((module) => module.listRoles())

        // Mapear los datos y buscar el id correspondiente en roles
        const newRoles = data.map((role: any) => {
          // Buscar el rol en roles que coincida con nombre y lenguaje
          const matchingRole = roles.find(
            (r) => r.name === role.name && r.language.toLowerCase() === role.language.toLowerCase(),
          )

          return {
            id: matchingRole ? matchingRole.id : role.id,
            name: role.name,
            language: role.language,
          }
        })

        setAllRoles(newRoles)
      } catch (error) {
        console.error("Error fetching all roles:", error)
      }
    }

    fetchAllRoles()
  }, [roles, allRoles.length])

  // Fetch domain forms
  useEffect(() => {
    const fetchDomainForms = async () => {
      if (!shouldRefetchForms && forms.length > 0) return

      try {
        setFormsLoading(true)
        const res = await fetch("/api/domain-form?domainId=dd8ae98f-2231-444e-8daf-120a4c416d15")
        const data = await res.json()

        // Ensure we have unique forms (no duplicates with same name)
        const uniqueForms = data.data.reduce((acc: Form[], current: Form) => {
          const isDuplicate = acc.find((item) => item.name === current.name)
          if (!isDuplicate) {
            return acc.concat([current])
          }
          return acc
        }, [])

        setForms(uniqueForms)
        setSelectedForms(uniqueForms.map((f: Form) => f.id))
        setShouldRefetchForms(false)
      } catch (error) {
        console.error("Error fetching forms:", error)
      } finally {
        setFormsLoading(false)
      }
    }

    fetchDomainForms()
  }, [shouldRefetchForms, forms.length])

  // Fetch all forms from KoboToolbox
  useEffect(() => {
    const fetchAllForms = async () => {
      if (allForms.length > 0) return

      try {
        // Get forms from KoboToolbox
        const koboForms = await listAssets()

        // Map KoboToolbox assets to our Form interface
        const newForms = koboForms.map((form: any) => {
          // Find if this form already exists in our domain forms
          const matchingForm = forms.find((f) => f.ktFormId === form.uid)

          return {
            id: matchingForm ? matchingForm.id : form.uid,
            name: form.name,
            questions: 0, // Default value as specified
            ktFormId: form.uid,
            language: "es", // Default language as specified
          }
        })

        setAllForms(newForms)
      } catch (error) {
        console.error("Error fetching KoboToolbox forms:", error)
      }
    }

    fetchAllForms()
  }, [forms, allForms.length])

  const refreshProtocols = () => {
    setIsRefreshingProtocols(true)
    setShouldRefetchProtocols(true)
    setIsRefreshingProtocols(false)
  }

  const refreshRoles = () => {
    setIsRefreshingRoles(true)
    setShouldRefetchRoles(true)
    setIsRefreshingRoles(false)
  }

  const refreshForms = () => {
    setIsRefreshingForms(true)
    setShouldRefetchForms(true)
    setIsRefreshingForms(false)
  }

  return (
    <SettingsContext.Provider
      value={{
        // Datos de protocolos
        protocols,
        allProtocols,
        selectedProtocols,
        protocolsLoading,
        setProtocols,
        setAllProtocols,
        setSelectedProtocols,
        refreshProtocols,
        isRefreshingProtocols,

        // Datos de roles
        roles,
        allRoles,
        selectedRoles,
        rolesLoading,
        setRoles,
        setAllRoles,
        setSelectedRoles,
        refreshRoles,
        isRefreshingRoles,

        // Datos de formularios
        forms,
        allForms,
        selectedForms,
        formsLoading,
        setForms,
        setAllForms,
        setSelectedForms,
        refreshForms,
        isRefreshingForms,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
