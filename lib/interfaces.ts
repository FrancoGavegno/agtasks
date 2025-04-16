// Organization/Users

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
    hasLogo: boolean
    domainUrl: string
    deleted: boolean
}


// Settings

export interface Protocol {
  id: string
  name: string
  language: string // "PT" | "EN" | "ES"
}

export interface Role {
  id: string
  name: string
  language: string
}

export interface Form {
  id: string
  name: string
  questions: number
}


// Projects 

export interface Project {
    id: number
    name: string
    domain: Domain
}

export interface Service {
    id: string
    name: string
    establishment: string
    lots: string
    totalHectares: number
    progress: number
    startDate: string
    status: string
}


// TM / Jira 

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
  