"use client"

import { 
  useState, 
  useEffect 
} from "react"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useParams } from "next/navigation"
import { apiClient } from "@/lib/integrations/amplify"
import { 
  listWorkspaces, 
  listSeasons, 
  listFarms, 
  listFields 
} from "@/lib/integrations/360"
import { Search } from "lucide-react"

interface LotSearchFormProps {
  onSearch: (selectedLot: any) => void
  loading: boolean
  userEmail: string
}

interface Workspace {
  id: number
  name: string
  deleted: boolean
}

interface Season {
  id: number
  name: string
  deleted: boolean
}

interface Farm {
  id: number
  name: string
  deleted: boolean
}

interface LotField {
  id: number
  name: string
  cropName: string
  hybridName: string
  hectares: number
  cropDate: string
  cropId: number
  farmId: number
  hybridId: number
  layerId: number
  seasonId: number
  workspaceId: number
}

export function LotSearchForm({ onSearch, loading, userEmail }: LotSearchFormProps) {
  const params = useParams()
  const domainId = Number(params.domain)
  const projectId = params.project as string
  

  
  // State for selections
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("")
  const [selectedCampaign, setSelectedCampaign] = useState<string>("")
  const [selectedEstablishment, setSelectedEstablishment] = useState<string>("")
  const [selectedLot, setSelectedLot] = useState<string>("")
  
  // State for data
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [campaigns, setCampaigns] = useState<Season[]>([])
  const [establishments, setEstablishments] = useState<Farm[]>([])
  const [lots, setLots] = useState<LotField[]>([])
  
  // Loading states
  const [workspacesLoading, setWorkspacesLoading] = useState(true) // Start as true to show loading initially
  const [campaignsLoading, setCampaignsLoading] = useState(false)
  const [establishmentsLoading, setEstablishmentsLoading] = useState(false)
  const [lotsLoading, setLotsLoading] = useState(false)
  
  // Error states
  const [workspacesError, setWorkspacesError] = useState<string | null>(null)
  const [campaignsError, setCampaignsError] = useState<string | null>(null)
  const [establishmentsError, setEstablishmentsError] = useState<string | null>(null)
  const [lotsError, setLotsError] = useState<string | null>(null)
  
  // Get areaId from project
  const [areaId, setAreaId] = useState<number>(0)
  
  // Fetch project to get areaId and then fetch workspaces
  useEffect(() => {
    const fetchProjectAndWorkspaces = async () => {
      try {
        // First, get the project data to get areaId
        const projectData = await apiClient.getProject(projectId)
        if (!projectData || projectData.areaId === undefined || projectData.areaId === null) {
          setWorkspacesError("No se pudo obtener el ID de área del proyecto")
          setWorkspacesLoading(false)
          return
        }

        const newAreaId = Number(projectData.areaId)
        setAreaId(newAreaId)

        // Validate parameters before making the API call
        if (!userEmail || userEmail.trim() === '') {
          setWorkspacesError("Email de usuario no disponible")
          setWorkspacesLoading(false)
          return
        }
        
        if (!domainId || domainId <= 0) {
          setWorkspacesError("ID de dominio inválido")
          setWorkspacesLoading(false)
          return
        }
        
        if (!newAreaId || newAreaId <= 0) {
          setWorkspacesError("ID de área inválido")
          setWorkspacesLoading(false)
          return
        }

        // Now fetch workspaces
        setWorkspacesLoading(true)
        setWorkspacesError(null)
        
        const workspacesData = await listWorkspaces(userEmail, domainId, newAreaId)
        const filteredAndSorted = workspacesData
          .filter((workspace) => workspace.deleted === false)
          .sort((a, b) => a.name.localeCompare(b.name))
        setWorkspaces(filteredAndSorted)
      } catch (error) {
        console.error("Error fetching project or workspaces:", error)
        const errorMessage = error instanceof Error ? error.message : "Error desconocido"
        setWorkspacesError(`Error al cargar espacios de trabajo: ${errorMessage}`)
        setWorkspaces([])
      } finally {
        setWorkspacesLoading(false)
      }
    }

    if (userEmail && domainId > 0) {
      fetchProjectAndWorkspaces()
    } else {
      setWorkspacesLoading(false)
      // Only show errors if we're not in the initial loading state
      if (!workspacesLoading) {
        if (!userEmail) {
          setWorkspacesError("Email de usuario no disponible")
        } else if (!domainId || domainId <= 0) {
          setWorkspacesError("ID de dominio inválido")
        }
      }
    }
  }, [userEmail, domainId, projectId])

  // Fetch campaigns when workspace changes
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!selectedWorkspace) {
        setCampaigns([])
        setSelectedCampaign("")
        return
      }

      try {
        setCampaignsLoading(true)
        setCampaignsError(null)
        
        const campaignsData = await listSeasons(selectedWorkspace)
        const filteredAndSorted = campaignsData
          .filter((campaign) => campaign.deleted === false)
          .sort((a, b) => a.name.localeCompare(b.name))
        setCampaigns(filteredAndSorted)
        setSelectedCampaign("")
      } catch (error) {
        console.error("Error fetching campaigns:", error)
        const errorMessage = error instanceof Error ? error.message : "Error desconocido"
        setCampaignsError(`Error al cargar campañas: ${errorMessage}`)
        setCampaigns([])
      } finally {
        setCampaignsLoading(false)
      }
    }

    fetchCampaigns()
  }, [selectedWorkspace])

  // Fetch establishments when campaign changes
  useEffect(() => {
    const fetchEstablishments = async () => {
      if (!selectedWorkspace || !selectedCampaign) {
        setEstablishments([])
        setSelectedEstablishment("")
        return
      }

      try {
        setEstablishmentsLoading(true)
        setEstablishmentsError(null)
        
        const establishmentsData = await listFarms(selectedWorkspace, selectedCampaign)
        const filteredAndSorted = establishmentsData
          .filter((establishment) => establishment.deleted === false)
          .sort((a, b) => a.name.localeCompare(b.name))
        setEstablishments(filteredAndSorted)
        setSelectedEstablishment("")
      } catch (error) {
        console.error("Error fetching establishments:", error)
        const errorMessage = error instanceof Error ? error.message : "Error desconocido"
        setEstablishmentsError(`Error al cargar establecimientos: ${errorMessage}`)
        setEstablishments([])
      } finally {
        setEstablishmentsLoading(false)
      }
    }

    fetchEstablishments()
  }, [selectedWorkspace, selectedCampaign])

  // Fetch lots when establishment changes
  useEffect(() => {
    const fetchLots = async () => {
      if (!selectedWorkspace || !selectedCampaign || !selectedEstablishment) {
        setLots([])
        setSelectedLot("")
        return
      }

      try {
        setLotsLoading(true)
        setLotsError(null)
        
        const lotsData = await listFields(selectedWorkspace, selectedCampaign, selectedEstablishment)
        // Ordenar alfabéticamente por nombre del lote
        const sorted = lotsData.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }))
        setLots(sorted)
        setSelectedLot("")
      } catch (error) {
        console.error("Error fetching lots:", error)
        const errorMessage = error instanceof Error ? error.message : "Error desconocido"
        setLotsError(`Error al cargar lotes: ${errorMessage}`)
        setLots([])
      } finally {
        setLotsLoading(false)
      }
    }

    fetchLots()
  }, [selectedWorkspace, selectedCampaign, selectedEstablishment])

  const handleWorkspaceChange = (value: string) => {
    setSelectedWorkspace(value)
    setSelectedCampaign("")
    setSelectedEstablishment("")
    setSelectedLot("")
  }

  const handleCampaignChange = (value: string) => {
    setSelectedCampaign(value)
    setSelectedEstablishment("")
    setSelectedLot("")
  }

  const handleEstablishmentChange = (value: string) => {
    setSelectedEstablishment(value)
    setSelectedLot("")
  }

  const handleLotChange = (value: string) => {
    setSelectedLot(value)
  }

  const handleSearch = () => {
    if (!selectedLot) return
    
    const selectedLotData = lots.find(lot => lot.id.toString() === selectedLot)
    if (selectedLotData) {
      onSearch({
        workspaceId: selectedWorkspace,
        workspaceName: workspaces.find(w => w.id.toString() === selectedWorkspace)?.name,
        campaignId: selectedCampaign,
        campaignName: campaigns.find(c => c.id.toString() === selectedCampaign)?.name,
        farmId: selectedEstablishment,
        farmName: establishments.find(e => e.id.toString() === selectedEstablishment)?.name,
        fieldId: selectedLot,
        fieldName: selectedLotData.name,
        cropName: selectedLotData.cropName,
        hybridName: selectedLotData.hybridName,
        hectares: selectedLotData.hectares
      })
    }
  }

  const isSearchDisabled = !selectedLot || loading

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Buscar Lote</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Workspace Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Espacio de trabajo
          </label>
          <Select value={selectedWorkspace} onValueChange={handleWorkspaceChange}>
                         <SelectTrigger className="w-full">
               <SelectValue placeholder={
                 workspacesLoading ? "Cargando espacios de trabajo..." : 
                 workspacesError ? "Error" : 
                 "Seleccionar espacio de trabajo"
               } />
             </SelectTrigger>
                         <SelectContent>
               {workspaces.map((workspace) => (
                 <SelectItem key={workspace.id} value={workspace.id.toString()}>
                   {workspace.name}
                 </SelectItem>
               ))}
             </SelectContent>
          </Select>
          {workspacesError && (
            <p className="text-red-500 text-xs mt-1">{workspacesError}</p>
          )}
        </div>

        {/* Campaign Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaña
          </label>
          <Select 
            value={selectedCampaign} 
            onValueChange={handleCampaignChange}
            disabled={!selectedWorkspace}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                !selectedWorkspace ? "Seleccione espacio de trabajo" :
                campaignsLoading ? "Cargando..." : 
                campaignsError ? "Error" : 
                "Seleccionar campaña"
              } />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id.toString()}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {campaignsError && (
            <p className="text-red-500 text-xs mt-1">{campaignsError}</p>
          )}
        </div>

        {/* Establishment Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Establecimiento
          </label>
          <Select 
            value={selectedEstablishment} 
            onValueChange={handleEstablishmentChange}
            disabled={!selectedCampaign}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                !selectedCampaign ? "Seleccione campaña" :
                establishmentsLoading ? "Cargando..." : 
                establishmentsError ? "Error" : 
                "Seleccionar establecimiento"
              } />
            </SelectTrigger>
            <SelectContent>
              {establishments.map((establishment) => (
                <SelectItem key={establishment.id} value={establishment.id.toString()}>
                  {establishment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {establishmentsError && (
            <p className="text-red-500 text-xs mt-1">{establishmentsError}</p>
          )}
        </div>

        {/* Lot Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lote
          </label>
          <Select 
            value={selectedLot} 
            onValueChange={handleLotChange}
            disabled={!selectedEstablishment}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                !selectedEstablishment ? "Seleccione establecimiento" :
                lotsLoading ? "Cargando..." : 
                lotsError ? "Error" : 
                "Seleccionar lote"
              } />
            </SelectTrigger>
                         <SelectContent>
               {lots.map((lot) => (
                 <SelectItem key={lot.id} value={lot.id.toString()}>
                   {lot.name}
                 </SelectItem>
               ))}
             </SelectContent>
          </Select>
          {lotsError && (
            <p className="text-red-500 text-xs mt-1">{lotsError}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSearch} 
          disabled={isSearchDisabled}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Buscar
        </Button>
      </div>
    </div>
  )
} 