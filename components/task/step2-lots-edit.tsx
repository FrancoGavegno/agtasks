"use client"

import { useState, useEffect, useRef } from "react"
import { useFormContext } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  listFields
} from "@/lib/integrations/360"
import type {
  LotField
} from "@/lib/interfaces/360"

interface Props {
  userEmail: string
  initialFields?: any[]
}

export default function Step2LotsEdit({ userEmail, initialFields = [] }: Props) {
  const form = useFormContext<any>()

  // State for API data
  const [fields, setFields] = useState<LotField[]>([])
  const [fieldsLoading, setFieldsLoading] = useState(false)
  const [fieldsError, setFieldsError] = useState<string | null>(null)

  const selectedLots = form.watch("fields") || []

  // Pre-llenar campos si hay initialFields
  useEffect(() => {
    console.log("Debug - Step2LotsEdit initialFields:", initialFields)
    console.log("Debug - Step2LotsEdit initialFields length:", initialFields.length)
    console.log("Debug - Step2LotsEdit initialFields[0]:", initialFields[0])
    
    if (initialFields.length > 0) {
      form.setValue("fields", initialFields)
    }
  }, [initialFields, form])

  // Cargar los lotes cuando se tengan los datos necesarios
  useEffect(() => {
    const fetchFields = async () => {
      if (initialFields.length === 0) return
      
      const firstField = initialFields[0]
      if (!firstField?.workspaceId || !firstField?.campaignId || !firstField?.farmId) {
        console.log("Debug - Missing required IDs for fetching fields")
        return
      }

      try {
        setFieldsLoading(true)
        console.log("Debug - Fetching fields with:", {
          workspace: firstField.workspaceId,
          campaign: firstField.campaignId,
          establishment: firstField.farmId
        })
        
        const fieldsData = await listFields(
          firstField.workspaceId,
          firstField.campaignId,
          firstField.farmId
        )
        setFields(fieldsData)
        setFieldsError(null)
        console.log("Debug - Fields loaded:", fieldsData.length)
      } catch (error) {
        console.error("Error fetching fields:", error)
        setFieldsError("Failed to load fields. Please try again later.")
        setFields([])
      } finally {
        setFieldsLoading(false)
      }
    }

    fetchFields()
  }, [initialFields])

  const allLotIds = fields.map(field => field.id.toString())
  const selectedLotIds = selectedLots.map((lot: any) => lot.fieldId)
  const allSelected = allLotIds.length > 0 && allLotIds.every(id => selectedLotIds.includes(id))
  const someSelected = allLotIds.some(id => selectedLotIds.includes(id)) && !allSelected

  const selectAllRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected
    }
  }, [someSelected])

  const handleLotSelection = (lotId: string) => {
    const currentLots = form.getValues("fields") || []
    const selectedField = fields.find((field) => field.id.toString() === lotId)
    if (!selectedField) return
    
    const firstField = initialFields[0] || {}
    const lotDetail = {
      fieldId: selectedField.id.toString(),
      fieldName: selectedField.name || "",
      hectares: selectedField.hectares || 0,
      crop: selectedField.cropName || "",
      hybrid: selectedField.hybridName || "",
      workspaceId: firstField.workspaceId || "",
      workspaceName: firstField.workspaceName || "",
      campaignId: firstField.campaignId || "",
      campaignName: firstField.campaignName || "",
      farmId: firstField.farmId || "",
      farmName: firstField.farmName || "",
    }
    
    let newLots: any[]
    if (currentLots.some((lot: any) => lot.fieldId === lotId)) {
      newLots = currentLots.filter((lot: any) => lot.fieldId !== lotId)
    } else {
      newLots = [...currentLots, lotDetail]
    }
    form.setValue("fields", newLots, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
  }

  const handleToggleAllLots = () => {
    if (allSelected) {
      form.setValue("fields", [], { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    } else {
      const firstField = initialFields[0] || {}
      const newLots = fields.map(selectedField => ({
        fieldId: selectedField.id.toString(),
        fieldName: selectedField.name,
        hectares: selectedField.hectares,
        crop: selectedField.cropName,
        hybrid: selectedField.hybridName || "",
        workspaceId: firstField.workspaceId || "",
        workspaceName: firstField.workspaceName || "",
        campaignId: firstField.campaignId || "",
        campaignName: firstField.campaignName || "",
        farmId: firstField.farmId || "",
        farmName: firstField.farmName || "",
      }))
      form.setValue("fields", newLots, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    }
  }

  // Obtener los nombres de los campos desde initialFields
  const firstField = initialFields[0] || {}
  const workspaceName = firstField.workspaceName || "No disponible"
  const campaignName = firstField.campaignName || "No disponible"
  const farmName = firstField.farmName || "No disponible"

  console.log("Debug - Step2LotsEdit render - firstField:", firstField)
  console.log("Debug - Step2LotsEdit render - names:", { workspaceName, campaignName, farmName })

  console.log("Debug - Step2LotsEdit render - selectedLots:", selectedLots.length)
  console.log("Debug - Step2LotsEdit render - fields:", fields.length)
  console.log("Debug - Step2LotsEdit render - names:", { workspaceName, campaignName, farmName })

  return (
    <div className="space-y-6">
      {initialFields.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No hay datos de lotes disponibles para esta tarea.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Workspace Display */}
            <div>
              <FormLabel>Espacio de trabajo</FormLabel>
              <Input 
                value={workspaceName} 
                readOnly 
                className="bg-gray-50"
              />
            </div>

            {/* Campaign Display */}
            <div>
              <FormLabel>Campaña</FormLabel>
              <Input 
                value={campaignName} 
                readOnly 
                className="bg-gray-50"
              />
            </div>

            {/* Farm Display */}
            <div>
              <FormLabel>Establecimiento</FormLabel>
              <Input 
                value={farmName} 
                readOnly 
                className="bg-gray-50"
              />
            </div>
          </div>

      {/* Fields (Lots) Table */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Lotes disponibles</h3>
        {fieldsLoading ? (
          <div className="text-center py-8 text-muted-foreground">Cargando lotes...</div>
        ) : fieldsError ? (
          <div className="text-center py-8 text-red-500">{fieldsError}</div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <input
                      type="checkbox"
                      ref={selectAllRef}
                      checked={allSelected}
                      onChange={handleToggleAllLots}
                      aria-label="Seleccionar todos los lotes"
                      className="h-4 w-4 accent-primary rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <span className="ml-2">Seleccionar</span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Lote
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cultivo/Híbrido
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Hectáreas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fields.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No hay lotes disponibles para este establecimiento
                    </td>
                  </tr>
                ) : (
                  fields.map((field) => (
                    <tr key={field.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Checkbox
                          id={`lot-${field.id}`}
                          checked={selectedLots?.some((lot: any) => lot.fieldId === field.id.toString())}
                          onCheckedChange={() => handleLotSelection(field.id.toString())}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {field.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {field.cropName} {field.hybridName ? `/ ${field.hybridName}` : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {field.hectares}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <FormField
          control={form.control}
          name="fields"
          render={({ fieldState }) => (
            <FormItem>
              {fieldState.invalid && fieldState.isTouched && <FormMessage className="text-red-500 mt-2" />}
            </FormItem>
          )}
                 />
       </div>
     </>
   )}
 </div>
)
} 