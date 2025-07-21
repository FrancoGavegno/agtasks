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
import { DynamicForm } from "@/components/dynamic-form/dynamic-form"
import { 
  convertJSONSchemaToFields, 
  isJSONSchema 
} from "@/components/dynamic-form/utils"
import { listDomainForms } from "@/lib/services/agtasks"
import { type Schema } from "@/amplify/data/resource";

export default function Step1TaskType() {
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
  const selectedForm = watch("domainForm")
  const taskData = watch("taskData")
  const [localTaskData, setLocalTaskData] = useState<any>(taskData || {})
  const [domainForms, setDomainForms] = useState<Schema["DomainForm"]["type"][]>([])

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
      setValue("domainForm", null);

      // DomainForm[]
      if (selectedType === "fieldvisit") {
        const fetchDomainForms = async () => {
          const formsData = await listDomainForms(domain)
          setDomainForms(formsData)
        }

        fetchDomainForms()
      }

      // JSON schema  
      fetch(`/schemas/${locale}/${selectedType}.json`).then(r => r.json()).then(setSelectedJson)
    } else {
      // setDomainForms()
      setSelectedJson(null)
    }
  }, [locale, domain, selectedType])

  useEffect(() => {
    setLocalTaskData(taskData || {})
  }, [selectedType])

  let schemaFields = null
  if (selectedJson && isJSONSchema(selectedJson)) {
    schemaFields = convertJSONSchemaToFields(selectedJson)
  }

  const handleDynamicFormSubmit = (data: any) => {
    setLocalTaskData(data)
    setValue("taskData", data)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Nombre de la Tarea *</Label>
        <Input {...register("name", { required: true })} />
      </div>

      <div>
        <Label>Tipo de Tarea *</Label>
        <Select 
          value={selectedType} 
          onValueChange={v => setValue("taskType", v)} 
          required>
          <SelectTrigger>
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
            onValueChange={v => setValue("domainForm", v)} 
          >
            <SelectTrigger>
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

      {/* <p>selectedForm: {selectedForm}</p>
      <p>domainForms: {JSON.stringify(domainForms)}</p> */}

      {schemaFields && (
        <div className="mt-6">
          <DynamicForm
            schema={schemaFields}
            initialData={localTaskData}
            onSubmit={handleDynamicFormSubmit}
            submitButtonText={""}
          />
        </div>
      )}

    </div>
  )
} 