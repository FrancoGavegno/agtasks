"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Step2FormValues } from "./validation-schemas"
import { useServiceForm } from "@/lib/contexts/service-form-context"

export default function Step2Lots() {
  const form = useFormContext<Step2FormValues>()
  const {
    workspaces,
    campaigns,
    establishments,
    lots,
    workspacesLoading,
    campaignsLoading,
    establishmentsLoading,
    lotsLoading,
    updateFormValues,
  } = useServiceForm()

  const workspace = form.watch ? form.watch("workspace") : ""
  const campaign = form.watch ? form.watch("campaign") : ""
  const establishment = form.watch ? form.watch("establishment") : ""
  const selectedLots = form.watch ? form.watch("selectedLots") : []

  // Filter campaigns by selected workspace
  const filteredCampaigns = campaigns.filter((campaign) => campaign.workspaceId === workspace)

  // Filter establishments by selected workspace and campaign
  const filteredEstablishments = establishments.filter(
    (establishment) => establishment.workspaceId === workspace && establishment.campaignId === campaign,
  )

  // Filter lots by selected establishment
  const filteredLots = lots.filter((lot) => lot.establishmentId === establishment)

  // Handle workspace selection
  const handleWorkspaceChange = (value: string) => {
    form.setValue("workspace", value, { shouldValidate: true })
    form.setValue("campaign", "", { shouldValidate: true })
    form.setValue("establishment", "", { shouldValidate: true })
    form.setValue("selectedLots", [], { shouldValidate: true })

    // Update context
    updateFormValues({
      workspace: value,
      campaign: "",
      establishment: "",
      selectedLots: [],
    })
  }

  // Handle campaign selection
  const handleCampaignChange = (value: string) => {
    form.setValue("campaign", value, { shouldValidate: true })
    form.setValue("establishment", "", { shouldValidate: true })
    form.setValue("selectedLots", [], { shouldValidate: true })

    // Update context
    updateFormValues({
      campaign: value,
      establishment: "",
      selectedLots: [],
    })
  }

  // Handle establishment selection
  const handleEstablishmentChange = (value: string) => {
    form.setValue("establishment", value, { shouldValidate: true })
    form.setValue("selectedLots", [], { shouldValidate: true })

    // Update context
    updateFormValues({
      establishment: value,
      selectedLots: [],
    })
  }

  // Handle lot selection
  const handleLotSelection = (lotId: string) => {
    const currentLots = form.getValues("selectedLots") || []
    const newLots = currentLots.includes(lotId) ? currentLots.filter((id) => id !== lotId) : [...currentLots, lotId]

    form.setValue("selectedLots", newLots, { shouldValidate: true })

    // Update context
    updateFormValues({
      selectedLots: newLots,
    })
  }

  return (
    <div className="space-y-6">
      <p className="text-lg font-medium">Seleccione uno o más lotes</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    {workspaces.map((workspace) => (
                      <SelectItem key={workspace.id} value={workspace.id}>
                        {workspace.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

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
                  disabled={!workspace || campaignsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={campaignsLoading ? "Cargando..." : "Seleccionar campaña"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCampaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

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
                  disabled={!campaign || establishmentsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={establishmentsLoading ? "Cargando..." : "Seleccionar establecimiento"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredEstablishments.map((establishment) => (
                      <SelectItem key={establishment.id} value={establishment.id}>
                        {establishment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
      </div>

      {establishment && !lotsLoading && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Lotes disponibles</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Seleccionar
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
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
                    Cultivo/Híbrido/Variedad
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
                {filteredLots.map((lot) => (
                  <tr key={lot.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Checkbox
                        id={`lot-${lot.id}`}
                        checked={selectedLots?.includes(lot.id)}
                        onCheckedChange={() => handleLotSelection(lot.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lot.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lot.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lot.crop}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lot.hectares}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <FormField
            control={form.control}
            name="selectedLots"
            render={({ fieldState }) => (
              <FormItem>
                {/* Mostrar el mensaje de error siempre que el campo sea inválido y se haya intentado validar */}
                {fieldState.invalid && <p className="text-red-500 mt-2">Por favor, seleccione al menos un lote</p>}
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  )
}
