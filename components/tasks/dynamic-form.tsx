"use client"

import type React from "react"
import { 
  useState, 
  useCallback,
  useEffect
} from "react"
import { useFormContext } from "react-hook-form"
import type { 
  FieldSchema, 
  DynamicFormProps, 
  SubFormFieldSchema, 
  SelectFieldSchema 
} from "@/lib/interfaces/agtasks"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { 
  CalendarIcon, 
  PlusCircle, 
  Trash2 
} from "lucide-react"
import { 
  format, 
  parseISO, 
  isValid 
} from "date-fns"
import { 
  cn, 
  getByPath, 
  setByPath, 
  initializeFormData 
} from "@/lib/utils"
import type { JSX } from "react"

export function DynamicForm({
  schema,
  initialData = {},
  className,
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => initializeFormData(schema, initialData))
  const { setValue } = useFormContext()

  const handleStateChange = useCallback((path: string, value: any) => {
    setFormData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData))
      setByPath(newData, path, value)
      return newData
    })
  }, [])

  // Sync with parent form when formData changes
  useEffect(() => {
    setValue("taskData", formData)
  }, [formData, setValue])

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

  const renderTableCell = (field: FieldSchema, basePath: string, rowIndex: number): JSX.Element => {
    const path = `${basePath}.${rowIndex}.${field.name}`
    const value = getByPath(formData, path)

    const cellProps = {
      className: "h-8 text-sm border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded-none",
      value: value || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleStateChange(path, e.target.value),
    }

    switch (field.type) {
      case "text":
      case "email":
      case "password":
        return <Input {...cellProps} type={field.type} placeholder={field.placeholder} />
      case "number":
        return <Input {...cellProps} type="number" placeholder={field.placeholder} />
      case "select": {
        const selectField = field as SelectFieldSchema
        return (
          <Select value={value || ""} onValueChange={(val) => handleStateChange(path, val)}>
            <SelectTrigger className="h-8 text-sm border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded-none">
              <SelectValue placeholder={field.placeholder || "Seleccionar..."} />
            </SelectTrigger>
            <SelectContent>
                {selectField.options.map((opt: { value: string | number; label: string }) => (
                <SelectItem key={opt.value.toString()} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )
      }
      case "checkbox":
        return (
          <div className="flex justify-center">
            <Checkbox
              checked={!!value}
              onCheckedChange={(checked) => handleStateChange(path, checked)}
              className="h-4 w-4"
            />
          </div>
        )
      default:
        return <Input {...cellProps} placeholder={field.placeholder} />
    }
  }

  const renderField = (field: FieldSchema, basePath = ""): JSX.Element | null => {
    const path = basePath ? `${basePath}.${field.name}` : field.name
    const id = path.replace(/\./g, "-").replace(/\[/g, "-").replace(/\]/g, "")
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
        fieldElement = (
          <Select
            value={value || ""}
            onValueChange={(val) => handleStateChange(path, val)}
            disabled={field.disabled}
            required={field.required}
          >
            <SelectTrigger id={id} className="w-full">
              <SelectValue placeholder={field.placeholder || "Seleccionar..."} />
            </SelectTrigger>
            <SelectContent>
                {selectField.options.map((opt: { value: string | number; label: string }) => (
                <SelectItem key={opt.value.toString()} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )
        break
      }
      case "file": {
        const accept = (field as any).accept
        fieldElement = (
          <Input
            id={id}
            name={path}
            type="file"
            accept={accept}
            disabled={field.disabled}
            required={field.required}
            onChange={(e) => handleStateChange(path, e.target.files ? e.target.files[0] : null)}
            className="pt-1.5"
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
          <div className={cn("space-y-4", field.className)}>
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
              </Label>
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
            </div>

            {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}

            {subFormEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
                No hay entradas. Haz clic en "Añadir" para crear una nueva entrada.
              </p>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        {subFormField.fields.map((subField: FieldSchema) => (
                        <th
                          key={subField.name}
                          className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
                        >
                          {subField.label}
                          {subField.required && <span className="text-destructive ml-1">*</span>}
                        </th>
                        ))}
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 w-16">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subFormEntries.map((_, rowIndex) => (
                        <tr
                        key={`${id}-row-${rowIndex}`}
                        className={cn(
                          "border-b border-gray-200 last:border-b-0",
                          rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                        )}
                        >
                        {subFormField.fields.map((subField: FieldSchema) => (
                          <td key={subField.name} className="px-4 py-2 border-r border-gray-200 last:border-r-0">
                          {renderTableCell(subField, path, rowIndex)}
                          </td>
                        ))}
                        <td className="px-4 py-2 text-center">
                          <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSubFormEntry(path, rowIndex)}
                          disabled={field.disabled}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Eliminar fila ${rowIndex + 1}`}
                          >
                          <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
        {field.description && (
          <p className="text-xs text-muted-foreground pt-1">{field.description}</p>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {schema.map((field: FieldSchema) => (
        <div key={field.name}>{renderField(field)}</div>
      ))}
    </div>
  )
} 