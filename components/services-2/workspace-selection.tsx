"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

// Datos de ejemplo
const WORKSPACES = [
  { id: "ws1", name: "Espacio 1" },
  { id: "ws2", name: "Espacio 2" },
]

const CAMPAIGNS = [
  { id: "camp1", name: "Campaña 1", workspaceId: "ws1" },
  { id: "camp2", name: "Campaña 2", workspaceId: "ws1" },
  { id: "camp3", name: "Campaña 3", workspaceId: "ws2" },
  { id: "camp4", name: "Campaña 4", workspaceId: "ws2" },
]

const ESTABLISHMENTS = [
  { id: "est1", name: "Establecimiento 1", campaignId: "camp1" },
  { id: "est2", name: "Establecimiento 2", campaignId: "camp1" },
  { id: "est3", name: "Establecimiento 3", campaignId: "camp2" },
  { id: "est4", name: "Establecimiento 4", campaignId: "camp3" },
  { id: "est5", name: "Establecimiento 5", campaignId: "camp4" },
]

const LOTS = [
  { id: "lot1", name: "Lote 1", establishmentId: "est1", area: "10 ha", crop: "Maíz" },
  { id: "lot2", name: "Lote 2", establishmentId: "est1", area: "15 ha", crop: "Soja" },
  { id: "lot3", name: "Lote 3", establishmentId: "est1", area: "20 ha", crop: "Trigo" },
  { id: "lot4", name: "Lote 4", establishmentId: "est2", area: "12 ha", crop: "Maíz" },
  { id: "lot5", name: "Lote 5", establishmentId: "est2", area: "18 ha", crop: "Soja" },
  { id: "lot6", name: "Lote 6", establishmentId: "est3", area: "25 ha", crop: "Girasol" },
  { id: "lot7", name: "Lote 7", establishmentId: "est4", area: "30 ha", crop: "Maíz" },
  { id: "lot8", name: "Lote 8", establishmentId: "est5", area: "22 ha", crop: "Soja" },
]

type WorkspaceSelectionProps = {
  onSelectionChange: (isValid: boolean) => void
}

export default function WorkspaceSelection({ onSelectionChange }: WorkspaceSelectionProps) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("")
  const [selectedCampaign, setSelectedCampaign] = useState<string>("")
  const [selectedEstablishment, setSelectedEstablishment] = useState<string>("")
  const [selectedLots, setSelectedLots] = useState<string[]>([])
  const [allSelected, setAllSelected] = useState(false)

  // Filtrar campañas basadas en el espacio de trabajo seleccionado
  const filteredCampaigns = CAMPAIGNS.filter((campaign) => campaign.workspaceId === selectedWorkspace)

  // Filtrar establecimientos basados en la campaña seleccionada
  const filteredEstablishments = ESTABLISHMENTS.filter((establishment) => establishment.campaignId === selectedCampaign)

  // Filtrar lotes basados en el establecimiento seleccionado
  const filteredLots = LOTS.filter((lot) => lot.establishmentId === selectedEstablishment)

  // Verificar si la selección es válida (todos los campos requeridos y al menos 1 lote)
  useEffect(() => {
    const isValid = !!selectedWorkspace && !!selectedCampaign && !!selectedEstablishment && selectedLots.length > 0

    onSelectionChange(isValid)
  }, [selectedWorkspace, selectedCampaign, selectedEstablishment, selectedLots, onSelectionChange])

  // Manejar cambio de espacio de trabajo
  const handleWorkspaceChange = (value: string) => {
    setSelectedWorkspace(value)
    setSelectedCampaign("")
    setSelectedEstablishment("")
    setSelectedLots([])
    setAllSelected(false)
  }

  // Manejar cambio de campaña
  const handleCampaignChange = (value: string) => {
    setSelectedCampaign(value)
    setSelectedEstablishment("")
    setSelectedLots([])
    setAllSelected(false)
  }

  // Manejar cambio de establecimiento
  const handleEstablishmentChange = (value: string) => {
    setSelectedEstablishment(value)
    setSelectedLots([])
    setAllSelected(false)
  }

  // Manejar selección de lotes
  const handleLotSelection = (lotId: string) => {
    setSelectedLots((prev) => {
      if (prev.includes(lotId)) {
        const newSelection = prev.filter((id) => id !== lotId)
        setAllSelected(newSelection.length === filteredLots.length)
        return newSelection
      } else {
        const newSelection = [...prev, lotId]
        setAllSelected(newSelection.length === filteredLots.length)
        return newSelection
      }
    })
  }

  // Seleccionar o deseleccionar todos los lotes
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedLots([])
      setAllSelected(false)
    } else {
      setSelectedLots(filteredLots.map((lot) => lot.id))
      setAllSelected(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="space-y-2">
          <Label htmlFor="workspace">Espacio de trabajo</Label>
          <Select value={selectedWorkspace} onValueChange={handleWorkspaceChange}>
            <SelectTrigger>
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {WORKSPACES.map((workspace) => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="campaign">Campaña</Label>
          <Select value={selectedCampaign} onValueChange={handleCampaignChange} disabled={!selectedWorkspace}>
            <SelectTrigger>
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {filteredCampaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="establishment">Establecimiento</Label>
          <Select value={selectedEstablishment} onValueChange={handleEstablishmentChange} disabled={!selectedCampaign}>
            <SelectTrigger>
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {filteredEstablishments.map((establishment) => (
                <SelectItem key={establishment.id} value={establishment.id}>
                  {establishment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedEstablishment && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Lotes</h3>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">{selectedLots.length} lotes seleccionados</div>
                  <Button variant="outline" size="sm" onClick={toggleSelectAll} disabled={filteredLots.length === 0}>
                    {allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allSelected && filteredLots.length > 0}
                        onCheckedChange={toggleSelectAll}
                        disabled={filteredLots.length === 0}
                      />
                    </TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Cultivo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLots.map((lot) => (
                    <TableRow key={lot.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedLots.includes(lot.id)}
                          onCheckedChange={() => handleLotSelection(lot.id)}
                        />
                      </TableCell>
                      <TableCell>{lot.name}</TableCell>
                      <TableCell>{lot.area}</TableCell>
                      <TableCell>{lot.crop}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredLots.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No hay lotes disponibles para este establecimiento
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

