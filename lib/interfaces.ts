export interface Space {
  id: string
  name: string
  color: string
  private: boolean
  avatar: string
  admin_can_manage: boolean
  statuses: Status[]
  multiple_assignees: boolean
  features: {
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
  priority?: {
    id: string
    priority: string
    color: string
    orderindex: string
  }
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
    name: string, 
    image: string }[]
  thumbnail?: string
}

export interface Status {
  id: string
  status: string
  orderindex: number
  color: string
  type: string
  status_group?: string
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

// Custom Fields

export interface Field {
  id:               string
  name:             string
  type:             string
  type_config:      TypeConfig
  date_created:     string
  hide_from_guests: boolean
  required:         boolean
}

export interface TypeConfig {
  sorting?:       string
  new_drop_down?: boolean
  options?:       Option[]
}

export interface Option {
  id:         string
  name:       string
  color:      null
  orderindex: number
}
