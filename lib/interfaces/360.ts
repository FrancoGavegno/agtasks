export interface User {
    email: string
    firstName: string
    id: string
    lastName: string
    invitationStatus?: "Not Sent" | "Sent"
    isoLanguages?: string // "es" | "en" | "pt"
    created?: string
    lastLogin?: string
  }
  
  export interface Domain {
    id: number
    languageId: number
    name: string
    hasLogo?: boolean
    domainUrl?: string
    deleted: boolean
  }
  
  export interface Workspace {
    parentId: number
    id: number
    deleted: boolean
    hasLogo: boolean
    languageId: number
    name: string
    note: string
    permission: string
  }
  
  export interface Season {
    deleted: boolean
    id: number
    name: string
    startDate: string
    endDate: string
    workspaceId: number
  }
  
  export interface Farm {
    id: number
    name: string
    permission: string
    seasonId: number
    workspaceId: number
    deleted: boolean
  }
  
  export interface LotField {
    cropDate: string
    cropId: number
    cropName: string
    farmId: number
    hectares: number
    hybridId: number
    hybridName: string
    id: number
    layerId: number
    name: string
    seasonId: number
    workspaceId: number
  }