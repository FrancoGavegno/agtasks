"use client"

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  type ReactNode 
} from "react"
import { useParams } from "next/navigation"
import { User } from "@/lib/interfaces/360"
import { listUsersByDomain } from "@/lib/integrations/360"
import { listAssets } from "@/lib/integrations/kobotoolbox"
import { 
  apiClient, 
  type DomainProtocol, 
  type DomainForm 
} from "@/lib/integrations/amplify"

interface SettingsContextType {
  protocols: DomainProtocol[]
  allProtocols: DomainProtocol[]
  selectedProtocols: string[]
  protocolsLoading: boolean
  setProtocols: (protocols: DomainProtocol[]) => void
  setAllProtocols: (protocols: DomainProtocol[]) => void
  setSelectedProtocols: (ids: string[]) => void
  refreshProtocols: () => void
  isRefreshingProtocols: boolean

  forms: DomainForm[]
  allForms: DomainForm[]
  selectedForms: string[]
  formsLoading: boolean
  setForms: (forms: DomainForm[]) => void
  setAllForms: (forms: DomainForm[]) => void
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
  const projectId = selectedProject?.tmpServiceDeskId || process.env.NEXT_PUBLIC_JIRA_PROTOCOLS_PROJECT_ID
  const queueId = selectedProject?.tmpQueueId || process.env.NEXT_PUBLIC_JIRA_PROTOCOLS_QUEUE_ID

  // Estado para protocolos
  const [protocols, setProtocols] = useState<DomainProtocol[]>([])
  const [allProtocols, setAllProtocols] = useState<DomainProtocol[]>([])
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([])
  const [protocolsLoading, setProtocolsLoading] = useState(true)
  const [isRefreshingProtocols, setIsRefreshingProtocols] = useState(false)
  const [shouldRefetchProtocols, setShouldRefetchProtocols] = useState(true)

  // Estado para formularios
  const [forms, setForms] = useState<DomainForm[]>([])
  const [allForms, setAllForms] = useState<DomainForm[]>([])
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
        const protocolsData = await apiClient.listDomainProtocols(domain)
        const sortedValues = protocolsData.items.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        setProtocols(sortedValues)
        setSelectedProtocols(sortedValues.map((p: DomainProtocol) => p.tmProtocolId))
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
            name: protocol.fields.summary,
            language: protocol.fields.labels && protocol.fields.labels.length > 0 ? protocol.fields.labels[0] : "ES",
            tmProtocolId: protocol.key,
          } as DomainProtocol;
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
        const formsData = await apiClient.listDomainForms(domain)
        const sortedValues = formsData.items.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        setForms(sortedValues) 
        setSelectedForms(sortedValues.map((f: DomainForm) => f.ktFormId))
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
          } as DomainForm
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