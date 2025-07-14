"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { FieldFormValues } from "./validation-schemas"
import { useServiceForm } from "@/lib/contexts/service-form-context"
import { listWorkspaces, listSeasons, listFarms, listFields } from "@/lib/integrations/360"
import type { Workspace, Season, Farm, LotField, Project } from "@/lib/interfaces"
import * as React from "react"
import { getProject } from "@/lib/services/agtasks"

interface Props {
  userEmail: string
}

export default function Step2Lots({ userEmail }: Props) {
  const { domain, project } = useParams<{ domain: string, project: string }>()
  const domainId = Number(domain)

  const form = useFormContext<any>()
  const { updateFormValues } = useServiceForm()

  // State for API data
  const [areaId, setAreaId] = useState<number>(0)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [farms, setFarms] = useState<Farm[]>([])
  const [fields, setFields] = useState<LotField[]>([])

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

  const allLotIds = fields.map(field => field.id.toString())
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
  }, [])

  // Fetch workspaces from 360 API
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
      } catch (error) {
        console.error("Error fetching workspaces:", error)
        setWorkspacesError("Failed to load workspaces. Please try again later.")
        setWorkspaces([])
      } finally {
        setWorkspacesLoading(false)
      }
    }

    fetchWorkspaces()
  }, [userEmail, domainId, areaId])

  // Fetch seasons when workspace changes
  useEffect(() => {
    const fetchSeasons = async () => {
      if (!workspace) {
        setSeasons([])
        return
      }

      try {
        setSeasonsLoading(true)
        const seasonsData = await listSeasons(workspace)
        // Filtrar seasons no eliminadas y ordenar alfabéticamente
        const filteredAndSorted = seasonsData
          .filter((season) => season.deleted === false)
          .sort((a, b) => a.name.localeCompare(b.name))
        setSeasons(filteredAndSorted)
        setSeasonsError(null)
      } catch (error) {
        console.error("Error fetching seasons:", error)
        setSeasonsError("Failed to load seasons. Please try again later.")
        setSeasons([])
      } finally {
        setSeasonsLoading(false)
      }
    }

    fetchSeasons()
  }, [workspace])

  // Fetch farms when workspace and season change
  useEffect(() => {
    const fetchFarms = async () => {
      if (!workspace || !campaign) {
        setFarms([])
        return
      }

      try {
        setFarmsLoading(true)
        const farmsData = await listFarms(workspace, campaign)
        // Filtrar farms no eliminadas y ordenar alfabéticamente
        const filteredAndSorted = farmsData
          .filter((farm) => farm.deleted === false)
          .sort((a, b) => a.name.localeCompare(b.name))
        setFarms(filteredAndSorted)
        setFarmsError(null)
      } catch (error) {
        console.error("Error fetching farms:", error)
        setFarmsError("Failed to load farms. Please try again later.")
        setFarms([])
      } finally {
        setFarmsLoading(false)
      }
    }

    fetchFarms()
  }, [workspace, campaign])

  // Fetch fields when workspace, season, and farm change
  useEffect(() => {
    const fetchFields = async () => {
      if (!workspace || !campaign || !establishment) {
        setFields([])
        return
      }

      try {
        setFieldsLoading(true)
        const fieldsData = await listFields(workspace, campaign, establishment)
        setFields(fieldsData)
        setFieldsError(null)
      } catch (error) {
        console.error("Error fetching fields:", error)
        setFieldsError("Failed to load fields. Please try again later.")
        setFields([])
      } finally {
        setFieldsLoading(false)
      }
    }

    fetchFields()
  }, [workspace, campaign, establishment])

  // Modificar los manejadores de eventos para guardar también los nombres

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
  }

  // Modificar handleCampaignChange para guardar el nombre de la campaña
  const handleCampaignChange = (value: string) => {
    // Encontrar la campaña seleccionada para obtener su nombre
    const selectedCampaign = seasons.find((season) => season.id.toString() === value)
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
  }

  // Modificar handleEstablishmentChange para guardar el nombre del establecimiento
  const handleEstablishmentChange = (value: string) => {
    // Encontrar el establecimiento seleccionado para obtener su nombre
    const selectedFarm = farms.find((farm) => farm.id.toString() === value)
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
  }

  // Modificar handleLotSelection para guardar también los nombres de los lotes y todos los campos requeridos
  const handleLotSelection = (lotId: string) => {
    const currentLots: FieldFormValues[] = form.getValues("fields") || []
    const selectedField = fields.find((field) => field.id.toString() === lotId)

    if (!selectedField) return // No hacer nada si el campo no se encuentra

    const lotDetail: FieldFormValues = {
      workspaceId: String(selectedField.workspaceId ?? ""),
      workspaceName: "",
      campaignId: String(selectedField.seasonId ?? ""),
      campaignName: "",
      farmId: String(selectedField.farmId ?? ""),
      farmName: "",
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
    // console.log("Lotes seleccionados actualizados:", newLots)
  }

  // Nueva función para seleccionar/deseleccionar todos los lotes
  const handleToggleAllLots = () => {
    if (allSelected) {
      // Deseleccionar todos
      form.setValue("fields", [], { shouldValidate: true, shouldDirty: true, shouldTouch: true })
      updateFormValues({ fields: [] })
    } else {
      // Seleccionar todos
      const newLots = fields.map(selectedField => ({
        workspaceId: String(selectedField.workspaceId ?? ""),
        workspaceName: "",
        campaignId: String(selectedField.seasonId ?? ""),
        campaignName: "",
        farmId: String(selectedField.farmId ?? ""),
        farmName: "",
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
                    ) : seasons.length === 0 ? (
                      <div className="p-2 text-muted-foreground text-sm">No hay campañas disponibles</div>
                    ) : (
                      seasons.map((season) => (
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
                    ) : farms.length === 0 ? (
                      <div className="p-2 text-muted-foreground text-sm">No hay establecimientos disponibles</div>
                    ) : (
                      farms.map((farm) => (
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
                    {/* <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th> */}
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
                            checked={fieldsSelected?.some((lot) => lot.fieldId === field.id.toString())}
                            onCheckedChange={() => handleLotSelection(field.id.toString())}
                          />
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{field.id}</td> */}
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
