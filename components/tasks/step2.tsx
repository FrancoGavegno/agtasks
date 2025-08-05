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
import { Switch } from "@/components/ui/switch"
import { useParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { useTaskForm } from "@/lib/contexts/tasks-context"
import { type TaskFormValues } from "@/lib/schemas"
import { 
  listWorkspaces, 
  listSeasons, 
  listFarms, 
  listFields 
} from "@/lib/integrations/360"
import { apiClient } from "@/lib/integrations/amplify"
import { useTranslations } from 'next-intl'
import { Label } from "@/components/ui/label"

interface Props {
  userEmail: string
}

export default function Step2({ userEmail }: Props) {
  const t = useTranslations("FormComponents")
  const t2 = useTranslations("CreateServiceSteps.step2")
  const { 
    setValue, 
    watch,
    formState: { errors }
  } = useFormContext<TaskFormValues>()
  
  const { 
    mode,
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
    setLots,
    updateTaskWith360Data,
    updateTaskWithFieldIds,
    showFieldsTable,
    setShowFieldsTable
  } = useTaskForm()
  
  const params = useParams()
  const domainId = Number(params.domain)
  const projectId = params.project as string
  const [areaId, setAreaId] = useState<number>(0)
  
  // Get current fieldIdsOnlyIncluded from form
  const currentFieldIdsOnlyIncluded = watch("fieldIdsOnlyIncluded") || []
  
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

  // Filtered lots based on fieldIdsOnlyIncluded (for edit mode)
  const [filteredLots, setFilteredLots] = useState<any[]>([])

  const allFieldIds = lots.map(lot => lot.id)
  const allSelected = allFieldIds.length > 0 && allFieldIds.every(id => currentFieldIdsOnlyIncluded.includes(id))
  const someSelected = allFieldIds.some(id => currentFieldIdsOnlyIncluded.includes(id)) && !allSelected

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
    
    // Restore 360 Farm main values from form
    if (formValues.workspaceId && formValues.workspaceId > 0) {
      setSelectedWorkspace(formValues.workspaceId.toString())
    }
    if (formValues.seasonId && formValues.seasonId > 0) {
      setSelectedCampaign(formValues.seasonId.toString())
    }
    if (formValues.farmId && formValues.farmId > 0) {
      setSelectedEstablishment(formValues.farmId.toString())
    }
    
    // Set showFieldsTable if fieldIdsOnlyIncluded has values
    if (formValues.fieldIdsOnlyIncluded && formValues.fieldIdsOnlyIncluded.length > 0) {
      setShowFieldsTable(true)
    }
  }, [watch, setShowFieldsTable])

  // Always show all lots available, regardless of fieldIdsOnlyIncluded
  useEffect(() => {
    setFilteredLots(lots)
  }, [lots])

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
      } catch (error) {
        console.error("Error fetching workspaces:", error)
        setWorkspacesError("Failed to load workspaces. Please try again later.")
        setWorkspaces([])
      } finally {
        setWorkspacesLoading(false)
      }
    }

    if (userEmail && domainId != 0 && areaId != 0 && !hasLoadedWorkspaces) {
      fetchWorkspaces()
    } else if (hasLoadedWorkspaces) {
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
      } catch (error) {
        console.error("Error fetching seasons:", error)
        setSeasonsError("Failed to load seasons. Please try again later.")
        setCampaigns([])
      } finally {
        setSeasonsLoading(false)
      }
    }

    if (selectedWorkspace && !hasLoadedSeasons) {
      fetchSeasons()
    } else if (hasLoadedSeasons) {
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
      } catch (error) {
        console.error("Error fetching farms:", error)
        setFarmsError("Failed to load farms. Please try again later.")
        setEstablishments([])
      } finally {
        setFarmsLoading(false)
      }
    }

    if (selectedWorkspace && selectedCampaign && !hasLoadedFarms) {
      fetchFarms()
    } else if (hasLoadedFarms) {
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
      } catch (error) {
        console.error("Error fetching fields:", error)
        setFieldsError("Failed to load fields. Please try again later.")
        setLots([])
      } finally {
        setFieldsLoading(false)
      }
    }

    if (selectedWorkspace && selectedCampaign && selectedEstablishment && !hasLoadedFields) {
      fetchFields()
    } else if (hasLoadedFields) {
      setFieldsLoading(false)
    }
  }, [selectedWorkspace, selectedCampaign, selectedEstablishment, hasLoadedFields, setHasLoadedFields, setLots])

  const handleWorkspaceChange = (value: string) => {
    setSelectedWorkspace(value)
    setSelectedCampaign("")
    setSelectedEstablishment("")
    updateTaskWithFieldIds([])
    setShowFieldsTable(false)
    
    // Reset loading states for dependent data
    setHasLoadedSeasons(false)
    setHasLoadedFarms(false)
    setHasLoadedFields(false)
  }

  const handleCampaignChange = (value: string) => {
    setSelectedCampaign(value)
    setSelectedEstablishment("")
    updateTaskWithFieldIds([])
    setShowFieldsTable(false)
    
    // Reset loading states for dependent data
    setHasLoadedFarms(false)
    setHasLoadedFields(false)
  }

  const handleEstablishmentChange = (value: string) => {
    setSelectedEstablishment(value)
    setShowFieldsTable(false)
    
    // Reset loading states for dependent data
    setHasLoadedFields(false)
    
    // Update task with workspace, season, and farm data when establishment is selected
    if (selectedWorkspace && selectedCampaign && value) {
      const workspace = workspaces.find(w => w.id.toString() === selectedWorkspace)
      const season = campaigns.find(s => s.id.toString() === selectedCampaign)
      const farm = establishments.find(f => f.id.toString() === value)

      if (workspace && season && farm) {
        updateTaskWith360Data(
          parseInt(selectedWorkspace),
          workspace.name,
          parseInt(selectedCampaign),
          season.name,
          parseInt(value),
          farm.name
        )
      }
    }
  }

  const handleFieldSelection = (fieldId: number) => {
    const currentFieldIds = currentFieldIdsOnlyIncluded
    let newFieldIds: number[]

    if (currentFieldIds.includes(fieldId)) {
      newFieldIds = currentFieldIds.filter((id: number) => id !== fieldId)
    } else {
      newFieldIds = [...currentFieldIds, fieldId]
    }
    
    // Update task with fieldIdsOnlyIncluded
    updateTaskWithFieldIds(newFieldIds)
  }

  // Nueva función para seleccionar/deseleccionar todos los lotes
  const handleToggleAllFields = () => {
    if (allSelected) {
      // Deseleccionar todos
      updateTaskWithFieldIds([])
    } else {
      // Seleccionar todos
      updateTaskWithFieldIds(allFieldIds)
    }
  }

  const handleToggleShowFields = (checked: boolean) => {
    setShowFieldsTable(checked)
    if (!checked) {
      // Si se oculta la tabla, limpiar las selecciones específicas
      updateTaskWithFieldIds([])
    }
  }

  // Always show all lots available
  const displayLots = lots

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Workspace Selector */}
        <div>
          <Label htmlFor="workspace">{t2("workspaceLabel")}</Label>
          <Select value={selectedWorkspace} onValueChange={handleWorkspaceChange} disabled={workspacesLoading}>
            <SelectTrigger>
              <SelectValue placeholder={workspacesLoading ? t("loading") : t("selectWorkspace")} />
            </SelectTrigger>
            <SelectContent>
              {workspacesError ? (
                <div className="p-2 text-red-500 text-sm">{workspacesError}</div>
              ) : workspaces.length === 0 ? (
                <div className="p-2 text-muted-foreground text-sm">{t2("noWorkspacesAvailable")}</div>
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
          <Label htmlFor="season">{t2("campaignLabel")}</Label>
          <Select
            value={selectedCampaign}
            onValueChange={handleCampaignChange}
            disabled={!selectedWorkspace || seasonsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={seasonsLoading ? t("loading") : t("selectSeason")} />
            </SelectTrigger>
            <SelectContent>
              {seasonsError ? (
                <div className="p-2 text-red-500 text-sm">{seasonsError}</div>
              ) : campaigns.length === 0 ? (
                <div className="p-2 text-muted-foreground text-sm">{t2("noCampaignsAvailable")}</div>
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
          <Label htmlFor="farm">{t2("establishmentLabel")}</Label>
          <Select
            value={selectedEstablishment}
            onValueChange={handleEstablishmentChange}
            disabled={!selectedCampaign || farmsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={farmsLoading ? t("loading") : t("selectFarm")} />
            </SelectTrigger>
            <SelectContent>
              {farmsError ? (
                <div className="p-2 text-red-500 text-sm">{farmsError}</div>
              ) : establishments.length === 0 ? (
                <div className="p-2 text-muted-foreground text-sm">{t2("noEstablishmentsAvailable")}</div>
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

      {/* Field Selection Section */}
      {selectedEstablishment && (
        <div className="mt-6 space-y-4">
          {/* Default state - All lots selected */}
          {!showFieldsTable && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 font-medium">{t2("allLotsSelected")}</p>
            </div>
          )}

          {/* Toggle to show specific field selection */}
          <div className="flex items-center space-x-2">
            <Switch
              id="show-fields-table"
              checked={showFieldsTable}
              onCheckedChange={handleToggleShowFields}
            />
            <Label htmlFor="show-fields-table" className="text-sm font-medium">
              {t2("includeOnlyTheseLots")}
            </Label>
          </div>

          {/* Fields (Lots) Table - Only shown when toggle is enabled */}
          {showFieldsTable && (
            <div className="mt-4">
              <h3 className="text-md font-medium mb-4">
                {mode === 'edit' && currentFieldIdsOnlyIncluded.length > 0 
                  ? `${t2("availableLotsTitle")} (${currentFieldIdsOnlyIncluded.length} lotes seleccionados de ${displayLots.length} disponibles)`
                  : t2("availableLotsTitle")
                }
              </h3>
              {fieldsLoading ? (
                <div className="text-center py-8 text-muted-foreground">{t2("loadingLots")}</div>
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
                            onChange={handleToggleAllFields}
                            aria-label={t2("selectAllLots")}
                            className="h-4 w-4 accent-primary rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          />
                          <span className="ml-2">{t2("selectAll")}</span>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {t2("lot")}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {t2("cropHybrid")}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {t2("hectares")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                                              {displayLots.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                              {t2("noLotsAvailable")}
                            </td>
                          </tr>
                      ) : (
                        displayLots.map((field) => (
                          <tr key={field.id}>
                            <td className="px-6 whitespace-nowrap">
                              <Checkbox
                                id={`field-${field.id}`}
                                checked={currentFieldIdsOnlyIncluded.includes(field.id)}
                                onCheckedChange={() => handleFieldSelection(field.id)}
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
        </div>
      )}

    </div>
  )
} 