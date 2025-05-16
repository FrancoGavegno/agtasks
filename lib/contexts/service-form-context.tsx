"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { CreateServiceFormValues } from "@/components/projects/validation-schemas"

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

// Actualizar el contexto para incluir los nuevos campos

// Buscar la interfaz ServiceFormContextType y actualizarla
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
    selectedLots?: string[]
    selectedLotsNames?: Record<string, string>
  }
  updateFormValues: (values: Partial<ServiceFormContextType["formValues"]>) => void
  resetForm: () => void

  // Protocol data
  protocolTasks: ProtocolTasks

  // Workspace data
  workspaces: Workspace[]
  workspacesLoading: boolean

  // Campaign data
  campaigns: Campaign[]
  campaignsLoading: boolean

  // Establishment data
  establishments: Establishment[]
  establishmentsLoading: boolean

  // Lot data
  lots: Lot[]
  lotsLoading: boolean

  // Role data
  roles: Role[]
  rolesLoading: boolean

  // User data
  users: User[]
  usersLoading: boolean
  getUsersByRole: (roleId: string) => User[]
}

// Actualizar el valor inicial del contexto
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
  workspacesLoading: false,
  campaigns: [],
  campaignsLoading: false,
  establishments: [],
  establishmentsLoading: false,
  lots: [],
  lotsLoading: false,
  roles: [],
  rolesLoading: false,
  users: [],
  usersLoading: false,
  getUsersByRole: () => [],
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

// Sample protocol tasks data
const sampleProtocolTasks: ProtocolTasks = {
  "variable-seeding": [
    "Análisis de suelo y topografía",
    "Generación de mapas de prescripción",
    "Calibración de maquinaria",
    "Seguimiento de aplicación",
  ],
  "satellite-monitoring": [
    "Monitoreo de lotes utilizando imágenes satelitales",
    "Zonificación del índice",
    "Validación del mapa de zonas con recorrida a campo",
  ],
}

// Sample workspaces data
const sampleWorkspaces: Workspace[] = [
  { id: "w1", name: "Workspace 1" },
  { id: "w2", name: "Workspace 2" },
  { id: "w3", name: "Workspace 3" },
]

// Sample campaigns data
const sampleCampaigns: Campaign[] = [
  { id: "c1", name: "Campaña 2023/24", workspaceId: "w1" },
  { id: "c2", name: "Campaña 2022/23", workspaceId: "w1" },
  { id: "c3", name: "Campaña 2023/24", workspaceId: "w2" },
  { id: "c4", name: "Campaña 2021/22", workspaceId: "w2" },
  { id: "c5", name: "Campaña 2023/24", workspaceId: "w3" },
]

// Sample establishments data
const sampleEstablishments: Establishment[] = [
  { id: "e1", name: "Establecimiento A", workspaceId: "w1", campaignId: "c1" },
  { id: "e2", name: "Establecimiento B", workspaceId: "w1", campaignId: "c1" },
  { id: "e3", name: "Establecimiento C", workspaceId: "w1", campaignId: "c2" },
  { id: "e4", name: "Establecimiento D", workspaceId: "w2", campaignId: "c3" },
  { id: "e5", name: "Establecimiento E", workspaceId: "w2", campaignId: "c3" },
  { id: "e6", name: "Establecimiento F", workspaceId: "w2", campaignId: "c4" },
  { id: "e7", name: "Establecimiento G", workspaceId: "w3", campaignId: "c5" },
]

// Sample lots data
const sampleLots: Lot[] = [
  { id: "A001", name: "Lote Norte", crop: "Maíz / P1234", hectares: 45.5, establishmentId: "e1" },
  { id: "A002", name: "Lote Sur", crop: "Soja / DM4615", hectares: 32.8, establishmentId: "e1" },
  { id: "A003", name: "Lote Este", crop: "Trigo / Klein Serpiente", hectares: 28.3, establishmentId: "e1" },
  { id: "B001", name: "Lote 1", crop: "Soja / DM4670", hectares: 50.2, establishmentId: "e2" },
  { id: "B002", name: "Lote 2", crop: "Maíz / DK7210", hectares: 38.7, establishmentId: "e2" },
  { id: "C001", name: "Lote Principal", crop: "Girasol / P102CL", hectares: 60.0, establishmentId: "e3" },
  { id: "D001", name: "Lote A", crop: "Maíz / P1234", hectares: 42.1, establishmentId: "e4" },
  { id: "D002", name: "Lote B", crop: "Soja / NS4309", hectares: 35.6, establishmentId: "e4" },
  { id: "E001", name: "Lote Único", crop: "Trigo / Buck Meteoro", hectares: 75.3, establishmentId: "e5" },
  { id: "F001", name: "Lote 1", crop: "Soja / DM4615", hectares: 48.9, establishmentId: "e6" },
  { id: "G001", name: "Lote Norte", crop: "Maíz / DK7210", hectares: 55.0, establishmentId: "e7" },
  { id: "G002", name: "Lote Sur", crop: "Soja / DM4670", hectares: 40.2, establishmentId: "e7" },
]

