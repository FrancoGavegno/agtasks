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
  onSubmit: (formData: Record<string, any>) => void
  initialData?: Record<string, any>
  submitButtonText?: string
  className?: string
  onChange?: (formData: Record<string, any>) => void
  useFormWrapper?: boolean
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
