"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Step2FormValues } from "./validation-schemas"

// Datos de ejemplo para los selectores
const workspaces = ["Workspace 1", "Workspace 2", "Workspace 3"]
const campaigns = {
  "Workspace 1": ["Campaña 2023/24", "Campaña 2022/23"],
  "Workspace 2": ["Campaña 2023/24", "Campaña 2021/22"],
  "Workspace 3": ["Campaña 2023/24"],
}
const establishments = {
  "Workspace 1-Campaña 2023/24": ["Establecimiento A", "Establecimiento B"],
  "Workspace 1-Campaña 2022/23": ["Establecimiento C"],
  "Workspace 2-Campaña 2023/24": ["Establecimiento D", "Establecimiento E"],
  "Workspace 2-Campaña 2021/22": ["Establecimiento F"],
  "Workspace 3-Campaña 2023/24": ["Establecimiento G"],
}

// Datos de ejemplo para los lotes
const lots = {
  "Establecimiento A": [
    { id: "A001", name: "Lote Norte", crop: "Maíz / P1234", hectares: 45.5 },
    { id: "A002", name: "Lote Sur", crop: "Soja / DM4615", hectares: 32.8 },
    { id: "A003", name: "Lote Este", crop: "Trigo / Klein Serpiente", hectares: 28.3 },
  ],
  "Establecimiento B": [
    { id: "B001", name: "Lote 1", crop: "Soja / DM4670", hectares: 50.2 },
    { id: "B002", name: "Lote 2", crop: "Maíz / DK7210", hectares: 38.7 },
  ],
  "Establecimiento C": [{ id: "C001", name: "Lote Principal", crop: "Girasol / P102CL", hectares: 60.0 }],
  "Establecimiento D": [
    { id: "D001", name: "Lote A", crop: "Maíz / P1234", hectares: 42.1 },
    { id: "D002", name: "Lote B", crop: "Soja / NS4309", hectares: 35.6 },
  ],
  "Establecimiento E": [{ id: "E001", name: "Lote Único", crop: "Trigo / Buck Meteoro", hectares: 75.3 }],
  "Establecimiento F": [{ id: "F001", name: "Lote 1", crop: "Soja / DM4615", hectares: 48.9 }],
  "Establecimiento G": [
    { id: "G001", name: "Lote Norte", crop: "Maíz / DK7210", hectares: 55.0 },
    { id: "G002", name: "Lote Sur", crop: "Soja / DM4670", hectares: 40.2 },
  ],
}

export default function Step2Lots() {
  const form = useFormContext<Step2FormValues>()
  const workspace = form.watch ? form.watch("workspace") : ""
  const campaign = form.watch ? form.watch("campaign") : ""
  const establishment = form.watch ? form.watch("establishment") : ""
  const selectedLots = form.watch ? form.watch("selectedLots") : []

  // Función para manejar la selección de lotes
  const handleLotSelection = (lotId: string) => {
    const currentLots = form.getValues("selectedLots") || []
    const newLots = currentLots.includes(lotId) ? currentLots.filter((id) => id !== lotId) : [...currentLots, lotId]

    form.setValue("selectedLots", newLots, { shouldValidate: true })
  }

  // Obtener lotes disponibles basados en el establecimiento seleccionado
  const availableLots = establishment ? lots[establishment as keyof typeof lots] || [] : []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="workspace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Espacio de trabajo</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value)
                    form.setValue("campaign", "", { shouldValidate: true })
                    form.setValue("establishment", "", { shouldValidate: true })
                    form.setValue("selectedLots", [], { shouldValidate: true })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar espacio" />
                  </SelectTrigger>
                  <SelectContent>
                    {workspaces.map((workspace) => (
                      <SelectItem key={workspace} value={workspace}>
                        {workspace}
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
                  onValueChange={(value) => {
                    field.onChange(value)
                    form.setValue("establishment", "", { shouldValidate: true })
                    form.setValue("selectedLots", [], { shouldValidate: true })
                  }}
                  disabled={!workspace}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar campaña" />
                  </SelectTrigger>
                  <SelectContent>
                    {workspace &&
                      campaigns[workspace as keyof typeof campaigns]?.map((campaign) => (
                        <SelectItem key={campaign} value={campaign}>
                          {campaign}
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
                  onValueChange={(value) => {
                    field.onChange(value)
                    form.setValue("selectedLots", [], { shouldValidate: true })
                  }}
                  disabled={!campaign}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar establecimiento" />
                  </SelectTrigger>
                  <SelectContent>
                    {workspace &&
                      campaign &&
                      establishments[`${workspace}-${campaign}` as keyof typeof establishments]?.map(
                        (establishment) => (
                          <SelectItem key={establishment} value={establishment}>
                            {establishment}
                          </SelectItem>
                        ),
                      )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
      </div>

      {establishment && (
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
                {availableLots.map((lot) => (
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
            render={() => (
              <FormItem>
                <FormMessage className="text-red-500 mt-2" />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  )
}
