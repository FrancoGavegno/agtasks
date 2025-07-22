"use client"

import { useState, useEffect, useRef } from "react"
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
  const workspace = form.watch("workspace")
  const campaign = form.watch("campaign")
  const establishment = form.watch("establishment")
  const selectedLots = form.watch("selectedLots") || []

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

  useEffect(() => {
    const fetchProject = async (project: string) => {
      const projectData = await getProject(project);
      if (projectData && projectData.areaId !== undefined && projectData.areaId !== null) {
        setAreaId(Number(projectData.areaId));
      }
    }
    fetchProject(project)
  }, [project])

  // Fetch workspaces from 360 API
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setWorkspacesLoading(true)
        // console.log(userEmail, domainId, areaId)
        const workspacesData = await listWorkspaces(userEmail, domainId, areaId)
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
    if (userEmail && domainId != 0 && areaId != 0) {
      fetchWorkspaces()
    }
  }, [userEmail, domainId, areaId])

  useEffect(() => {
    const fetchSeasons = async () => {
      if (!workspace) { setSeasons([]); return }
      try {
        setSeasonsLoading(true)
        const seasonsData = await listSeasons(workspace)
        const filteredAndSorted = seasonsData.filter((season) => season.deleted === false).sort((a, b) => a.name.localeCompare(b.name))
        setSeasons(filteredAndSorted)
        setSeasonsError(null)
      } catch (error) {
        setSeasonsError("Failed to load seasons. Please try again later.")
        setSeasons([])
      } finally {
        setSeasonsLoading(false)
      }
    }
    fetchSeasons()
  }, [workspace])

  useEffect(() => {
    const fetchFarms = async () => {
      if (!workspace || !campaign) { setFarms([]); return }
      try {
        setFarmsLoading(true)
        const farmsData = await listFarms(workspace, campaign)
        const filteredAndSorted = farmsData.filter((farm) => farm.deleted === false).sort((a, b) => a.name.localeCompare(b.name))
        setFarms(filteredAndSorted)
        setFarmsError(null)
      } catch (error) {
        setFarmsError("Failed to load farms. Please try again later.")
        setFarms([])
      } finally {
        setFarmsLoading(false)
      }
    }
    fetchFarms()
  }, [workspace, campaign])

  useEffect(() => {
    const fetchFields = async () => {
      if (!workspace || !campaign || !establishment) { setFields([]); return }
      try {
        setFieldsLoading(true)
        const fieldsData = await listFields(workspace, campaign, establishment)
        setFields(fieldsData)
        setFieldsError(null)
      } catch (error) {
        setFieldsError("Failed to load fields. Please try again later.")
        setFields([])
      } finally {
        setFieldsLoading(false)
      }
    }
    fetchFields()
  }, [workspace, campaign, establishment])

  const handleWorkspaceChange = (value: string) => {
    const selectedWorkspace = workspaces.find((workspace) => workspace.id.toString() === value)
    const workspaceName = selectedWorkspace ? selectedWorkspace.name : ""
    form.setValue("workspace", value, { shouldValidate: true })
    form.setValue("workspaceName", workspaceName, { shouldValidate: true })
    form.setValue("campaign", "", { shouldValidate: true })
    form.setValue("campaignName", "", { shouldValidate: true })
    form.setValue("establishment", "", { shouldValidate: true })
    form.setValue("establishmentName", "", { shouldValidate: true })
    form.setValue("selectedLots", [], { shouldValidate: true })
  }

  const handleCampaignChange = (value: string) => {
    const selectedSeason = seasons.find((season) => season.id.toString() === value)
    const campaignName = selectedSeason ? selectedSeason.name : ""
    form.setValue("campaign", value, { shouldValidate: true })
    form.setValue("campaignName", campaignName, { shouldValidate: true })
    form.setValue("establishment", "", { shouldValidate: true })
    form.setValue("establishmentName", "", { shouldValidate: true })
    form.setValue("selectedLots", [], { shouldValidate: true })
  }

  const handleEstablishmentChange = (value: string) => {
    const selectedFarm = farms.find((farm) => farm.id.toString() === value)
    const establishmentName = selectedFarm ? selectedFarm.name : ""
    form.setValue("establishment", value, { shouldValidate: true })
    form.setValue("establishmentName", establishmentName, { shouldValidate: true })
    form.setValue("selectedLots", [], { shouldValidate: true })
  }

  const handleLotSelection = (lotId: string) => {
    const currentLots = form.getValues("selectedLots") || []
    const selectedField = fields.find((field) => field.id.toString() === lotId)
    if (!selectedField) return
    const lotDetail = {
      fieldId: selectedField.id.toString(),
      fieldName: selectedField.name || "",
      hectares: selectedField.hectares || 0,
      cropName: selectedField.cropName || "",
      hybridName: selectedField.hybridName || "",
      workspaceId: workspace || "",
      workspaceName: workspaces.find(w => w.id.toString() === workspace)?.name || "",
      campaignId: campaign || "",
      campaignName: seasons.find(s => s.id.toString() === campaign)?.name || "",
      farmId: establishment || "",
      farmName: farms.find(f => f.id.toString() === establishment)?.name || "",
    }
    let newLots: any[]
    if (currentLots.some((lot: any) => lot.fieldId === lotId)) {
      newLots = currentLots.filter((lot: any) => lot.fieldId !== lotId)
    } else {
      newLots = [...currentLots, lotDetail]
    }
    form.setValue("selectedLots", newLots, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
  }

  const handleToggleAllLots = () => {
    if (allSelected) {
      form.setValue("selectedLots", [], { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    } else {
      const newLots = fields.map(selectedField => ({
        fieldId: selectedField.id.toString(),
        fieldName: selectedField.name,
        hectares: selectedField.hectares,
        cropName: selectedField.cropName,
        hybridName: selectedField.hybridName || "",
        workspaceId: workspace || "",
        workspaceName: workspaces.find(w => w.id.toString() === workspace)?.name || "",
        campaignId: campaign || "",
        campaignName: seasons.find(s => s.id.toString() === campaign)?.name || "",
        farmId: establishment || "",
        farmName: farms.find(f => f.id.toString() === establishment)?.name || "",
      }))
      form.setValue("selectedLots", newLots, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
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
            name="selectedLots"
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