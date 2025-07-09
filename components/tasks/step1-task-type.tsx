"use client"
import { useFormContext } from "react-hook-form"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams } from "next/navigation"
import { DynamicForm } from "@/components/dynamic-form/dynamic-form"
import { convertJSONSchemaToFields, isJSONSchema } from "@/components/dynamic-form/utils"

export default function Step1TaskType() {
  const { register, setValue, watch } = useFormContext()
  const params = useParams()
  const { locale } = params as { locale: string }
  const [taskTypes, setTaskTypes] = useState<string[]>([])
  const [selectedJson, setSelectedJson] = useState<any>(null)
  const selectedType = watch("taskType")
  const taskData = watch("taskData")
  const [localTaskData, setLocalTaskData] = useState<any>(taskData || {})

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
      fetch(`/schemas/${locale}/${selectedType}.json`).then(r => r.json()).then(setSelectedJson)
    } else {
      setSelectedJson(null)
    }
  }, [selectedType, locale])

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
        <Select value={selectedType} onValueChange={v => setValue("taskType", v)} required>
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