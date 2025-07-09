"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useParams } from "next/navigation"
import type { Protocol, Form, User } from "@/lib/interfaces"
import { listAssets } from "@/lib/integrations/kobotoolbox"
import { listUsersByDomain } from "@/lib/integrations/360"
import { listDomainProtocols, listDomainForms } from "@/lib/services/agtasks"

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
  projectId?: string // Project.tmpServiceDeskId
  queueId?: string   // Project.tmpQueueId
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children, selectedProject }: { children: ReactNode, selectedProject?: any }) {
  const { domain } = useParams<{ domain: string }>()
  
  // En settings todavía no existe projectId y queueId
  const projectId = selectedProject?.tmpServiceDeskId || process.env.NEXT_PUBLIC_JIRA_PROTOCOLS_PROJECT_ID
  const queueId = selectedProject?.tmpQueueId || process.env.NEXT_PUBLIC_JIRA_PROTOCOLS_QUEUE_ID

  // Estado para protocolos
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [allProtocols, setAllProtocols] = useState<Protocol[]>([])
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([])
  const [protocolsLoading, setProtocolsLoading] = useState(true)
  const [isRefreshingProtocols, setIsRefreshingProtocols] = useState(false)
  const [shouldRefetchProtocols, setShouldRefetchProtocols] = useState(true)

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
        const protocols = await listDomainProtocols(domain)
        const sortedValues = protocols.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );

        setProtocols(sortedValues)
        setSelectedProtocols(sortedValues.map((p: Protocol) => p.tmProtocolId))
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
      console.log("URL: ", `/api/v1/integrations/jira/domains/${domain}/projects/${projectId}/services/queues/${queueId}`)
      
      
      if (!domain || !projectId || !queueId) return;

      try {

        const res = await fetch(
          `/api/v1/integrations/jira/domains/${domain}/projects/${projectId}/services/queues/${queueId}`,
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch Jira protocols: ${res.statusText}`);
        }

        const data = await res.json();
        // Asegurarse de que data.data.values sea un array
        const values = data.data && Array.isArray(data.data.values) ? data.data.values : [];

        // Ordenar alfabéticamente por el campo name (protocol.fields.summary)
        const sortedValues = values.sort((a: any, b: any) =>
          a.fields.summary.localeCompare(b.fields.summary)
        );

        const newProtocols = sortedValues.map((protocol: any) => {
          const matchingProtocol = protocols.find((p) => p.tmProtocolId === protocol.key);
          return {
            domainId: domain,
            id: matchingProtocol ? matchingProtocol.id : protocol.id.toString(),
            name: protocol.fields.summary,
            language: protocol.fields.labels && protocol.fields.labels.length > 0 ? protocol.fields.labels[0] : "ES",
            tmProtocolId: protocol.key,
            createdAt: protocol.created || new Date().toISOString(),
            updatedAt: protocol.updated || new Date().toISOString(),
          } as Protocol;
        });

        setAllProtocols(newProtocols);
      } catch (error) {
        console.error("Error fetching task manager protocols:", error);
        setAllProtocols([]);
      }
    };

    fetchAllProtocols();
  }, [protocols, domain, projectId, queueId]);

  // Fetch Domain Forms
  useEffect(() => {
    const fetchDomainForms = async () => {
      if (!shouldRefetchForms || !domain) return

      try {
        setFormsLoading(true)
        const forms = await listDomainForms(domain)
        const sortedValues = forms.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        setForms(sortedValues)
        setSelectedForms(sortedValues.map((f: Form) => f.id))
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
        // Ordenar alfabéticamente 
        const sortedValues = koboForms.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        const newForms = sortedValues.map((form: any) => {
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
        projectId,
        queueId,
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
