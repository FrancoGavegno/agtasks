"use client"

import { 
  createContext, 
  useContext, 
  useState, 
  type ReactNode 
} from "react"

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
    tasks: any[]
    fields: any[]
    workspace?: string
    workspaceName?: string
    campaign?: string
    campaignName?: string
    establishment?: string
    establishmentName?: string
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
    tasks: [],
    fields: [],
    workspace: "",
    workspaceName: "",
    campaign: "",
    campaignName: "",
    establishment: "",
    establishmentName: "",
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

// Default form values eliminados porque ya no se usan

// Create the context
const ServiceFormContext = createContext<ServiceFormContextType | undefined>(undefined)

// Create the provider component
export function ServiceFormProvider({ children }: { children: ReactNode }) {
  // Form values state
  const [formValues, setFormValues] = useState<ServiceFormContextType["formValues"]>(initialContext.formValues)

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
