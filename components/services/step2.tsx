"use client"

import { 
  useState, 
  useEffect 
} from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { useServiceForm } from "@/lib/contexts/services-context"
import { type ServiceFormValues } from "@/lib/schemas"
import { 
  listWorkspaces, 
  listSeasons, 
  listFarms, 
  listFields 
} from "@/lib/integrations/360"
import { apiClient } from "@/lib/integrations/amplify"

interface Props {
  userEmail: string
}

export default function Step2({ userEmail }: Props) {
  const { 
    setValue, 
    watch,
    formState: { errors }
  } = useFormContext<ServiceFormValues>()
  
  const { 
    hasLoadedWorkspaces,
    setHasLoadedWorkspaces,
    hasLoadedSeasons,
    setHasLoadedSeasons,
    hasLoadedFarms,
    setHasLoadedFarms,
    hasLoadedFields,
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
  
  const params = useParams()
  const domainId = Number(params.domain)
  const projectId = params.project as string
  const [areaId, setAreaId] = useState<number>(0)
  
  // Watch form values
  const fields = watch("fields")
  
  // State for selections
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("")
  const [selectedCampaign, setSelectedCampaign] = useState<string>("")
  const [selectedEstablishment, setSelectedEstablishment] = useState<string>("")

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

  const allLotIds = lots.map(lot => lot.id.toString())
  const selectedLotIds = fields?.map((lot) => lot.fieldId) || []
  const allSelected = allLotIds.length > 0 && allLotIds.every(id => selectedLotIds.includes(id))
  const someSelected = allLotIds.some(id => selectedLotIds.includes(id)) && !allSelected

  // Fetch project to get areaId
  useEffect(() => {
    const fetchProject = async (project: string) => {
      const projectData = await apiClient.getProject(project);
      if (projectData && projectData.areaId !== undefined && projectData.areaId !== null) {
        setAreaId(Number(projectData.areaId));
      }
    }
    fetchProject(projectId)
  }, [projectId])

  // Restaurar valores del contexto cuando el componente se monta
  useEffect(() => {
    const formValues = watch()
    // console.log("Restaurando valores del contexto:", {
    //   fieldsCount: formValues.fields?.length || 0
    // })
    
    if (formValues.fields && formValues.fields.length > 0) {
      const firstField = formValues.fields[0]
      setSelectedWorkspace(firstField.workspaceId)
      setSelectedCampaign(firstField.campaignId)
      setSelectedEstablishment(firstField.farmId)
    }
  }, [watch])

  // Fetch workspaces
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
        // console.log("Workspaces cargados:", filteredAndSorted.length)
      } catch (error) {
        console.error("Error fetching workspaces:", error)
        setWorkspacesError("Failed to load workspaces. Please try again later.")
        setWorkspaces([])
      } finally {
        setWorkspacesLoading(false)
      }
    }

    if (userEmail && domainId != 0 && areaId != 0 && !hasLoadedWorkspaces) {
      //console.log("Cargando workspaces...")
      fetchWorkspaces()
    } else if (hasLoadedWorkspaces) {
      // console.log("Workspaces ya cargados, saltando carga")
      setWorkspacesLoading(false)
    }
  }, [userEmail, domainId, areaId, hasLoadedWorkspaces, setHasLoadedWorkspaces, setWorkspaces])

  // Fetch campaigns when workspace changes
  useEffect(() => {
    const fetchSeasons = async () => {
      if (!selectedWorkspace) {
        setCampaigns([])
        return
      }

      try {
        setSeasonsLoading(true)
        const seasonsData = await listSeasons(selectedWorkspace)
        // Filtrar seasons no eliminadas y ordenar alfabéticamente
        const filteredAndSorted = seasonsData
          .filter((season) => season.deleted === false)
          .sort((a, b) => a.name.localeCompare(b.name))
        setCampaigns(filteredAndSorted)
        setSeasonsError(null)
        setHasLoadedSeasons(true)
        // console.log("Seasons cargadas:", filteredAndSorted.length)
      } catch (error) {
        console.error("Error fetching seasons:", error)
        setSeasonsError("Failed to load seasons. Please try again later.")
        setCampaigns([])
      } finally {
        setSeasonsLoading(false)
      }
    }

    if (selectedWorkspace && !hasLoadedSeasons) {
      // console.log("Cargando seasons...")
      fetchSeasons()
    } else if (hasLoadedSeasons) {
      // console.log("Seasons ya cargadas, saltando carga")
      setSeasonsLoading(false)
    }
  }, [selectedWorkspace, hasLoadedSeasons, setHasLoadedSeasons, setCampaigns])

  // Fetch establishments when workspace and campaign change
  useEffect(() => {
    const fetchFarms = async () => {
      if (!selectedWorkspace || !selectedCampaign) {
        setEstablishments([])
        return
      }

      try {
        setFarmsLoading(true)
        const farmsData = await listFarms(selectedWorkspace, selectedCampaign)
        // Filtrar farms no eliminadas y ordenar alfabéticamente
        const filteredAndSorted = farmsData
          .filter((farm) => farm.deleted === false)
          .sort((a, b) => a.name.localeCompare(b.name))
        setEstablishments(filteredAndSorted)
        setFarmsError(null)
        setHasLoadedFarms(true)
        // console.log("Farms cargadas:", filteredAndSorted.length)
      } catch (error) {
        console.error("Error fetching farms:", error)
        setFarmsError("Failed to load farms. Please try again later.")
        setEstablishments([])
      } finally {
        setFarmsLoading(false)
      }
    }

    if (selectedWorkspace && selectedCampaign && !hasLoadedFarms) {
      // console.log("Cargando farms...")
      fetchFarms()
    } else if (hasLoadedFarms) {
      // console.log("Farms ya cargadas, saltando carga")
      setFarmsLoading(false)
    }
  }, [selectedWorkspace, selectedCampaign, hasLoadedFarms, setHasLoadedFarms, setEstablishments])

  // Fetch lots when workspace, campaign and establishment change
  useEffect(() => {
    const fetchFields = async () => {
      if (!selectedWorkspace || !selectedCampaign || !selectedEstablishment) {
        setLots([])
        return
      }

      try {
        setFieldsLoading(true)
        const fieldsData = await listFields(selectedWorkspace, selectedCampaign, selectedEstablishment)
        // Ordenar fields alfabéticamente
        const sorted = fieldsData.sort((a, b) => a.name.localeCompare(b.name))
        setLots(sorted)
        setFieldsError(null)
        setHasLoadedFields(true)
        // console.log("Fields cargados:", sorted.length)
      } catch (error) {
        console.error("Error fetching fields:", error)
        setFieldsError("Failed to load fields. Please try again later.")
        setLots([])
      } finally {
        setFieldsLoading(false)
      }
    }

    if (selectedWorkspace && selectedCampaign && selectedEstablishment && !hasLoadedFields) {
      // console.log("Cargando fields...")
      fetchFields()
    } else if (hasLoadedFields) {
      // console.log("Fields ya cargados, saltando carga")
      setFieldsLoading(false)
    }
  }, [selectedWorkspace, selectedCampaign, selectedEstablishment, hasLoadedFields, setHasLoadedFields, setLots])

  const handleWorkspaceChange = (value: string) => {
    // Encontrar el workspace seleccionado para obtener su nombre
    const selectedWorkspaceObj = workspaces.find((workspace) => workspace.id.toString() === value)
    const workspaceName = selectedWorkspaceObj ? selectedWorkspaceObj.name : ""

    setSelectedWorkspace(value)
    setSelectedCampaign("")
    setSelectedEstablishment("")
    setValue("fields", [])
    
    // Reset loading states for dependent data
    setHasLoadedSeasons(false)
    setHasLoadedFarms(false)
    setHasLoadedFields(false)
  }

  const handleCampaignChange = (value: string) => {
    // Encontrar la campaña seleccionada para obtener su nombre
    const selectedCampaignObj = campaigns.find((season) => season.id.toString() === value)
    const campaignName = selectedCampaignObj ? selectedCampaignObj.name : ""

    setSelectedCampaign(value)
    setSelectedEstablishment("")
    setValue("fields", [])
    
    // Reset loading states for dependent data
    setHasLoadedFarms(false)
    setHasLoadedFields(false)
  }

  const handleEstablishmentChange = (value: string) => {
    // Encontrar el establecimiento seleccionado para obtener su nombre
    const selectedFarm = establishments.find((farm) => farm.id.toString() === value)
    const establishmentName = selectedFarm ? selectedFarm.name : ""

    setSelectedEstablishment(value)
    setValue("fields", [])
    
    // Reset loading states for dependent data
    setHasLoadedFields(false)
  }

  const handleLotSelection = (lotId: string) => {
    const currentLots = fields || []
    const selectedField = lots.find((field) => field.id.toString() === lotId)

    if (!selectedField) return // No hacer nada si el campo no se encuentra

    // Obtener los valores seleccionados actualmente
    const workspaceId = selectedWorkspace
    const campaignId = selectedCampaign
    const farmId = selectedEstablishment

    // Obtener nombres de los selects o del estado
    const workspaceName = workspaces.find(w => w.id?.toString() === String(workspaceId))?.name || ""
    const campaignName = campaigns.find(s => s.id?.toString() === String(campaignId))?.name || ""
    const farmName = establishments.find(f => f.id?.toString() === String(farmId))?.name || ""

    const lotDetail = {
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

    let newLots
    if (currentLots.some((lot) => lot.fieldId === lotId)) {
      newLots = currentLots.filter((lot) => lot.fieldId !== lotId)
    } else {
      newLots = [...currentLots, lotDetail]
    }

    setValue("fields", newLots)
  }

  // Nueva función para seleccionar/deseleccionar todos los lotes
  const handleToggleAllLots = () => {
    if (allSelected) {
      // Deseleccionar todos
      setValue("fields", [])
    } else {
      // Seleccionar todos
      const workspaceId = selectedWorkspace
      const campaignId = selectedCampaign
      const farmId = selectedEstablishment
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
      setValue("fields", newLots)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Workspace Selector */}
        <div>
          <label className="text-sm font-medium">Espacio de trabajo</label>
          <Select value={selectedWorkspace} onValueChange={handleWorkspaceChange} disabled={workspacesLoading}>
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
        </div>

        {/* Season (Campaign) Selector */}
        <div>
          <label className="text-sm font-medium">Campaña</label>
          <Select
            value={selectedCampaign}
            onValueChange={handleCampaignChange}
            disabled={!selectedWorkspace || seasonsLoading}
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
          <label className="text-sm font-medium">Establecimiento</label>
          <Select
            value={selectedEstablishment}
            onValueChange={handleEstablishmentChange}
            disabled={!selectedCampaign || farmsLoading}
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
      {selectedEstablishment && (
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
                            checked={fields?.some((lot) => lot.fieldId === field.id.toString())}
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
      {errors.fields && (
        <p className="text-red-500 text-sm">{errors.fields.message}</p>
      )}
    </div>
  )
}
