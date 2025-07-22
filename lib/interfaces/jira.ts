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

// QUEUE
export interface QueueIssueResponse {
    _expands: any[]
    size: number
    start: number
    limit: number
    isLastPage: boolean
    _links: {
        base: string
        context: string
        next: string
        prev: string
    }
    values: Value[]
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
    avatarUrls: {
        "16x16": string
        "24x24": string
        "32x32": string
        "48x48": string
    }
    self: string
}

// ISSUE
export interface JiraStatus {
    name: string;
}

export interface JiraSubtask {
    key: string;
    fields: {
        summary: string;
        status: JiraStatus;
        [key: string]: any; // Para campos personalizados dinámicos
    };
}

export interface JiraIssue {
    key: string;
    fields: {
        summary: string;
        subtasks?: JiraSubtask[];
        [key: string]: any;
    };
}

export interface SubtaskResult {
    key: string;
    summary: string;
    status: string;
    customFields?: Record<string, any>; // Objeto para almacenar custom fields
}

export interface ListTasksResult {
    issueKey: string;
    issueSummary: string;
    subtasks: SubtaskResult[];
}

export interface JiraDescriptionFields {
    description: string;
    descriptionPlain: string;
}

export interface JiraCustomerData {
    displayName: string
    email: string
}

export interface JiraRequest {
    summary: string
    description: string
}

export interface JiraResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

// export interface JiraServiceResponse {
//   success: boolean;
//   data?: any;
//   error?: string;
// }

// REQUEST  
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

export interface JiraSubtaskResponse {
    id: string;
    key: string;
    self: string;
    [key: string]: any;
}

// export interface PaginatedResponse {
//   services: Service[]
//   total: number
//   page: number
//   pageSize: number
//   totalPages: number
// }

// export interface JiraRequestData {
//   email: string
//   request: string
//   domain: string
//   area: string
//   workspace: string
//   season: string
//   farm: string
//   date_requested: string
//   date_limit: string
//   reason?: string
//   objective?: string
//   comments?: string
//   participants?: string[]
// }

// esta interface fue reemplazada por JiraServiceRequest
// export interface JiraCustomerRequestData {
//   isAdfRequest: boolean
//   raiseOnBehalfOf?: string // Email del usuario en cuyo nombre se crea la solicitud
//   requestFieldValues: {
//     summary: string
//     description?: string
//     [key: string]: any // Para campos personalizados
//   }
//   requestParticipants?: string[] // Array de emails de participantes
//   requestTypeId: string
//   serviceDeskId: string
// }