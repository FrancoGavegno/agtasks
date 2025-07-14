// 360
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

// Settings
export interface Protocol {
  domainId: string // FK a 360 Domain
  id: string
  tmProtocolId: string // FK a Jira Request Template ID
  name: string
  language: string
  createdAt?: string
  updatedAt?: string
}

export interface Form {
  domainId: string // FK a 360 Domain
  id: string
  ktFormId: string // FK a Kobo Toolbox Template ID
  name: string
  language: string
}

// Services / Tasks
export interface Project {
  id: string
  domainId: string
  areaId: string 
  tmpSourceSystem?: string
	tmpServiceDeskId?: string 
	tmpRequestTypeId?: string
  tmpQueueId?: string
  serviceDeskId: string  
  requestTypeId: string
  queueId: string
  name?: string
  language: string  
  deleted: boolean
  services?: Service[]
  tasks?: Task[]
}

export interface Service {
  id: string
  projectId?: string 
  tmpRequestId?: string
	requestId?: string
  name: string
  tasks?: Task[]
  createdAt?: string  
  deleted?: boolean 
}

export interface Task {
  id: string
  projectId?: string
  serviceId?: string 
  tmpSubtaskId: string  
  subtaskId?: string  
  taskName: string 
  taskType?: string // ex.: administrative, fieldvisit, tillage
  taskData?: Record<string, any> 
  userEmail: string
  deleted?: boolean
  formId?: string
  taskFields?: TaskField[]
}

export interface Field {
  id: string
  workspaceId: string
  workspaceName?: string
  campaignId: string
  campaignName?: string
  farmId: string
  farmName?: string
  fieldId: string
  fieldName: string
  hectares?: number
  crop?: string
  hybrid?: string
  deleted?: boolean
  taskFields?: TaskField[] 
}

export interface TaskField {
  taskId: string
  fieldId: string
}

// validation-schemas.ts
export interface TaskAssignment {
  task: string
  taskType: string  // administrative, fieldvisit, tillage
  assignedTo: string
}

//  Jira
export interface JiraCustomerData {
  displayName: string
  email: string
}

export interface JiraResponse {
  success: boolean
  error?: string
  data?: any // Opcional: para incluir datos de respuesta si los hay
}

export interface JiraRequestData {
  email: string
  request: string
  domain: string
  area: string
  workspace: string
  season: string
  farm: string
  date_requested: string
  date_limit: string
  reason?: string
  objective?: string
  comments?: string
  participants?: string[]
}

export interface JiraRequest {
  summary: string
  description: string
}

export interface QueueIssueResponse {
  _expands: any[]
  size: number
  start: number
  limit: number
  isLastPage: boolean
  _links: Links
  values: Value[]
}

export interface Links {
  base: string
  context: string
  next: string
  prev: string
}

export interface Value {
  fields: Fields
  id: string
  key: string
  self: string
}

export interface Fields {
  summary: string
  issuetype: Issuetype
  duedate: string
  created: string
  reporter: Reporter
  labels: string
}

export interface Issuetype {
  avatarId: number
  description: string
  iconUrl: string
  id: string
  name: string
  self: string
  subtask: boolean
}

export interface Reporter {
  accountId: string
  name: string
  key: string
  emailAddress: string
  displayName: string
  active: boolean
  timeZone: string
  _links: ReporterLinks
}

export interface ReporterLinks {
  jiraRest: string
  avatarUrls: AvatarUrls
  self: string
}

export interface AvatarUrls {
  "16x16": string
  "24x24": string
  "32x32": string
  "48x48": string
}

// --------------
export interface JiraResponseData {
  issues: JiraIssue[]
  total: number
  maxResults: number
  startAt: number
}

export interface JiraProjectRequest {
  key: string
  name: string
  projectTypeKey: string
  leadAccountId?: string
  description?: string
  url?: string
  assigneeType?: string
  projectTemplateKey?: string
  categoryId?: number
}

export interface JiraProjectResponse {
  self: string
  id: string
  key: string
  name: string
  projectTypeKey: string
  simplified: boolean
  style: string
  isPrivate: boolean
  entityId: string
  uuid: string
}

export interface JiraIssue {
  key: string
  fields: {
    summary?: string
    status?: {
      name: string
    }
  }
}

// esta interface será reemplazada por JiraServiceRequest
export interface JiraCustomerRequestData {
  isAdfRequest: boolean
  raiseOnBehalfOf?: string // Email del usuario en cuyo nombre se crea la solicitud
  requestFieldValues: {
    summary: string
    description?: string
    [key: string]: any // Para campos personalizados
  }
  requestParticipants?: string[] // Array de emails de participantes
  requestTypeId: string
  serviceDeskId: string
}

export interface JiraServiceRequest {
  serviceDeskId: string;
  requestTypeId: string;
  requestFieldValues: {
    summary: string;
    description: string;
    customFields?: Record<string, any>;
  };
  raiseOnBehalfOf?: string;
  requestParticipants?: string[];
}

export interface JiraServiceResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface JiraSubtaskResponse {
  id: string;
  key: string;
  self: string;
  [key: string]: any;
}

export interface PaginatedResponse {
  services: Service[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
