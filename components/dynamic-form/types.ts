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
  | "geojson" // Se tratará como 'file' con accept=".geojson,.json"
  | "mbtile" // Se tratará como 'file' con accept=".mbtiles"
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
  options:
    | FieldOption[]
    | Record<string, FieldOption[]>
    | ((dependentValue: any, allFormData: Record<string, any>) => FieldOption[])
  dependsOn?: string
}

export interface FileFieldSchema extends BaseFieldSchema {
  type: "file" | "geojson" | "mbtile"
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
}
