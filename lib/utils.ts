import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FieldSchema, FieldOption, JSONSchema, JSONSchemaProperty } from "./interfaces/agtasks"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(word: string) { 
  return word.charAt(0).toUpperCase() + word.slice(1); 
}

// Dynamic Form Utils 
export function convertJSONSchemaToFields(jsonSchema: JSONSchema): FieldSchema[] {
  const fields: FieldSchema[] = []
  const requiredFields = jsonSchema.required || []

  for (const [fieldName, property] of Object.entries(jsonSchema.properties)) {
    const field = convertProperty(fieldName, property, requiredFields.includes(fieldName))
    if (field) {
      fields.push(field)
    }
  }

  return fields
}

function convertProperty(name: string, property: JSONSchemaProperty, isRequired = false): FieldSchema | null {
  const baseField = {
    name,
    label: property.title || name,
    description: property.description,
    required: isRequired,
    defaultValue: property.default,
  }

  // Handle enums (convert to select)
  if (property.enum && property.enum.length > 0) {
    const options: FieldOption[] = property.enum.map((value) => ({
      label: value.toString(),
      value: value,
    }))

    return {
      ...baseField,
      type: "select",
      options,
    }
  }

  // Handle different types
  switch (property.type) {
    case "string":
      if (property.format === "email") {
        return { ...baseField, type: "email" }
      }
      if (property.format === "uri" || property.format === "url") {
        return { ...baseField, type: "text", placeholder: "https://ejemplo.com" }
      }
      if (property.format === "date") {
        return { ...baseField, type: "date" }
      }
      return { ...baseField, type: "text" }

    case "number":
    case "integer":
      return { ...baseField, type: "number" }

    case "boolean":
      return { ...baseField, type: "checkbox", defaultValue: property.default || false }

    case "array":
      if (property.items && property.items.type === "object" && property.items.properties) {
        const subFields = convertJSONSchemaToFields({
          type: "object",
          properties: property.items.properties,
          required: property.items.required || [],
        })

        return {
          ...baseField,
          type: "subform",
          fields: subFields,
          addButtonLabel: `Añadir ${baseField.label}`,
          initialEntries: 0,
        }
      }
      return { ...baseField, type: "textarea", placeholder: "Ingrese elementos separados por comas" }

    default:
      return { ...baseField, type: "text" }
  }
}

export function isJSONSchema(data: any): data is JSONSchema {
  return typeof data === "object" && data !== null && data.type === "object" && typeof data.properties === "object"
}

// Helper functions for dynamic form
export const getByPath = (obj: any, path: string): any => {
  const keys = path.split(".")
  let current = obj
  for (const key of keys) {
    if (current === null || current === undefined) return undefined
    const numKey = Number(key)
    if (Number.isInteger(numKey) && Array.isArray(current)) {
      current = current[numKey]
    } else if (typeof current === "object" && key in current) {
      current = current[key]
    } else {
      return undefined
    }
  }
  return current
}

export const setByPath = (obj: any, path: string, value: any): void => {
  const keys = path.split(".")
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    const numKey = Number(key)
    if (Number.isInteger(numKey) && Array.isArray(current)) {
      if (!current[numKey]) {
        const nextKeyIsNumber = Number.isInteger(Number(keys[i + 1]))
        current[numKey] = nextKeyIsNumber ? [] : {}
      }
      current = current[numKey]
    } else {
      if (!current[key] || typeof current[key] !== "object") {
        const nextKeyIsNumber = Number.isInteger(Number(keys[i + 1]))
        current[key] = nextKeyIsNumber ? [] : {}
      }
      current = current[key]
    }
  }
  const lastKey = keys[keys.length - 1]
  const lastNumKey = Number(lastKey)
  if (Number.isInteger(lastNumKey) && Array.isArray(current)) {
    current[lastNumKey] = value
  } else {
    current[lastKey] = value
  }
}

export const initializeFormData = (schema: FieldSchema[], existingData?: Record<string, any>): Record<string, any> => {
  const data: Record<string, any> = existingData ? JSON.parse(JSON.stringify(existingData)) : {}

  schema.forEach((field) => {
    const currentFieldValue = getByPath(data, field.name)
    if (currentFieldValue === undefined) {
      const defaultValue = field.defaultValue
      if (field.type === "subform") {
        const subFormSchema = field as any
        const initialEntries: any[] = []
        const numEntries = subFormSchema.initialEntries || 0

        if (Array.isArray(defaultValue)) {
          defaultValue.forEach((entry: any) => {
            initialEntries.push(initializeFormData(subFormSchema.fields, entry))
          })
        } else {
          for (let i = 0; i < numEntries; i++) {
            initialEntries.push(initializeFormData(subFormSchema.fields, {}))
          }
        }
        setByPath(data, field.name, initialEntries)
      } else if (field.type === "checkbox") {
        setByPath(data, field.name, defaultValue !== undefined ? defaultValue : false)
      } else if (field.type === "date") {
        const dateVal = defaultValue ? new Date(defaultValue as string) : undefined
        setByPath(data, field.name, dateVal && !isNaN(dateVal.getTime()) ? dateVal : undefined)
      } else {
        setByPath(data, field.name, defaultValue !== undefined ? defaultValue : "")
      }
    } else if (field.type === "date" && typeof currentFieldValue === "string") {
      const dateVal = new Date(currentFieldValue as string)
      setByPath(data, field.name, dateVal && !isNaN(dateVal.getTime()) ? dateVal : undefined)
    } else if (field.type === "subform" && Array.isArray(currentFieldValue)) {
      const subFormSchema = field as any
      const initializedSubFormData = currentFieldValue.map((entry: any) => initializeFormData(subFormSchema.fields, entry))
      setByPath(data, field.name, initializedSubFormData)
    }
  })
  return data
}


// Utility function to serialize model data
export function serializeModelData<T extends Record<string, any>>(data: T): Omit<T, keyof T & Function> {
  const serialized = {} as Partial<T>
  for (const [key, value] of Object.entries(data)) {
    if (typeof value !== "function") {
      // Type assertion is safe here because we check for non-function
      serialized[key as keyof T] = value
    }
  }
  return serialized as Omit<T, keyof T & Function>
}

// export function serializeModelArray<T extends Record<string, any>>(data: T[]): Omit<T, keyof T & Function>[] {
//   return data.map((item) => serializeModelData(item))
// }

// Type-safe serialization for specific models
export type SerializedProject = Omit<any, "services" | "tasks"> & {
  services?: any[]
  tasks?: any[]
}

export type SerializedService = Omit<any, "project" | "tasks"> & {
  project?: any
  tasks?: any[]
}

export type SerializedTask = Omit<any, "project" | "service" | "fields"> & {
  project?: any
  service?: any
  fields?: any[]
}

export type SerializedField = Omit<any, "task"> & {
  task?: any
}
