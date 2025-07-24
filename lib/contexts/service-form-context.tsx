"use client"

import { 
  createContext, 
  useContext, 
  useState, 
  type ReactNode 
} from "react"
import type { 
  Workspace, 
  Season, 
  Farm, 
  LotField,
  User
} from "@/lib/interfaces/360"
import type { Protocol, Form as DomainForm } from "@/lib/interfaces/agtasks"

// Define the protocol tasks data structure
export interface ProtocolTasks {
  [key: string]: any[]
}

interface ServiceFormContextType {
  formValues: {
    tasks: any[]
    fields: any[]
    workspace?: string
    workspaceName?: string
    campaign?: string
    campaignName?: string
    establishment?: string
    establishmentName?: string
    protocolId?: string
    protocolName?: string
    tmpRequestId?: string
  }
  updateFormValues: (values: Partial<ServiceFormContextType["formValues"]>) => void
  resetForm: () => void
  protocolTasks: ProtocolTasks
  protocols: Protocol[]
  forms: DomainForm[]
  workspaces: Workspace[]
  campaigns: Season[]
  establishments: Farm[]
  lots: LotField[]
  users: User[]
  enabledTasks: Set<number>
  // Flags para controlar recargas
  hasLoadedProtocols: boolean
  hasLoadedForms: boolean
  hasLoadedWorkspaces: boolean
  hasLoadedSeasons: boolean
  hasLoadedFarms: boolean
  hasLoadedFields: boolean
  hasLoadedUsers: boolean
  // Funciones para actualizar flags
  setHasLoadedProtocols: (loaded: boolean) => void
  setHasLoadedForms: (loaded: boolean) => void
  setHasLoadedWorkspaces: (loaded: boolean) => void
  setHasLoadedSeasons: (loaded: boolean) => void
  setHasLoadedFarms: (loaded: boolean) => void
  setHasLoadedFields: (loaded: boolean) => void
  setHasLoadedUsers: (loaded: boolean) => void
  // Funciones para actualizar datos cargados
  setProtocols: (protocols: Protocol[]) => void
  setForms: (forms: DomainForm[]) => void
  setWorkspaces: (workspaces: Workspace[]) => void
  setCampaigns: (campaigns: Season[]) => void
  setEstablishments: (establishments: Farm[]) => void
  setLots: (lots: LotField[]) => void
  setUsers: (users: User[]) => void
  setProtocolTasks: (tasks: ProtocolTasks) => void
  setEnabledTasks: (tasks: Set<number>) => void
}

// Initial form values
const initialContext: ServiceFormContextType = {
  formValues: {
    tasks: [],
    fields: [],
    workspace: "",
    workspaceName: "",
    campaign: "",
    campaignName: "",
    establishment: "",
    establishmentName: "",
    protocolId: "",
    protocolName: "",
    tmpRequestId: "",
  },
  updateFormValues: () => {},
  resetForm: () => {},
  protocolTasks: {},
  protocols: [],
  forms: [],
  workspaces: [],
  campaigns: [],
  establishments: [],
  lots: [],
  users: [],
  enabledTasks: new Set(),
  hasLoadedProtocols: false,
  hasLoadedForms: false,
  hasLoadedWorkspaces: false,
  hasLoadedSeasons: false,
  hasLoadedFarms: false,
  hasLoadedFields: false,
  hasLoadedUsers: false,
  setHasLoadedProtocols: () => {},
  setHasLoadedForms: () => {},
  setHasLoadedWorkspaces: () => {},
  setHasLoadedSeasons: () => {},
  setHasLoadedFarms: () => {},
  setHasLoadedFields: () => {},
  setHasLoadedUsers: () => {},
  setProtocols: () => {},
  setForms: () => {},
  setWorkspaces: () => {},
  setCampaigns: () => {},
  setEstablishments: () => {},
  setLots: () => {},
  setUsers: () => {},
  setProtocolTasks: () => {},
  setEnabledTasks: () => {},
}

// Create the context
const ServiceFormContext = createContext<ServiceFormContextType | undefined>(undefined)

// Create the provider component
export function ServiceFormProvider({ children }: { children: ReactNode }) {
  // Form values state
  const [formValues, setFormValues] = useState<ServiceFormContextType["formValues"]>(initialContext.formValues)

  // Data states
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [forms, setForms] = useState<DomainForm[]>([])
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [campaigns, setCampaigns] = useState<Season[]>([])
  const [establishments, setEstablishments] = useState<Farm[]>([])
  const [lots, setLots] = useState<LotField[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [protocolTasks, setProtocolTasks] = useState<ProtocolTasks>({})
  const [enabledTasks, setEnabledTasks] = useState<Set<number>>(initialContext.enabledTasks)

  // Loading flags state
  const [hasLoadedProtocols, setHasLoadedProtocols] = useState(false)
  const [hasLoadedForms, setHasLoadedForms] = useState(false)
  const [hasLoadedWorkspaces, setHasLoadedWorkspaces] = useState(false)
  const [hasLoadedSeasons, setHasLoadedSeasons] = useState(false)
  const [hasLoadedFarms, setHasLoadedFarms] = useState(false)
  const [hasLoadedFields, setHasLoadedFields] = useState(false)
  const [hasLoadedUsers, setHasLoadedUsers] = useState(false)

  // Update form values
  const updateFormValues = (values: Partial<ServiceFormContextType["formValues"]>) => {
    setFormValues((prev) => {
      // Si se están actualizando las tareas, asegurar que no haya duplicados
      if (values.tasks && Array.isArray(values.tasks)) {
        const uniqueTasks = values.tasks.filter((task, index, self) => 
          index === self.findIndex((t) => t.tmpSubtaskId === task.tmpSubtaskId)
        );
        return { ...prev, ...values, tasks: uniqueTasks };
      }
      return { ...prev, ...values };
    });
  }

  // Reset form
  const resetForm = () => {
    setFormValues(initialContext.formValues)
    setProtocols([])
    setForms([])
    setWorkspaces([])
    setCampaigns([])
    setEstablishments([])
    setLots([])
    setUsers([])
    setProtocolTasks({})
    setEnabledTasks(new Set())
    setHasLoadedProtocols(false)
    setHasLoadedForms(false)
    setHasLoadedWorkspaces(false)
    setHasLoadedSeasons(false)
    setHasLoadedFarms(false)
    setHasLoadedFields(false)
    setHasLoadedUsers(false)
  }

  return (
    <ServiceFormContext.Provider
      value={{
        formValues,
        updateFormValues,
        resetForm,
        protocolTasks,
        protocols,
        forms,
        workspaces,
        campaigns,
        establishments,
        lots,
        users,
        enabledTasks,
        hasLoadedProtocols,
        hasLoadedForms,
        hasLoadedWorkspaces,
        hasLoadedSeasons,
        hasLoadedFarms,
        hasLoadedFields,
        hasLoadedUsers,
        setHasLoadedProtocols,
        setHasLoadedForms,
        setHasLoadedWorkspaces,
        setHasLoadedSeasons,
        setHasLoadedFarms,
        setHasLoadedFields,
        setHasLoadedUsers,
        setProtocols,
        setForms,
        setWorkspaces,
        setCampaigns,
        setEstablishments,
        setLots,
        setUsers,
        setProtocolTasks,
        setEnabledTasks,
      }}
    >
      {children}
    </ServiceFormContext.Provider>
  )
}

// Create the hook to use the context
export function useServiceForm() {
  const context = useContext(ServiceFormContext)
  if (context === undefined) {
    throw new Error("useServiceForm must be used within a ServiceFormProvider")
  }
  return context
}
