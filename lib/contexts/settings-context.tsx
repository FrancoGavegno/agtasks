"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useParams } from "next/navigation"
import type { Protocol, Role, Form, User } from "@/lib/interfaces"
import { listAssets } from "@/lib/integrations/kobotoolbox"
import { listUsersByDomain } from "@/lib/integrations/360"

const projectId = process.env.NEXT_PUBLIC_JIRA_PROTOCOLS_PROJECT_ID || "TEM"
const queueId = process.env.NEXT_PUBLIC_JIRA_PROTOCOLS_QUEUE_ID || "82"

// Interfaz genérica para el contexto de configuraciones
interface SettingsContextType {
  protocols: Protocol[]
  allProtocols: Protocol[]
  selectedProtocols: string[]
  protocolsLoading: boolean
  setProtocols: (protocols: Protocol[]) => void
  setAllProtocols: (protocols: Protocol[]) => void
  setSelectedProtocols: (ids: string[]) => void
  refreshProtocols: () => void
  isRefreshingProtocols: boolean

  roles: Role[]
  allRoles: Role[]
  selectedRoles: string[]
  rolesLoading: boolean
  setRoles: (roles: Role[]) => void
  setAllRoles: (roles: Role[]) => void
  setSelectedRoles: (ids: string[]) => void
  refreshRoles: () => void
  isRefreshingRoles: boolean

  forms: Form[]
  allForms: Form[]
  selectedForms: string[]
  formsLoading: boolean
  setForms: (forms: Form[]) => void
  setAllForms: (forms: Form[]) => void
  setSelectedForms: (ids: string[]) => void
  refreshForms: () => void
  isRefreshingForms: boolean

  users: User[]
  usersLoading: boolean
  setUsers: (users: User[]) => void
  refreshUsers: () => void
  isRefreshingUsers: boolean
  sentInvitationEmails: Set<string>
  setSentInvitationEmails: (emails: Set<string>) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { domain } = useParams<{ domain: string }>()

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

  // Estado para usuarios
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [isRefreshingUsers, setIsRefreshingUsers] = useState(false)
  const [shouldRefetchUsers, setShouldRefetchUsers] = useState(true)
  const [sentInvitationEmails, setSentInvitationEmails] = useState<Set<string>>(new Set())

  // Fetch Domain Protocols
  useEffect(() => {
    const fetchDomainProtocols = async () => {
      if (!shouldRefetchProtocols || !domain) return

      try {
        setProtocolsLoading(true)
        const res = await fetch(`/api/v1/agtasks/domains/${domain}/protocols`)
        if (!res.ok) {
          throw new Error(`Failed to fetch protocols: ${res.statusText}`)
        }
        const data = await res.json()
        const protocolsData = Array.isArray(data) ? data : []
        setProtocols(protocolsData)
        setSelectedProtocols(protocolsData.map((p: Protocol) => p.tmProtocolId))
        setShouldRefetchProtocols(false)
      } catch (error) {
        console.error("Error fetching protocols:", error)
        setProtocols([])
        setSelectedProtocols([])
      } finally {
        setProtocolsLoading(false)
      }
    }

    fetchDomainProtocols()
  }, [shouldRefetchProtocols, domain])

  // Fetch All Jira Protocols
  useEffect(() => {
    const fetchAllProtocols = async () => {
      if (!domain || !projectId || !queueId) return

      try {
        const res = await fetch(
          `/api/v1/integrations/jira/domains/${domain}/projects/${projectId}/services/queues/${queueId}`,
        )
        if (!res.ok) {
          throw new Error(`Failed to fetch Jira protocols: ${res.statusText}`)
        }

        const data = await res.json()
        // Asegurarse de que data.data.values sea un array
        const values = data.data && Array.isArray(data.data.values) ? data.data.values : []

        const newProtocols = values.map((protocol: any) => {
          const matchingProtocol = protocols.find((p) => p.tmProtocolId === protocol.key)
          return {
            domainId: domain,
            id: matchingProtocol ? matchingProtocol.id : protocol.id.toString(),
            name: protocol.fields.summary,
            language: protocol.fields.labels && protocol.fields.labels.length > 0 ? protocol.fields.labels[0] : "ES",
            tmProtocolId: protocol.key,
            createdAt: protocol.created || new Date().toISOString(),
            updatedAt: protocol.updated || new Date().toISOString(),
          } as Protocol
        })

        setAllProtocols(newProtocols)
      } catch (error) {
        console.error("Error fetching task manager protocols:", error)
        setAllProtocols([])
      }
    }

    fetchAllProtocols()
  }, [protocols, domain, projectId, queueId])

  // Fetch Domain Roles
  useEffect(() => {
    const fetchDomainRoles = async () => {
      if (!shouldRefetchRoles || !domain) return

      try {
        setRolesLoading(true)
        const res = await fetch(`/api/v1/agtasks/domains/${domain}/roles`)
        if (!res.ok) {
          throw new Error(`Failed to fetch domain roles: ${res.statusText}`)
        }
        const data = await res.json()
        const rolesData = Array.isArray(data) ? data : []
        setRoles(rolesData)
        setSelectedRoles(rolesData.map((r: Role) => r.id))
        setShouldRefetchRoles(false)
      } catch (error) {
        console.error("Error fetching domain roles:", error)
        setRoles([])
        setSelectedRoles([])
      } finally {
        setRolesLoading(false)
      }
    }

    fetchDomainRoles()
  }, [shouldRefetchRoles, domain])

