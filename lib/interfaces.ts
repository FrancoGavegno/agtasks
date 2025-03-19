export interface Space {
  id: string
  name: string
  color: string
  private: boolean
  avatar: string
  admin_can_manage: boolean
  statuses: Status[]
  multiple_assignees: boolean
  features?: {
    due_dates: {
      enabled: boolean
      start_date: boolean
      remap_due_dates: boolean
      remap_closed_due_date: boolean
    }
    time_tracking: {
      enabled: boolean
    }
    tags: {
      enabled: boolean
    }
    time_estimates: {
      enabled: boolean
    }
    checklists: {
      enabled: boolean
    }
    custom_fields: {
      enabled: boolean
    }
    remap_dependencies: {
      enabled: boolean
    }
    dependency_warning: {
      enabled: boolean
    }
    portfolios: {
      enabled: boolean
    }
  }
  archived: boolean
}

export interface Folder {
  id: string
  name: string
  orderindex: number
  override_statuses: boolean
  hidden?: boolean
  space: Space
  task_count: string
  archived: boolean
  statuses: Status[]
  lists: Project[]
  permission_level: string
}

export interface Project {
  id: string
  name: string
  description: string
  taskCount?: number
  deleted?: boolean
  orderindex?: number
  status?: Status
  priority?: Priority
  assignee?: null | {
    id: number
    username: string
    color: string
    initials: string
    email: string
    profilePicture: string
  }
  due_date: string | null
  start_date?: string | null
  folder?: Folder
  space?: Space
  inbound_address?: string
  archived?: boolean
  override_statuses?: boolean
  statuses?: Status[]
  permission_level?: string
  tags?: string[]
  progress?: number
  team?: {
    name: string
    image: string
  }[]
  thumbnail?: string
}

export interface Task {
  id: string
  name: string
  custom_item_id?: number
  due_date: string
  status?: Status
  priority?: Priority
  orderindex: string
  url: string
  custom_fields?: Field[]
}

export interface Status {
  id: string
  status: string
  orderindex: number
  color: string
  type: string
  status_group?: string
}

export interface Priority {
  id: string
  color: string
  orderindex: string
  priority: string
}

// Template Builder

export interface FormType {
  title: string
  description?: string
  icon?: string
}

export interface TaskType {
  taskId: string
  taskName: string
  description: string
  documentation?: string
}

export interface FieldType {
  label: string
  name: string
  type: string
  required: boolean
  placeholder?: string
  options?: string[]
  apiCall?: string
  [key: string]: string | boolean | string[] | undefined
}

// Projects

export interface TreeItem {
  id: string
  name: string
  type: "space" | "folder" | "list"
  children?: TreeItem[]
  parentId?: string
}

export interface User {
  id: string
  name: string
  email: string
}

export interface Role {
  id: string
  name: string
  color?: string
  orderindex: number
}

export interface FormData {
  [key: string]: string
}

export interface ProjectRole {
  projectId?: string
  projectName?: string
  userId: string
  userName?: string
  userEmail?: string
  roleId?: string
  roleName: string
  status: string
}

// export interface CustomField {
//   id: string
//   name: string
//   type: string
//   type_config: TypeConfig
//   value?: string | null
//   date_created: string
//   hide_from_guests: boolean
//   required: boolean
// }

export interface Field {
  id: string
  name: string
  type: string
  type_config: TypeConfig
  value?: string | null
  date_created: string
  hide_from_guests: boolean
  required: boolean
}

export interface TypeConfig {
  sorting?: string
  new_drop_down?: boolean
  options?: Option[]
}

export interface Option {
  id: string
  name: string
  color: null
  orderindex: number
}

// Jira

export interface Lote {
  id: string
  lote: string
  cultivo: string
  hectareas: number
  selected?: boolean
}

export interface AssignedUser {
  email: string
  role: string
}

// Jira Customer

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
  //customfield_10076: string
}

// export interface QueueIssuesResponse {
//   issues: any[];
//   values: any[];
//   total: number;
//   maxResults: number;
//   startAt: number;
// }

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

// -----------------

export interface JiraIssue {
  key: string
  fields: {
    summary?: string
    status?: {
      name: string
    }
  }
}

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

// Nueva interfaz para la creación de solicitudes de cliente según la API de Jira Service Desk
export interface JiraCustomerRequestData {
  serviceDeskId: string
  requestTypeId: string
  requestFieldValues: {
    summary: string
    description?: string
    [key: string]: any // Para campos personalizados
  }
  raiseOnBehalfOf?: string // Email del usuario en cuyo nombre se crea la solicitud
  requestParticipants?: string[] // Array de emails de participantes
}