// Sample roles data
const sampleRoles: Role[] = [
  { id: "r1", name: "Agrónomo" },
  { id: "r2", name: "Técnico" },
  { id: "r3", name: "Supervisor" },
  { id: "r4", name: "Administrador" },
  { id: "r5", name: "Operario" },
]

// Sample users data
const sampleUsers: User[] = [
  { id: "u1", name: "Juan Pérez", roleIds: ["r1"] },
  { id: "u2", name: "María González", roleIds: ["r1"] },
  { id: "u3", name: "Carlos Rodríguez", roleIds: ["r1"] },
  { id: "u4", name: "Ana Martínez", roleIds: ["r2"] },
  { id: "u5", name: "Luis Sánchez", roleIds: ["r2"] },
  { id: "u6", name: "Elena Díaz", roleIds: ["r2"] },
  { id: "u7", name: "Roberto Fernández", roleIds: ["r3"] },
  { id: "u8", name: "Sofía López", roleIds: ["r3"] },
  { id: "u9", name: "Miguel Torres", roleIds: ["r4"] },
  { id: "u10", name: "Laura García", roleIds: ["r4"] },
  { id: "u11", name: "Pedro Ramírez", roleIds: ["r5"] },
  { id: "u12", name: "Javier Morales", roleIds: ["r5"] },
  { id: "u13", name: "Lucía Vega", roleIds: ["r5"] },
  { id: "u14", name: "Valentina Castro", roleIds: ["r5"] },
]

// Create the provider component
export function ServiceFormProvider({ children }: { children: ReactNode }) {
  // Form values state
  const [formValues, setFormValues] = useState<ServiceFormContextType["formValues"]>(initialContext.formValues)

  // Data loading states
  const [workspacesLoading, setWorkspacesLoading] = useState(true)
  const [campaignsLoading, setCampaignsLoading] = useState(true)
  const [establishmentsLoading, setEstablishmentsLoading] = useState(true)
  const [lotsLoading, setLotsLoading] = useState(true)
  const [rolesLoading, setRolesLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(true)

  // Simulate loading data from API
  useEffect(() => {
    const loadData = async () => {
      // Simulate API calls with timeouts
      setTimeout(() => setWorkspacesLoading(false), 500)
      setTimeout(() => setCampaignsLoading(false), 700)
      setTimeout(() => setEstablishmentsLoading(false), 900)
      setTimeout(() => setLotsLoading(false), 1100)
      setTimeout(() => setRolesLoading(false), 600)
      setTimeout(() => setUsersLoading(false), 800)
    }

    loadData()
  }, [])

  // Update form values
  const updateFormValues = (values: Partial<ServiceFormContextType["formValues"]>) => {
    setFormValues((prev) => ({ ...prev, ...values }))
  }

  // Reset form
  const resetForm = () => {
    setFormValues(initialContext.formValues)
  }

  // Get users by role
  const getUsersByRole = (roleId: string) => {
    return sampleUsers.filter((user) => user.roleIds.includes(roleId))
  }

  return (
    <ServiceFormContext.Provider
      value={{
        // Form values
        formValues,
        updateFormValues,
        resetForm,

        // Protocol data
        protocolTasks: sampleProtocolTasks,

        // Workspace data
        workspaces: sampleWorkspaces,
        workspacesLoading,

        // Campaign data
        campaigns: sampleCampaigns,
        campaignsLoading,

        // Establishment data
        establishments: sampleEstablishments,
        establishmentsLoading,

        // Lot data
        lots: sampleLots,
        lotsLoading,

        // Role data
        roles: sampleRoles,
        rolesLoading,

        // User data
        users: sampleUsers,
        usersLoading,
        getUsersByRole,
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
