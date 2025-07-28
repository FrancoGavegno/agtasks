"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { useTaskForm } from "@/lib/contexts/tasks-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { DynamicForm } from "./dynamic-form"
import { 
  convertJSONSchemaToFields, 
  isJSONSchema 
} from "@/lib/utils"
import { apiClient } from "@/lib/integrations/amplify"
import { type Schema } from "@/amplify/data/resource";

export default function Step1TaskType() {
  const { 
    register, 
    setValue, 
    watch 
  } = useFormContext()
  const { mode } = useTaskForm()
  const params = useParams()
  const { locale, domain } = params as { locale: string, domain: string }
  const [taskTypes, setTaskTypes] = useState<string[]>([])
  const [selectedJson, setSelectedJson] = useState<any>(null)
  const selectedType = watch("taskType")
  const selectedForm = watch("formId")
  const taskData = watch("taskData")
  const [domainForms, setDomainForms] = useState<Schema["DomainForm"]["type"][]>([])
  const isEditMode = mode === 'edit'

  // Parse taskData for DynamicForm
  const parsedTaskData = (() => {
    if (!taskData) return {}
    try {
      return typeof taskData === 'string' ? JSON.parse(taskData) : taskData
    } catch (error) {
      console.error("Error parsing task data:", error)
      return {}
    }
  })()

  useEffect(() => {
    async function fetchTaskTypes() {
      const res = await fetch(`/api/schemas/${locale}`)
      const data = await res.json()
      setTaskTypes(Array.isArray(data) ? data : [])
    }
    fetchTaskTypes()
  }, [locale])

  useEffect(() => {
    if (selectedType) {
      // DomainForm[]
      if (selectedType === "fieldvisit") {
        const fetchDomainForms = async () => {
          const formsData = await apiClient.listDomainForms(domain)
          setDomainForms(formsData.items as Schema["DomainForm"]["type"][])
        }

        fetchDomainForms()
      } else {
        // Limpiar formId y domainForms cuando no es fieldvisit
        setValue("formId", "")
        setDomainForms([])
      }

      // JSON schema  
      fetch(`/schemas/${locale}/${selectedType}.json`).then(r => r.json()).then(setSelectedJson)
    } else {
      setSelectedJson(null)
      setDomainForms([])
    }
  }, [locale, domain, selectedType, setValue])

  let schemaFields = null
  if (selectedJson && isJSONSchema(selectedJson)) {
    schemaFields = convertJSONSchemaToFields(selectedJson)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Nombre de la Tarea *</Label>
        <Input 
          {...register("taskName", { required: true })} 
          disabled={isEditMode}
          className={isEditMode ? "bg-gray-50" : ""}
        />
      </div>

      <div>
        <Label>Tipo de Tarea *</Label>
        <Select 
          value={selectedType} 
          onValueChange={v => setValue("taskType", v)} 
          disabled={isEditMode}
          required>
          <SelectTrigger className={isEditMode ? "bg-gray-50" : ""}>
            <SelectValue placeholder="Selecciona un tipo de tarea" />
          </SelectTrigger>
          <SelectContent>
            {taskTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(Array.isArray(domainForms) && domainForms.length > 0) && (
        <div>
          <Label>Formulario *</Label>
          <Select 
            value={selectedForm}
            onValueChange={v => setValue("formId", v)} 
            disabled={isEditMode}
          >
            <SelectTrigger className={isEditMode ? "bg-gray-50" : ""}>
              <SelectValue placeholder="Selecciona un tipo de formulario" />
            </SelectTrigger>
            <SelectContent>
              {domainForms.map(form => (
                <SelectItem key={form.id} value={form.id}>{form.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {schemaFields && (
        <div className="mt-6">
          <DynamicForm
            schema={schemaFields}
            initialData={parsedTaskData}
          />
        </div>
      )}

    </div>
  )
} 