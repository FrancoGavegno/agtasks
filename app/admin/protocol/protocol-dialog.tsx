"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createDomainProtocol } from "@/lib/services/agtasks"
import type { Schema } from "@/amplify/data/resource"

type DomainProtocol = Schema["DomainProtocol"]["type"]

interface DomainProtocolDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  domainProtocol?: DomainProtocol | null
}

export function DomainProtocolDialog({ open, onOpenChange, domainProtocol }: DomainProtocolDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    domainId: "",
    tmProtocolId: "",
    name: "",
    language: "",
  })

  // Auto-populate form when editing
  useEffect(() => {
    if (domainProtocol) {
      setFormData({
        domainId: domainProtocol.domainId || "",
        tmProtocolId: domainProtocol.tmProtocolId || "",
        name: domainProtocol.name || "",
        language: domainProtocol.language || "",
      })
    } else {
      // Reset form for create mode
      setFormData({
        domainId: "",
        tmProtocolId: "",
        name: "",
        language: "",
      })
    }
  }, [domainProtocol, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createDomainProtocol(formData)
      onOpenChange(false)
    } catch (error) {
      alert("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{domainProtocol ? "Edit Domain Protocol" : "Create Domain Protocol"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domainId">Domain ID *</Label>
            <Input
              id="domainId"
              value={formData.domainId}
              onChange={(e) => setFormData({ ...formData, domainId: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tmProtocolId">TM Protocol ID *</Label>
            <Input
              id="tmProtocolId"
              value={formData.tmProtocolId}
              onChange={(e) => setFormData({ ...formData, tmProtocolId: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language *</Label>
            <Input
              id="language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (domainProtocol ? "Updating..." : "Creating...") : domainProtocol ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
