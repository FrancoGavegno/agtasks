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
    tmpSubtaskId?: string  
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

// Dynamic Form Types 
export interface FieldOption {
  label: string
  value: string | number
}

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "file"
  | "date"
  | "checkbox"
  | "subform"

export interface BaseFieldSchema {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  description?: string
  defaultValue?: any
  required?: boolean
  disabled?: boolean
  className?: string
}

export interface InputFieldSchema extends BaseFieldSchema {
  type: "text" | "email" | "password" | "number"
}

export interface TextareaFieldSchema extends BaseFieldSchema {
  type: "textarea"
  rows?: number
}

export interface SelectFieldSchema extends BaseFieldSchema {
  type: "select"
  options: FieldOption[]
}

export interface FileFieldSchema extends BaseFieldSchema {
  type: "file"
  accept?: string
}

export interface DateFieldSchema extends BaseFieldSchema {
  type: "date"
}

export interface CheckboxFieldSchema extends BaseFieldSchema {
  type: "checkbox"
}

export interface SubFormFieldSchema extends BaseFieldSchema {
  type: "subform"
  fields: FieldSchema[]
  addButtonLabel?: string
  initialEntries?: number
  entryLabel?: (index: number, entryData: Record<string, any>) => string
}

export type FieldSchema =
  | InputFieldSchema
  | TextareaFieldSchema
  | SelectFieldSchema
  | FileFieldSchema
  | DateFieldSchema
  | CheckboxFieldSchema
  | SubFormFieldSchema

export interface DynamicFormProps {
  schema: FieldSchema[]
  onSubmit?: (formData: Record<string, any>) => void
  initialData?: Record<string, any>
  submitButtonText?: string
  className?: string
}

// JSON Schema types
export interface JSONSchemaProperty {
  type: string
  title?: string
  description?: string
  enum?: (string | number)[]
  format?: string
  minimum?: number
  maximum?: number
  items?: JSONSchemaProperty
  properties?: Record<string, JSONSchemaProperty>
  required?: string[]
  default?: any
}

export interface JSONSchema {
  type: "object"
  properties: Record<string, JSONSchemaProperty>
  required?: string[]
  title?: string
  description?: string
}