import type { FieldSchema, FieldOption, JSONSchema, JSONSchemaProperty } from "./types"

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
