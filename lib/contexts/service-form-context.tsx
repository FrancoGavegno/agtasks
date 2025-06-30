"use client"

import { 
  createContext, 
  useContext, 
  useState, 
  type ReactNode 
} from "react"
import type { 
  CreateServiceFormValues, 
  SelectedLotDetail 
} from "@/components/projects/validation-schemas"

// Define the protocol tasks data structure
interface ProtocolTasks {
  [key: string]: string[]
}

// Define the workspace data structure
interface Workspace {
  id: string
  name: string
}

// Define the campaign data structure
interface Campaign {
  id: string
  name: string
  workspaceId: string
}

// Define the establishment data structure
interface Establishment {
  id: string
  name: string
  workspaceId: string
  campaignId: string
}

// Define the lot data structure
interface Lot {
  id: string
  name: string
  crop: string
  hectares: number
  establishmentId: string
}

// Define the role data structure
interface Role {
  id: string
  name: string
}

// Define the user data structure
interface User {
  id: string
  name: string
  roleIds: string[]
}

interface ServiceFormContextType {
  formValues: {
    protocol?: string
    taskAssignments?: any[]
    workspace?: string
    workspaceName?: string
    campaign?: string
    campaignName?: string
    establishment?: string
    establishmentName?: string
    selectedLots?: SelectedLotDetail[]
    selectedLotsNames?: Record<string, string>
  }
  updateFormValues: (values: Partial<ServiceFormContextType["formValues"]>) => void
  resetForm: () => void
  protocolTasks: ProtocolTasks
  workspaces: Workspace[]
  campaigns: Campaign[]
  establishments: Establishment[]
  lots: Lot[]
  roles: Role[]
  users: User[]
}

// Initial form values
const initialContext: ServiceFormContextType = {
  formValues: {
    protocol: "",
    taskAssignments: [],
    workspace: "",
    workspaceName: "",
    campaign: "",
    campaignName: "",
    establishment: "",
    establishmentName: "",
    selectedLots: [],
    selectedLotsNames: {},
  },
  updateFormValues: () => {},
  resetForm: () => {},
  protocolTasks: {},
  workspaces: [],
  campaigns: [],
  establishments: [],
  lots: [],
  roles: [],
  users: [],
}

// Default form values
const defaultFormValues: CreateServiceFormValues = {
  protocol: "",
  workspace: "",
  campaign: "",
  establishment: "",
  selectedLots: [],
  taskAssignments: [], // Asegurarse de que esto esté inicializado como un array vacío
}

// Create the context
const ServiceFormContext = createContext<ServiceFormContextType | undefined>(undefined)

// Create the provider component
export function ServiceFormProvider({ children }: { children: ReactNode }) {
  // Form values state
  const [formValues, setFormValues] = useState<ServiceFormContextType["formValues"]>(initialContext.formValues)

  // Update form values
  const updateFormValues = (values: Partial<ServiceFormContextType["formValues"]>) => {
    setFormValues((prev) => ({ ...prev, ...values }))
  }

  // Reset form
  const resetForm = () => {
    setFormValues(initialContext.formValues)
  }

  return (
    <ServiceFormContext.Provider
      value={{
        formValues,
        updateFormValues,
        resetForm,
        protocolTasks: {},
        workspaces: [],
        campaigns: [],
        establishments: [],
        lots: [],
        roles: [],
        users: [],
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
