"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { useTaskForm } from "@/lib/contexts/tasks-context"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  listWorkspaces,
  listSeasons,
  listFarms,
  listFields
} from "@/lib/integrations/360"
// import type {
//   Workspace,
//   Season,
//   Farm,
//   LotField
// } from "@/lib/interfaces/360"
import { apiClient } from "@/lib/integrations/amplify"

interface Props {
  thisUserEmail: string
  mode?: 'create' | 'edit'
}

export default function Step2Lots({ thisUserEmail, mode }: Props) {
  const { domain, project } = useParams<{ domain: string, project: string }>()
  const domainId = Number(domain)

  const form = useFormContext<any>()
  const { 
    mode: contextMode,
    currentStep,
    tempFields,
    setTempFields,
    workspaces,
    setWorkspaces,
    campaigns,
    setCampaigns,
    establishments,
    setEstablishments,
    lots,
    setLots,
    hasLoadedWorkspaces,
    setHasLoadedWorkspaces,
    hasLoadedSeasons,
    setHasLoadedSeasons,
    hasLoadedFarms,
    setHasLoadedFarms,
    hasLoadedFields,
    setHasLoadedFields,
  } = useTaskForm()

  // Use context mode if not provided as prop
  const currentMode = mode || contextMode
  const isEditMode = currentMode === 'edit'

  // State for API data
  const [areaId, setAreaId] = useState<number>(0)

  // Loading states
  const [workspacesLoading, setWorkspacesLoading] = useState(true)
  const [seasonsLoading, setSeasonsLoading] = useState(false)
  const [farmsLoading, setFarmsLoading] = useState(false)
  const [fieldsLoading, setFieldsLoading] = useState(false)

  // Error states
  const [workspacesError, setWorkspacesError] = useState<string | null>(null)
  const [seasonsError, setSeasonsError] = useState<string | null>(null)
  const [farmsError, setFarmsError] = useState<string | null>(null)
  const [fieldsError, setFieldsError] = useState<string | null>(null)

  // Local state for selection
  const [workspace, setWorkspace] = useState<string>("")
  const [campaign, setCampaign] = useState<string>("")
  const [establishment, setEstablishment] = useState<string>("")
  const [forceUpdate, setForceUpdate] = useState(0) // Para forzar actualizaciones de la UI
  
  // Usar campos temporales si están disponibles, sino usar los del formulario
  // En modo edición, tempFields solo se usa cuando hay cambios temporales
  const selectedLots = useMemo(() => {
    return isEditMode ? tempFields : (form.getValues("fields") || [])
  }, [isEditMode, tempFields, form.watch("fields")])

  // Usar el ID de 360 (fieldId) para la comparación, no el ID interno de AgTasks
  const allLotIds = useMemo(() => lots.map(field => field.id.toString()), [lots]) // Este es el ID de 360 desde la API
  const selectedLotIds = useMemo(() => selectedLots.map((lot: any) => lot.fieldId), [selectedLots])
  const allSelected = useMemo(() => allLotIds.length > 0 && allLotIds.every(id => selectedLotIds.includes(id)), [allLotIds, selectedLotIds])
  const someSelected = useMemo(() => allLotIds.some(id => selectedLotIds.includes(id)) && !allSelected, [allLotIds, selectedLotIds, allSelected])

  const selectAllRef = useRef<HTMLInputElement>(null)

  // Debug: monitorear cambios en selectedLots
  useEffect(() => {
    // Removed debug logs
  }, [tempFields, forceUpdate]) // Removido selectedLots de las dependencias

  // Forzar actualización del estado del botón cuando cambien los lotes seleccionados
  useEffect(() => {
    // Solo ejecutar cuando estemos en el step 2
    if (currentStep === 2) {
      // No necesitamos hacer form.trigger aquí, solo forzar re-render
      setForceUpdate(prev => prev + 1)
    }
  }, [currentStep]) // Removido selectedLots de las dependencias

  // Sincronizar tempFields con los campos del formulario en modo edición
  useEffect(() => {
    if (isEditMode) {
      const formFields = form.getValues("fields") || []
      if (formFields.length > 0 && tempFields.length === 0) {
        setTempFields(formFields)
      }
    }
  }, [isEditMode, form.watch("fields")]) // Usar form.watch en lugar de form para evitar renderizado infinito

  // Inicializar tempFields cuando se cargan los datos del formulario
  useEffect(() => {
    if (isEditMode) {
      const formValues = form.getValues()
      if (formValues.fields && formValues.fields.length > 0 && tempFields.length === 0) {
        setTempFields(formValues.fields)
      }
    }
  }, [isEditMode, form.watch("fields")]) // Usar form.watch para detectar cambios en fields

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected
    }
  }, [someSelected])

  // Restaurar valores del contexto cuando el componente se monta
  useEffect(() => {
    const formValues = form.getValues()
    
    if (formValues.fields && formValues.fields.length > 0) {
      const firstField = formValues.fields[0]
      setWorkspace(firstField.workspaceId || "")
      setCampaign(firstField.campaignId || "")
      setEstablishment(firstField.farmId || "")
    }
  }, [form.watch("fields")]) // Usar form.watch para detectar cambios en fields

  useEffect(() => {
    const fetchProject = async (project: string) => {
      const projectData = await apiClient.getProject(project);
      if (projectData && projectData.areaId !== undefined && projectData.areaId !== null) {
        setAreaId(Number(projectData.areaId));
      }
    }
    fetchProject(project)
  }, [project])

  // Fetch workspaces from 360 API
  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (hasLoadedWorkspaces) {
        setWorkspacesLoading(false)
        return
      }
      
      try {
        setWorkspacesLoading(true)
        const workspacesData = await listWorkspaces(thisUserEmail, domainId, areaId)
        const filteredAndSorted = workspacesData
          .filter((workspace) => workspace.deleted === false)
          .sort((a, b) => a.name.localeCompare(b.name))
        setWorkspaces(filteredAndSorted)
        setWorkspacesError(null)
        setHasLoadedWorkspaces(true)
      } catch (error) {
        console.error("Error fetching workspaces:", error)
        setWorkspacesError("Failed to load workspaces. Please try again later.")
        setWorkspaces([])
      } finally {
        setWorkspacesLoading(false)
      }
    }
    
    if (thisUserEmail && domainId != 0 && areaId != 0) {
      fetchWorkspaces()
    }
  }, [thisUserEmail, domainId, areaId, hasLoadedWorkspaces]) // Removidos setters del contexto

  useEffect(() => {
    const fetchSeasons = async () => {
      if (!workspace) {
        setCampaigns([])
        return
      }

      try {
        setSeasonsLoading(true)
        const seasonsData = await listSeasons(workspace)
        const filteredAndSorted = seasonsData.filter((season) => season.deleted === false).sort((a, b) => a.name.localeCompare(b.name))
        setCampaigns(filteredAndSorted)
        setSeasonsError(null)
        setHasLoadedSeasons(true)
      } catch (error) {
        setSeasonsError("Failed to load seasons. Please try again later.")
        setCampaigns([])
      } finally {
        setSeasonsLoading(false)
      }
    }

    if (workspace && !hasLoadedSeasons) {
      fetchSeasons()
    } else if (hasLoadedSeasons) {
      setSeasonsLoading(false)
    }
  }, [workspace, hasLoadedSeasons]) // Removidos setters del contexto

  useEffect(() => {
    const fetchFarms = async () => {
      if (!workspace || !campaign) {
        setEstablishments([])
        return
      }

      try {
        setFarmsLoading(true)
        const farmsData = await listFarms(workspace, campaign)
        const filteredAndSorted = farmsData.filter((farm) => farm.deleted === false).sort((a, b) => a.name.localeCompare(b.name))
        setEstablishments(filteredAndSorted)
        setFarmsError(null)
        setHasLoadedFarms(true)
      } catch (error) {
        setFarmsError("Failed to load farms. Please try again later.")
        setEstablishments([])
      } finally {
        setFarmsLoading(false)
      }
    }

    if (workspace && campaign && !hasLoadedFarms) {
      fetchFarms()
    } else if (hasLoadedFarms) {
      setFarmsLoading(false)
    }
  }, [workspace, campaign, hasLoadedFarms]) // Removidos setters del contexto

  useEffect(() => {
    const fetchFields = async () => {
      if (!workspace || !campaign || !establishment) {
        setLots([])
        return
      }

      try {
        setFieldsLoading(true)
        const fieldsData = await listFields(workspace, campaign, establishment)
        setLots(fieldsData)
        setFieldsError(null)
        setHasLoadedFields(true)
      } catch (error) {
        setFieldsError("Failed to load fields. Please try again later.")
        setLots([])
      } finally {
        setFieldsLoading(false)
      }
    }

    if (workspace && campaign && establishment && !hasLoadedFields) {
      fetchFields()
    } else if (hasLoadedFields) {
      setFieldsLoading(false)
    }
  }, [workspace, campaign, establishment, hasLoadedFields]) // Removidos setters del contexto

  const handleWorkspaceChange = (value: string) => {
    const previousWorkspace = workspace
    setWorkspace(value)
    
    // Solo limpiar lotes si se cambia a un workspace completamente diferente
    if (previousWorkspace !== value) {
      setCampaign("")
      setEstablishment("")
      
      // Limpiar lotes seleccionados usando estados temporales
      if (isEditMode) {
        setTempFields([])
      } else {
        form.setValue("fields", [], { shouldValidate: true })
      }
      
      // Reset loading states for dependent data
      setHasLoadedSeasons(false)
      setHasLoadedFarms(false)
      setHasLoadedFields(false)
      
      // Limpiar datos dependientes
      setCampaigns([])
      setEstablishments([])
      setLots([])
    }
  }

  const handleCampaignChange = (value: string) => {
    const previousCampaign = campaign
    setCampaign(value)
    
    // Solo limpiar lotes si se cambia a una campaña completamente diferente
    if (previousCampaign !== value) {
      setEstablishment("")
      
      // Limpiar lotes seleccionados usando estados temporales
      if (isEditMode) {
        setTempFields([])
      } else {
        form.setValue("fields", [], { shouldValidate: true })
      }
      
      // Reset loading states for dependent data
      setHasLoadedFarms(false)
      setHasLoadedFields(false)
      
      // Limpiar datos dependientes
      setEstablishments([])
      setLots([])
    }
  }

  const handleEstablishmentChange = (value: string) => {
    const previousEstablishment = establishment
    setEstablishment(value)
    
    // Solo limpiar lotes si se cambia a un establecimiento completamente diferente
    if (previousEstablishment !== value) {
      // Limpiar lotes seleccionados usando estados temporales
      if (isEditMode) {
        setTempFields([])
      } else {
        form.setValue("fields", [], { shouldValidate: true })
      }
      
      // Reset loading states for dependent data
      setHasLoadedFields(false)
      
      // Limpiar datos dependientes
      setLots([])
    }
  }

  const handleLotSelection = (lotId: string) => {
    // Usar la misma lógica que se usa para determinar selectedLots
    const currentLots = isEditMode ? tempFields : (form.getValues("fields") || [])
    const selectedField = lots.find((field) => field.id.toString() === lotId)
    if (!selectedField) return
    
    const lotDetail = {
      fieldId: selectedField.id.toString(), // Este es el ID de 360 desde la API
      fieldName: selectedField.name || "",
      hectares: selectedField.hectares || 0,
      crop: selectedField.cropName || "",
      hybrid: selectedField.hybridName || "",
      workspaceId: workspace || "",
      workspaceName: workspaces.find(w => w.id.toString() === workspace)?.name || "",
      campaignId: campaign || "",
      campaignName: campaigns.find(s => s.id.toString() === campaign)?.name || "",
      farmId: establishment || "",
      farmName: establishments.find(f => f.id.toString() === establishment)?.name || "",
    }
    
    let newLots: any[]
    if (currentLots.some((lot: any) => lot.fieldId === lotId)) {
      newLots = currentLots.filter((lot: any) => lot.fieldId !== lotId)
    } else {
      newLots = [...currentLots, lotDetail]
    }
    
    if (isEditMode) {
      setTempFields(newLots)
      setForceUpdate(prev => prev + 1) // Forzar actualización de la UI
    } else {
      form.setValue("fields", newLots, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
      setForceUpdate(prev => prev + 1) // Forzar actualización de la UI
    }
  }

  const handleToggleAllLots = () => {
    
    if (allSelected) {
      // Deseleccionar todos los lotes
      if (isEditMode) {
        setTempFields([])
        setForceUpdate(prev => prev + 1) // Forzar actualización de la UI
      } else {
        form.setValue("fields", [], { shouldValidate: true, shouldDirty: true, shouldTouch: true })
        setForceUpdate(prev => prev + 1) // Forzar actualización de la UI
      }
    } else {
      // Seleccionar todos los lotes
      const newLots = lots.map(selectedField => ({
        fieldId: selectedField.id.toString(), // Este es el ID de 360 desde la API
        fieldName: selectedField.name,
        hectares: selectedField.hectares,
        crop: selectedField.cropName,
        hybrid: selectedField.hybridName || "",
        workspaceId: workspace || "",
        workspaceName: workspaces.find(w => w.id.toString() === workspace)?.name || "",
        campaignId: campaign || "",
        campaignName: campaigns.find(s => s.id.toString() === campaign)?.name || "",
        farmId: establishment || "",
        farmName: establishments.find(f => f.id.toString() === establishment)?.name || "",
      }))
      
      if (isEditMode) {
        setTempFields(newLots)
        setForceUpdate(prev => prev + 1) // Forzar actualización de la UI
      } else {
        form.setValue("fields", newLots, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
        setForceUpdate(prev => prev + 1) // Forzar actualización de la UI
      }
    }
  }



  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Workspace Selector */}
        <div>
          <FormLabel>Espacio de trabajo</FormLabel>
          <Select value={workspace} onValueChange={handleWorkspaceChange} disabled={workspacesLoading}>
            <SelectTrigger>
              <SelectValue placeholder={workspacesLoading ? "Cargando..." : "Seleccionar espacio de trabajo"} />
            </SelectTrigger>
            <SelectContent>
              {workspacesError ? (
                <div className="p-2 text-red-500 text-sm">{workspacesError}</div>
              ) : workspaces.length === 0 ? (
                <div className="p-2 text-muted-foreground text-sm">No hay espacios disponibles</div>
              ) : (
                workspaces.map((workspaceItem) => (
                  <SelectItem key={workspaceItem.id} value={workspaceItem.id.toString()}>
                    {workspaceItem.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Season (Campaign) Selector */}
        <div>
          <FormLabel>Campaña</FormLabel>
          <Select
            value={campaign}
            onValueChange={handleCampaignChange}
            disabled={!workspace || seasonsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={seasonsLoading ? "Cargando..." : "Seleccionar campaña"} />
            </SelectTrigger>
            <SelectContent>
              {seasonsError ? (
                <div className="p-2 text-red-500 text-sm">{seasonsError}</div>
              ) : campaigns.length === 0 ? (
                <div className="p-2 text-muted-foreground text-sm">No hay campañas disponibles</div>
              ) : (
                campaigns.map((season) => (
                  <SelectItem key={season.id} value={season.id.toString()}>
                    {season.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Farm (Establishment) Selector */}
        <div>
          <FormLabel>Establecimiento</FormLabel>
          <Select
            value={establishment}
            onValueChange={handleEstablishmentChange}
            disabled={!campaign || farmsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={farmsLoading ? "Cargando..." : "Seleccionar establecimiento"} />
            </SelectTrigger>
            <SelectContent>
              {farmsError ? (
                <div className="p-2 text-red-500 text-sm">{farmsError}</div>
              ) : establishments.length === 0 ? (
                <div className="p-2 text-muted-foreground text-sm">No hay establecimientos disponibles</div>
              ) : (
                establishments.map((farm) => (
                  <SelectItem key={farm.id} value={farm.id.toString()}>
                    {farm.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Fields (Lots) Table */}
      {establishment && (
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
                  {lots.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No hay lotes disponibles para este establecimiento
                      </td>
                    </tr>
                  ) : (
                    lots.map((field) => (
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
      )}
    </div>
  )
} 