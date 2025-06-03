"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import type { FieldSchema, DynamicFormProps, SubFormFieldSchema, SelectFieldSchema, FieldOption } from "./types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react"
import { format, parseISO, isValid } from "date-fns"
import { cn } from "@/lib/utils"
import type { JSX } from "react" // Import JSX to fix the undeclared variable error

const getByPath = (obj: any, path: string): any => {
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

const setByPath = (obj: any, path: string, value: any): void => {
  const keys = path.split(".")
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    const numKey = Number(key)
    if (Number.isInteger(numKey) && Array.isArray(current)) {
      if (!current[numKey]) {
        // Si el índice no existe, créalo
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

const initializeFormData = (schema: FieldSchema[], existingData?: Record<string, any>): Record<string, any> => {
  const data: Record<string, any> = existingData ? JSON.parse(JSON.stringify(existingData)) : {}

  schema.forEach((field) => {
    const currentFieldValue = getByPath(data, field.name)
    if (currentFieldValue === undefined) {
      const defaultValue = field.defaultValue
      if (field.type === "subform") {
        const subFormSchema = field as SubFormFieldSchema
        const initialEntries: any[] = []
        const numEntries = subFormSchema.initialEntries || 0

        if (Array.isArray(defaultValue)) {
          defaultValue.forEach((entry) => {
            initialEntries.push(initializeFormData(subFormSchema.fields, entry))
          })
        } else {
          // Usa initialEntries si defaultValue no es un array
          for (let i = 0; i < numEntries; i++) {
            initialEntries.push(initializeFormData(subFormSchema.fields, {}))
          }
        }
        setByPath(data, field.name, initialEntries)
      } else if (field.type === "checkbox") {
        setByPath(data, field.name, defaultValue !== undefined ? defaultValue : false)
      } else if (field.type === "date") {
        const dateVal = defaultValue ? parseISO(defaultValue as string) : undefined
        setByPath(data, field.name, dateVal && isValid(dateVal) ? dateVal : undefined)
      } else {
        setByPath(data, field.name, defaultValue !== undefined ? defaultValue : "")
      }
    } else if (field.type === "date" && typeof currentFieldValue === "string") {
      const dateVal = parseISO(currentFieldValue as string)
      setByPath(data, field.name, dateVal && isValid(dateVal) ? dateVal : undefined)
    } else if (field.type === "subform" && Array.isArray(currentFieldValue)) {
      const subFormSchema = field as SubFormFieldSchema
      const initializedSubFormData = currentFieldValue.map((entry) => initializeFormData(subFormSchema.fields, entry))
      setByPath(data, field.name, initializedSubFormData)
    }
  })
  return data
}

export function DynamicForm({
  schema,
  onSubmit,
  initialData = {},
  submitButtonText = "Enviar",
  className,
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => initializeFormData(schema, initialData))

  useEffect(() => {
    setFormData(initializeFormData(schema, initialData))
  }, [schema, JSON.stringify(initialData)]) // JSON.stringify para dependencia profunda de initialData

  const handleStateChange = useCallback((path: string, value: any) => {
    setFormData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData))
      setByPath(newData, path, value)
      return newData
    })
  }, [])

  const addSubFormEntry = useCallback(
    (subFormPath: string, subFormSchemaDef: SubFormFieldSchema) => {
      const newEntry = initializeFormData(subFormSchemaDef.fields, {})
      const currentEntries = getByPath(formData, subFormPath) || []
      handleStateChange(subFormPath, [...currentEntries, newEntry])
    },
    [formData, handleStateChange],
  )

  const removeSubFormEntry = useCallback(
    (subFormPath: string, index: number) => {
      const currentEntries = getByPath(formData, subFormPath) || []
      const updatedEntries = currentEntries.filter((_: any, i: number) => i !== index)
      handleStateChange(subFormPath, updatedEntries)
    },
    [formData, handleStateChange],
  )

  const renderField = (field: FieldSchema, basePath = ""): JSX.Element | null => {
    const path = basePath ? `${basePath}.${field.name}` : field.name
    const id = path.replace(/\./g, "-").replace(/\[/g, "-").replace(/\]/g, "") // Asegurar IDs válidos
    const value = getByPath(formData, path)
    const commonProps = {
      id,
      name: path,
      placeholder: field.placeholder,
      disabled: field.disabled,
      required: field.required,
    }

    let fieldElement: JSX.Element

    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
        fieldElement = (
          <Input
            {...commonProps}
            type={field.type}
            value={value || ""}
            onChange={(e) => handleStateChange(path, e.target.value)}
          />
        )
        break
      case "textarea":
        fieldElement = (
          <Textarea
            {...commonProps}
            rows={(field as any).rows}
            value={value || ""}
            onChange={(e) => handleStateChange(path, e.target.value)}
          />
        )
        break
      case "select": {
        const selectField = field as SelectFieldSchema
        let options: FieldOption[] = []

        if (typeof selectField.options === "function") {
          const dependentPath = selectField.dependsOn
            ? basePath
              ? `${basePath}.${selectField.dependsOn}`
              : selectField.dependsOn
            : ""
          const dependentValue = selectField.dependsOn ? getByPath(formData, dependentPath) : null
          options = selectField.options(dependentValue, formData)
        } else if (Array.isArray(selectField.options)) {
          options = selectField.options
        } else if (typeof selectField.options === "object" && selectField.dependsOn) {
          // Nueva lógica para options como objeto dependiente
          const dependentPath = selectField.dependsOn
            ? basePath
              ? `${basePath}.${selectField.dependsOn}`
              : selectField.dependsOn
            : ""
          const dependentValue = getByPath(formData, dependentPath)
          if (
            dependentValue &&
            typeof dependentValue === "string" &&
            (selectField.options as Record<string, FieldOption[]>)[dependentValue]
          ) {
            options = (selectField.options as Record<string, FieldOption[]>)[dependentValue]
          } else {
            // Opciones por defecto o vacías si el valor dependiente no existe o no tiene opciones
            options = []
          }
        }
        // El resto del case "select" (SelectTrigger, SelectContent, etc.) permanece igual
        fieldElement = (
          <Select
            value={value || ""}
            onValueChange={(val) => handleStateChange(path, val)}
            disabled={field.disabled || options.length === 0} // Deshabilitar si no hay opciones
            required={field.required}
          >
            <SelectTrigger id={id} className="w-full">
              <SelectValue
                placeholder={
                  field.placeholder ||
                  (options.length === 0 && selectField.dependsOn
                    ? "Selecciona primero el campo anterior"
                    : "Seleccionar...")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value.toString()} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
        break
      }
      case "file":
      case "geojson":
      case "mbtile": {
        let accept = (field as any).accept
        if (field.type === "geojson" && !accept) accept = ".geojson,.json"
        if (field.type === "mbtile" && !accept) accept = ".mbtiles"
        fieldElement = (
          <Input
            id={id}
            name={path}
            type="file"
            accept={accept}
            disabled={field.disabled}
            required={field.required}
            onChange={(e) => handleStateChange(path, e.target.files ? e.target.files[0] : null)}
            className="pt-1.5" // Ajuste para alinear mejor el texto del botón de archivo
          />
        )
        break
      }
      case "date":
        const dateValue =
          value instanceof Date && isValid(value)
            ? value
            : typeof value === "string" && isValid(parseISO(value))
              ? parseISO(value)
              : undefined
        fieldElement = (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !dateValue && "text-muted-foreground")}
                id={id}
                disabled={field.disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateValue ? format(dateValue, "PPP") : <span>{field.placeholder || "Seleccionar fecha"}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date) => handleStateChange(path, date)}
                initialFocus
                disabled={field.disabled}
              />
            </PopoverContent>
          </Popover>
        )
        break
      case "checkbox":
        fieldElement = (
          <Checkbox
            id={id}
            checked={!!value}
            onCheckedChange={(checked) => handleStateChange(path, checked)}
            disabled={field.disabled}
            required={field.required}
          />
        )
        break
      case "subform": {
        const subFormField = field as SubFormFieldSchema
        const subFormEntries = (getByPath(formData, path) as any[]) || []

        return (
          <Card className={cn("mt-2 border-dashed", field.className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
              <CardTitle className="text-lg">{field.label}</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSubFormEntry(path, subFormField)}
                disabled={field.disabled}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {subFormField.addButtonLabel || "Añadir"}
              </Button>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {field.description && <p className="text-sm text-muted-foreground mb-2">{field.description}</p>}
              {subFormEntries.length === 0 && <p className="text-sm text-muted-foreground py-2">No hay entradas.</p>}
              {subFormEntries.map((entryData, index) => (
                <Card key={`${id}-entry-${index}`} className="mb-4 overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between py-2 px-3 bg-muted/50">
                    <h4 className="font-medium text-sm">
                      {subFormField.entryLabel
                        ? subFormField.entryLabel(index, entryData)
                        : `${field.label} #${index + 1}`}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubFormEntry(path, index)}
                      disabled={field.disabled}
                      aria-label={`Eliminar ${field.label} #${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-3 space-y-4">
                    {subFormField.fields.map((subField) => renderField(subField, `${path}.${index}`))}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )
      }
      default:
        return null
    }

    const fieldWrapperClass = field.type === "checkbox" ? "flex flex-row items-center space-x-2" : "space-y-1"

    return (
      <div className={cn(fieldWrapperClass, field.className)}>
        {field.type !== "checkbox" && (
          <Label htmlFor={id}>
            {field.label}
            {field.required && <span className="text-destructive">*</span>}
          </Label>
        )}
        {fieldElement}
        {field.type === "checkbox" && (
          <Label htmlFor={id} className="cursor-pointer select-none">
            {field.label}
            {field.required && <span className="text-destructive">*</span>}
          </Label>
        )}
        {field.description && field.type !== "subform" && (
          <p className="text-xs text-muted-foreground pt-1">{field.description}</p>
        )}
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {schema.map((field) => (
        <div key={field.name}>{renderField(field)}</div>
      ))}
      <Button type="submit" className="w-full sm:w-auto">
        {submitButtonText}
      </Button>
    </form>
  )
}
