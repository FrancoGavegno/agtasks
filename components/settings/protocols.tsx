"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModalProtocols } from "./protocol-modal"

interface Protocol {
  id: string
  name: string
  language: "PT" | "EN" | "ES"
}

export default function Protocols() {
  const [protocols] = useState<Protocol[]>([
    { id: "1", name: "Monitoramento Satelital", language: "PT" },
    { id: "2", name: "Digitalização de Estabelecimentos e Lotes", language: "PT" },
    { id: "3", name: "Weed Control", language: "EN" },
    { id: "4", name: "Variable rate recommendations & applications", language: "EN" },
    { id: "5", name: "Protocolo Siembra y/o Fertilización Variable", language: "ES" },
    { id: "6", name: "Monitoreo satelital y control de malezas", language: "ES" },
  ])

  // Initialize selectedProtocols with all protocol IDs
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>(protocols.map((p) => p.id))

  const [filter, setFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter protocols by name and only show selected ones
  const filteredProtocols = protocols
    .filter((protocol) => selectedProtocols.includes(protocol.id))
    .filter((protocol) => protocol.name.toLowerCase().includes(filter.toLowerCase()))

  const handleSavePreferences = (selectedIds: string[]) => {
    setSelectedProtocols(selectedIds)
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5">
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight">Protocols</h2>
          <p className="text-muted-foreground">Manage service protocols</p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          Edit
        </Button>
      </div>

      <div className="mb-5">
        <Input
          placeholder="Filter protocols..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-full"
        />
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-10 items-center px-4 py-3 bg-muted/50 text-sm">
          <div className="col-span-8 font-medium">Protocol</div>
          <div className="col-span-2 font-medium text-center">Language</div>
        </div>

        {filteredProtocols.length > 0 ? (
          filteredProtocols.map((protocol) => (
            <div key={protocol.id} className="grid grid-cols-10 items-center px-4 py-3 border-t text-sm">
              <div className="col-span-8 font-medium">{protocol.name}</div>
              <div className="col-span-2 text-center">
                <Badge variant="outline">{protocol.language}</Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">No protocols found.</div>
        )}
      </div>

      <div className="flex items-center justify-end mt-4 text-sm text-muted-foreground">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>

      <ModalProtocols
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        protocols={protocols}
        selectedProtocols={selectedProtocols}
        onSave={handleSavePreferences}
      />
    </div>
  )
}