  // Fetch All Agtasks Roles
  useEffect(() => {
    const fetchAllRoles = async () => {
      try {
        const res = await fetch(`/api/v1/agtasks/roles`);
        if (!res.ok) {
          throw new Error(`Failed to fetch all roles: ${res.statusText}`);
        }

        const data = await res.json()
        // Aseguramos que data sea un array y filtramos los elementos null
        const rolesData = Array.isArray(data) ? data.filter((role: any) => role !== null) : [];

        console.log("rolesData: ", rolesData)
        // Si no hay roles válidos después de filtrar, establecemos allRoles como vacío

        // Mapeamos los roles válidos
        const newRoles = rolesData.map((role: any) => {
          const matchingRole = roles.find(
            (r) => r.name === role.name && r.language.toLowerCase() === role.language.toLowerCase(),
          );

          return {
            domainId: domain,
            id: matchingRole ? matchingRole.id : role.id.toString(),
            name: role.name,
            language: role.language,
          } as Role;
        });

        setAllRoles(newRoles);
      } catch (error) {
        console.error("Error fetching all roles:", error);
        setAllRoles([]);
      }
    };

    fetchAllRoles();
  }, [roles, domain]);

  // Fetch Domain Forms
  useEffect(() => {
    const fetchDomainForms = async () => {
      if (!shouldRefetchForms || !domain) return

      try {
        setFormsLoading(true)
        const res = await fetch(`/api/v1/agtasks/domains/${domain}/forms`)
        if (!res.ok) {
          throw new Error(`Failed to fetch domain forms: ${res.statusText}`)
        }
        const data = await res.json()
        const formsData = Array.isArray(data) ? data : []
        setForms(formsData)
        setSelectedForms(formsData.map((f: Form) => f.id))
        setShouldRefetchForms(false)
      } catch (error) {
        console.error("Error fetching domain forms:", error)
        setForms([])
        setSelectedForms([])
      } finally {
        setFormsLoading(false)
      }
    }

    fetchDomainForms()
  }, [shouldRefetchForms, domain])

  // Fetch All Kobo Toolbox Forms
  useEffect(() => {
    const fetchAllForms = async () => {
      if (!domain) return

      try {
        const koboForms = await listAssets()

        const newForms = koboForms.map((form: any) => {
          const matchingForm = forms.find((f) => f.ktFormId === form.uid)

          return {
            domainId: domain,
            id: matchingForm ? matchingForm.id : form.uid,
            ktFormId: form.uid,
            name: form.name,
            language: "ES",
          } as Form
        })

        setAllForms(newForms)
      } catch (error) {
        console.error("Error fetching KoboToolbox forms:", error)
        setAllForms([])
      }
    }

    fetchAllForms()
  }, [forms, domain])

  // Fetch Domain Users
  useEffect(() => {
    const fetchDomainUsers = async () => {
      if (!shouldRefetchUsers || !domain) return

      try {
        setUsersLoading(true)
        const domainId = Number.parseInt(domain, 10)
        if (isNaN(domainId)) {
          throw new Error(`Invalid domain ID: ${domain}`)
        }

        const fetchedUsers = await listUsersByDomain(domainId)

        // Inicializar sentInvitationEmails con usuarios que ya tienen "Sent" status
        const sentEmails = new Set<string>()
        fetchedUsers.forEach((user) => {
          if (user.invitationStatus === "Sent") {
            sentEmails.add(user.email)
          }
        })

        setSentInvitationEmails(sentEmails)
        setUsers(fetchedUsers)
        setShouldRefetchUsers(false)
      } catch (error) {
        console.error("Error fetching domain users:", error)
        setUsers([])
      } finally {
        setUsersLoading(false)
      }
    }

    fetchDomainUsers()
  }, [shouldRefetchUsers, domain])


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

  const refreshUsers = () => {
    setIsRefreshingUsers(true)
    setShouldRefetchUsers(true)
    setIsRefreshingUsers(false)
  }

  return (
    <SettingsContext.Provider
      value={{
        protocols,
        allProtocols,
        selectedProtocols,
        protocolsLoading,
        setProtocols,
        setAllProtocols,
        setSelectedProtocols,
        refreshProtocols,
        isRefreshingProtocols,

        roles,
        allRoles,
        selectedRoles,
        rolesLoading,
        setRoles,
        setAllRoles,
        setSelectedRoles,
        refreshRoles,
        isRefreshingRoles,

        forms,
        allForms,
        selectedForms,
        formsLoading,
        setForms,
        setAllForms,
        setSelectedForms,
        refreshForms,
        isRefreshingForms,

        users,
        usersLoading,
        setUsers,
        refreshUsers,
        isRefreshingUsers,
        sentInvitationEmails,
        setSentInvitationEmails,
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
