"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
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
import { Task } from "@/lib/interfaces/agtasks";

interface Step1TaskTypeProps {
  mode?: 'create' | 'edit'
  initialData?: Task
}

export default function Step1TaskType({ mode = 'create', initialData }: Step1TaskTypeProps) {
  const { 
    register, 
    setValue, 
    watch 
  } = useFormContext()
  const params = useParams()
  const { locale, domain } = params as { locale: string, domain: string }
  const [taskTypes, setTaskTypes] = useState<string[]>([])
  const [selectedJson, setSelectedJson] = useState<any>(null)
  const selectedType = watch("taskType")
  const selectedForm = watch("formId")
  const taskData = watch("taskData")
  const [localTaskData, setLocalTaskData] = useState<any>(taskData || {})
  const [domainForms, setDomainForms] = useState<Schema["DomainForm"]["type"][]>([])
  const isEditMode = mode === 'edit'

  // Pre-llenar datos si es modo edición
  useEffect(() => {
    if (isEditMode && initialData) {
      setValue("taskName", initialData.taskName || "")
      setValue("taskType", initialData.taskType || "")
      setValue("formId", initialData.formId || "")
      if (initialData.taskData) {
        try {
          const parsedData = typeof initialData.taskData === 'string' 
            ? JSON.parse(initialData.taskData) 
            : initialData.taskData
          setValue("taskData", parsedData)
          setLocalTaskData(parsedData)
        } catch (error) {
          console.error("Error parsing task data:", error)
        }
      }
    }
  }, [isEditMode, initialData, setValue])

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
      setDomainForms([])
      setValue("formId", "");

      // DomainForm[]
      if (selectedType === "fieldvisit") {
        const fetchDomainForms = async () => {
          const formsData = await apiClient.listDomainForms(domain)
          setDomainForms(formsData.items as Schema["DomainForm"]["type"][])
        }

        fetchDomainForms()
      } else {
        // Limpiar formId cuando no es fieldvisit
        setValue("formId", "")
      }

      // JSON schema  
      fetch(`/schemas/${locale}/${selectedType}.json`).then(r => r.json()).then(setSelectedJson)
    } else {
      // setDomainForms()
      setSelectedJson(null)
    }
  }, [locale, domain, selectedType])

  // useEffect(() => {
  //   setLocalTaskData(taskData || {})
  // }, [taskData])

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
            initialData={localTaskData}
          />
        </div>
      )}

    </div>
  )
} 