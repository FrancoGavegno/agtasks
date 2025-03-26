// export type Folder = "DS_Bossio" | "DS_Local" | "DS_local_KMZ" | "DS_local_shp" | "DS_MyJD_360Dev"

export type Visibility = "COMMUNITY" | "PRIVATE"

export type Scope = "NONE" | "INHERITED" | "DOMAIN" | "AREA" | "WORKSPACE" | "FARM" | "FIELD"

export type Template = {
  id: string
  templateUrl: string
  name: string
  description?: string
  taskCount?: number
  space?: string
  tags: string[]
  visibility: Visibility
  thumbnail?: string
  scope: Scope
}

export type FormValues = Omit<Template, 'id'>

export type FormData = {
  name: string;
  description?: string;
  [key: string]: string | undefined; 
};

// ------------- 25/03/2025


export type ServicePortal = {
  id: string
  name: string
  domain: string
  area: string
  workspace: string
  servicePortal: string
  protocols: string[]
  roles: string[]
  forms: string[]
}

export interface Role {
  id: string
  name: string
}

// Datos de ejemplo
export const DOMAINS = ["GeoAgro", "Rigran"]
export const AREAS = ["Area 1", "Area 2"]
export const WORKSPACES = ["Workspace 1", "Workspace 2"]
export const SERVICE_PROJECTS = ["CLIENT 1 (Agtasks)", "PROJECT 2"]

export const PROTOCOLS = [
  { id: "Satellite monitoring and weed control", name: "Satellite monitoring and weed control", language: "EN" },
  {
    id: "Variable rate recommendations & applications",
    name: "Variable rate recommendations & applications",
    language: "EN",
  },
  {
    id: "Digitalização de Estabelecimentos e Lotes",
    name: "Digitalização de Estabelecimentos e Lotes",
    language: "PT",
  },
  {
    id: "Variable Seeding and/or Fertilization Protocol",
    name: "Variable Seeding and/or Fertilization Protocol",
    language: "EN",
  },
  { id: "Weed Control", name: "Weed Control", language: "EN" },
  { id: "Monitoramento Satelital", name: "Monitoramento Satelital", language: "PT" },
]

export const FORMS = [
  { id: "form1", name: "Beneficiary Registration Form" },
  { id: "form2", name: "Satisfaction Survey" },
  { id: "form3", name: "Needs Assessment" },
  { id: "form4", name: "Activity Monitoring" },
  { id: "form5", name: "Incident Report" },
  { id: "form6", name: "Post-Distribution Evaluation" },
  { id: "form7", name: "Consent Form" },
  { id: "form8", name: "Vulnerability Assessment" },
  { id: "form9", name: "Attendance Record" },
  { id: "form10", name: "Follow-up Form" },
]

