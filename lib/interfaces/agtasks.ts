// DomainProtocol
export interface Protocol {
    domainId: string // FK a 360 Domain
    id: string
    tmProtocolId: string // FK a Jira Request Template ID
    name: string
    language: string
    createdAt?: string
    updatedAt?: string
  }
  
  // DomainForm
  export interface Form {
    domainId: string // FK a 360 Domain
    id: string
    ktFormId: string // FK a Kobo Toolbox Template ID
    name: string
    language: string
  }
  
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
    projectId: string 
    tmpRequestId: string
      requestId?: string
    name: string
    protocolId: string
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
    createdAt?: string 
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

  // // validation-schemas.ts
// export interface TaskAssignment {
//   task: string
//   taskType: string  // administrative, fieldvisit, tillage
//   assignedTo: string
// }