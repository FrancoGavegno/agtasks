"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
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
import type { FieldFormValues } from "@/lib/schemas"
import { useServiceForm } from "@/lib/contexts/service-form-context"
import { 
  listWorkspaces, 
  listSeasons, 
  listFarms, 
  listFields 
} from "@/lib/integrations/360"
import type { 
  Workspace, 
  Season, 
  Farm, 
  LotField
} from "@/lib/interfaces/360"
import { getProject } from "@/lib/services/agtasks"

interface Props {
  userEmail: string
}

export default function Step2Lots({ userEmail }: Props) {
  const { domain, project } = useParams<{ domain: string, project: string }>()
  const domainId = Number(domain)

  const form = useFormContext<any>()
  const { 
    updateFormValues, 
    formValues,
    hasLoadedWorkspaces,
    hasLoadedSeasons,
    hasLoadedFarms,
    hasLoadedFields,
    setHasLoadedWorkspaces,
    setHasLoadedSeasons,
    setHasLoadedFarms,
    setHasLoadedFields,
    workspaces,
    setWorkspaces,
    campaigns,
    setCampaigns,
    establishments,
    setEstablishments,
    lots,
    setLots
  } = useServiceForm()

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

  // Form values
  const workspace = form.watch ? form.watch("workspace") : ""
  const campaign = form.watch ? form.watch("campaign") : ""
  const establishment = form.watch ? form.watch("establishment") : ""
  const fieldsSelected: FieldFormValues[] = form.watch ? form.watch("fields") : []

  const allLotIds = lots.map(lot => lot.id.toString())
  const selectedLotIds = fieldsSelected.map((lot) => lot.fieldId)
  const allSelected = allLotIds.length > 0 && allLotIds.every(id => selectedLotIds.includes(id))
  const someSelected = allLotIds.some(id => selectedLotIds.includes(id)) && !allSelected

  const selectAllRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected
    }
  }, [someSelected])

  useEffect(() => {
    const fetchProject = async (project: string) => {
      const projectData = await getProject(project);
      if (projectData && projectData.areaId !== undefined && projectData.areaId !== null) {
        setAreaId(Number(projectData.areaId));
      }
    }
    fetchProject(project)
  }, [project])

  // Restaurar valores del contexto cuando el componente se monta
  useEffect(() => {
    console.log("Restaurando valores del contexto:", {
      workspace: formValues.workspace,
      campaign: formValues.campaign,
      establishment: formValues.establishment,
      fieldsCount: formValues.fields?.length || 0
    })
    
    if (formValues.workspace) {
      form.setValue("workspace", formValues.workspace, { shouldValidate: true })
    }
    if (formValues.campaign) {
      form.setValue("campaign", formValues.campaign, { shouldValidate: true })
    }
    if (formValues.establishment) {
      form.setValue("establishment", formValues.establishment, { shouldValidate: true })
    }
    if (formValues.fields && formValues.fields.length > 0) {
      form.setValue("fields", formValues.fields, { shouldValidate: true })
    }
  }, [formValues.workspace, formValues.campaign, formValues.establishment, formValues.fields])

  // Cargar datos dependientes cuando se restauran los valores del contexto
  useEffect(() => {
    if (formValues.workspace && !hasLoadedSeasons) {
      // Forzar la carga de seasons si tenemos workspace pero no se han cargado
      setHasLoadedSeasons(false)
    }
  }, [formValues.workspace, hasLoadedSeasons, setHasLoadedSeasons])

  useEffect(() => {
    if (formValues.campaign && !hasLoadedFarms) {
      // Forzar la carga de farms si tenemos campaign pero no se han cargado
      setHasLoadedFarms(false)
    }
  }, [formValues.campaign, hasLoadedFarms, setHasLoadedFarms])

  useEffect(() => {
    if (formValues.establishment && !hasLoadedFields) {
      // Forzar la carga de fields si tenemos establishment pero no se han cargado
      setHasLoadedFields(false)
    }
  }, [formValues.establishment, hasLoadedFields, setHasLoadedFields])

  // Fetch workspaces from 360 API solo si no se han cargado antes
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setWorkspacesLoading(true)
        const workspacesData = await listWorkspaces(userEmail, domainId, areaId)
        // Filtrar workspaces no eliminados y ordenar alfabéticamente
        const filteredAndSorted = workspacesData
          .filter((workspace) => workspace.deleted === false)
          .sort((a, b) => a.name.localeCompare(b.name))
        setWorkspaces(filteredAndSorted)
        setWorkspacesError(null)
        setHasLoadedWorkspaces(true)
        console.log("Workspaces cargados:", filteredAndSorted.length)
      } catch (error) {
        console.error("Error fetching workspaces:", error)
        setWorkspacesError("Failed to load workspaces. Please try again later.")
        setWorkspaces([])
      } finally {
        setWorkspacesLoading(false)
      }
    }

    if (userEmail && domainId != 0 && areaId != 0 && !hasLoadedWorkspaces) {
      console.log("Cargando workspaces...")
      fetchWorkspaces()
    } else if (hasLoadedWorkspaces) {
      console.log("Workspaces ya cargados, saltando carga")
      setWorkspacesLoading(false)
    }
  }, [userEmail, domainId, areaId, hasLoadedWorkspaces, setHasLoadedWorkspaces, setWorkspaces])

  // Fetch seasons when workspace changes
  useEffect(() => {
    const fetchSeasons = async () => {
      if (!workspace) {
        setCampaigns([])
        return
      }

      try {
        setSeasonsLoading(true)
        const seasonsData = await listSeasons(workspace)
        // Filtrar seasons no eliminadas y ordenar alfabéticamente
        const filteredAndSorted = seasonsData
          .filter((season) => season.deleted === false)
          .sort((a, b) => a.name.localeCompare(b.name))
        setCampaigns(filteredAndSorted)
        setSeasonsError(null)
        setHasLoadedSeasons(true)
        console.log("Seasons cargadas:", filteredAndSorted.length)
      } catch (error) {
        console.error("Error fetching seasons:", error)
        setSeasonsError("Failed to load seasons. Please try again later.")
        setCampaigns([])
      } finally {
        setSeasonsLoading(false)
      }
    }

    if (workspace && !hasLoadedSeasons) {
      console.log("Cargando seasons...")
      fetchSeasons()
    } else if (hasLoadedSeasons) {
      console.log("Seasons ya cargadas, saltando carga")
      setSeasonsLoading(false)
    }
  }, [workspace, hasLoadedSeasons, setHasLoadedSeasons, setCampaigns])

  // Fetch farms when workspace and season change
  useEffect(() => {
    const fetchFarms = async () => {
      if (!workspace || !campaign) {
        setEstablishments([])
        return
      }

      try {
        setFarmsLoading(true)
        const farmsData = await listFarms(workspace, campaign)
        // Filtrar farms no eliminadas y ordenar alfabéticamente
        const filteredAndSorted = farmsData
          .filter((farm) => farm.deleted === false)
          .sort((a, b) => a.name.localeCompare(b.name))
        setEstablishments(filteredAndSorted)
        setFarmsError(null)
        setHasLoadedFarms(true)
        console.log("Farms cargadas:", filteredAndSorted.length)
      } catch (error) {
        console.error("Error fetching farms:", error)
        setFarmsError("Failed to load farms. Please try again later.")
        setEstablishments([])
      } finally {
        setFarmsLoading(false)
      }
    }

    if (workspace && campaign && !hasLoadedFarms) {
      console.log("Cargando farms...")
      fetchFarms()
    } else if (hasLoadedFarms) {
      console.log("Farms ya cargadas, saltando carga")
      setFarmsLoading(false)
    }
  }, [workspace, campaign, hasLoadedFarms, setHasLoadedFarms, setEstablishments])

  // Fetch fields when workspace, season, and farm change
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
        console.log("Fields cargados:", fieldsData.length)
      } catch (error) {
        console.error("Error fetching fields:", error)
        setFieldsError("Failed to load fields. Please try again later.")
        setLots([])
      } finally {
        setFieldsLoading(false)
      }
    }

    if (workspace && campaign && establishment && !hasLoadedFields) {
      console.log("Cargando fields...")
      fetchFields()
    } else if (hasLoadedFields) {
      console.log("Fields ya cargados, saltando carga")
      setFieldsLoading(false)
    }
  }, [workspace, campaign, establishment, hasLoadedFields, setHasLoadedFields, setLots])

  // Modificar handleWorkspaceChange para guardar el nombre del workspace
  const handleWorkspaceChange = (value: string) => {
    // Encontrar el workspace seleccionado para obtener su nombre
    const selectedWorkspace = workspaces.find((workspace) => workspace.id.toString() === value)
    const workspaceName = selectedWorkspace ? selectedWorkspace.name : ""

    form.setValue("workspace", value, { shouldValidate: true })
    form.setValue("workspaceName", workspaceName, { shouldValidate: true })
    form.setValue("campaign", "", { shouldValidate: true })
    form.setValue("campaignName", "", { shouldValidate: true })
    form.setValue("establishment", "", { shouldValidate: true })
    form.setValue("establishmentName", "", { shouldValidate: true })
    form.setValue("fields", [], { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    form.trigger("fields");
    
    updateFormValues({
      workspace: value,
      workspaceName,
      campaign: "",
      campaignName: "",
      establishment: "",
      establishmentName: "",
      fields: [],
    })

    // Reset loading flags for dependent data
    setHasLoadedSeasons(false)
    setHasLoadedFarms(false)
    setHasLoadedFields(false)
  }

  // Modificar handleCampaignChange para guardar el nombre de la campaña
  const handleCampaignChange = (value: string) => {
    // Encontrar la campaña seleccionada para obtener su nombre
    const selectedCampaign = campaigns.find((season) => season.id.toString() === value)
    const campaignName = selectedCampaign ? selectedCampaign.name : ""

    form.setValue("campaign", value, { shouldValidate: true })
    form.setValue("campaignName", campaignName, { shouldValidate: true })
    form.setValue("establishment", "", { shouldValidate: true })
    form.setValue("establishmentName", "", { shouldValidate: true })
    form.setValue("fields", [], { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    form.trigger("fields");
    
    updateFormValues({
      campaign: value,
      campaignName,
      establishment: "",
      establishmentName: "",
      fields: [],
    })

    // Reset loading flags for dependent data
    setHasLoadedFarms(false)
    setHasLoadedFields(false)
  }

  // Modificar handleEstablishmentChange para guardar el nombre del establecimiento
  const handleEstablishmentChange = (value: string) => {
    // Encontrar el establecimiento seleccionado para obtener su nombre
    const selectedFarm = establishments.find((farm) => farm.id.toString() === value)
    const establishmentName = selectedFarm ? selectedFarm.name : ""

    form.setValue("establishment", value, { shouldValidate: true })
    form.setValue("establishmentName", establishmentName, { shouldValidate: true })
    form.setValue("fields", [], { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    form.trigger("fields");
    updateFormValues({
      establishment: value,
      establishmentName,
      fields: [],
    })

    // Reset loading flags for dependent data
    setHasLoadedFields(false)
  }

  // Modificar handleLotSelection para guardar también los nombres de los lotes y todos los campos requeridos
  const handleLotSelection = (lotId: string) => {
    const currentLots: FieldFormValues[] = form.getValues("fields") || []
    const selectedField = lots.find((field) => field.id.toString() === lotId)

    if (!selectedField) return // No hacer nada si el campo no se encuentra

    // Obtener los valores seleccionados actualmente
    const workspaceId = form.getValues("workspace")
    const campaignId = form.getValues("campaign")
    const farmId = form.getValues("establishment")

    // Obtener nombres de los selects o del estado
    const workspaceName = workspaces.find(w => w.id?.toString() === String(workspaceId))?.name || ""
    const campaignName = campaigns.find(s => s.id?.toString() === String(campaignId))?.name || ""
    const farmName = establishments.find(f => f.id?.toString() === String(farmId))?.name || ""

    const lotDetail: FieldFormValues = {
      workspaceId: String(selectedField.workspaceId ?? ""),
      workspaceName,
      campaignId: String(selectedField.seasonId ?? ""),
      campaignName,
      farmId: String(selectedField.farmId ?? ""),
      farmName,
      fieldId: String(selectedField.id ?? ""),
      fieldName: selectedField.name || "",
      hectares: typeof selectedField.hectares === 'number' ? selectedField.hectares : 0,
      crop: selectedField.cropName || "",
      hybrid: selectedField.hybridName || "",
      deleted: false,
    }

    let newLots: FieldFormValues[]
    if (currentLots.some((lot) => lot.fieldId === lotId)) {
      newLots = currentLots.filter((lot) => lot.fieldId !== lotId)
    } else {
      newLots = [...currentLots, lotDetail]
    }

    form.setValue("fields", newLots, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    updateFormValues({ fields: newLots })
  }

  // Nueva función para seleccionar/deseleccionar todos los lotes
  const handleToggleAllLots = () => {
    if (allSelected) {
      // Deseleccionar todos
      form.setValue("fields", [], { shouldValidate: true, shouldDirty: true, shouldTouch: true })
      updateFormValues({ fields: [] })
    } else {
      // Seleccionar todos
      const workspaceId = form.getValues("workspace")
      const campaignId = form.getValues("campaign")
      const farmId = form.getValues("establishment")
      const workspaceName = workspaces.find(w => w.id?.toString() === String(workspaceId))?.name || ""
      const campaignName = campaigns.find(s => s.id?.toString() === String(campaignId))?.name || ""
      const farmName = establishments.find(f => f.id?.toString() === String(farmId))?.name || ""
      const newLots = lots.map(selectedField => ({
        workspaceId: String(selectedField.workspaceId ?? ""),
        workspaceName,
        campaignId: String(selectedField.seasonId ?? ""),
        campaignName,
        farmId: String(selectedField.farmId ?? ""),
        farmName,
        fieldId: String(selectedField.id ?? ""),
        fieldName: selectedField.name || "",
        hectares: typeof selectedField.hectares === 'number' ? selectedField.hectares : 0,
        crop: selectedField.cropName || "",
        hybrid: selectedField.hybridName || "",
        deleted: false,
      }))
      form.setValue("fields", newLots, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
      updateFormValues({ fields: newLots })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Workspace Selector */}
        <FormField
          control={form.control}
          name="workspace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Espacio de trabajo</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={handleWorkspaceChange} disabled={workspacesLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder={workspacesLoading ? "Cargando..." : "Seleccionar espacio"} />
                  </SelectTrigger>
                  <SelectContent>
                    {workspacesError ? (
                      <div className="p-2 text-red-500 text-sm">{workspacesError}</div>
                    ) : workspaces.length === 0 ? (
                      <div className="p-2 text-muted-foreground text-sm">No hay espacios disponibles</div>
                    ) : (
                      workspaces.map((workspace) => (
                        <SelectItem key={workspace.id} value={workspace.id.toString()}>
                          {workspace.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Season (Campaign) Selector */}
        <FormField
          control={form.control}
          name="campaign"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaña</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
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
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Farm (Establishment) Selector */}
        <FormField
          control={form.control}
          name="establishment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Establecimiento</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
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
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
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
                        <td className="px-6 whitespace-nowrap">
                          <Checkbox
                            id={`lot-${field.id}`}
                            checked={fieldsSelected?.some((lot) => lot.fieldId === field.id.toString())}
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
        </div>
      )}
      <FormField
        control={form.control}
        name="fields"
        render={({ field, fieldState }) => (
          <FormItem>
            {typeof fieldState.error?.message === "string" && (
              <FormMessage className="text-red-500 mb-2" />
            )}
          </FormItem>
        )}
      />
    </div>
  )
}
