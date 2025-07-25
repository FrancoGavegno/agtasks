"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from '@/lib/integrations/amplify'
import type { Field, CreateFieldInput, UpdateFieldInput } from "@/lib/schemas"

interface FieldDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  field?: Field | null
}

export function FieldDialog({ open, onOpenChange, field }: FieldDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreateFieldInput>({
    workspaceId: "",
    workspaceName: "",
    campaignId: "",
    campaignName: "",
    farmId: "",
    farmName: "",
    fieldId: "",
    fieldName: "",
    hectares: undefined,
    crop: "",
    hybrid: "",
    deleted: false
  })

  // Auto-populate form when editing
  useEffect(() => {
    if (field) {
      setFormData({
        workspaceId: field.workspaceId || "",
        workspaceName: field.workspaceName || "",
        campaignId: field.campaignId || "",
        campaignName: field.campaignName || "",
        farmId: field.farmId || "",
        farmName: field.farmName || "",
        fieldId: field.fieldId || "",
        fieldName: field.fieldName || "",
        hectares: field.hectares,
        crop: field.crop || "",
        hybrid: field.hybrid || "",
        deleted: false
      })
    } else {
      // Reset form for create mode
      setFormData({
        workspaceId: "",
        workspaceName: "",
        campaignId: "",
        campaignName: "",
        farmId: "",
        farmName: "",
        fieldId: "",
        fieldName: "",
        hectares: undefined,
        crop: "",
        hybrid: "",
        deleted: false
      })
    }
  }, [field, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const submitData = {
        ...formData,
        hectares: formData.hectares || undefined,
      }

      if (field) {
        await apiClient.updateField(field.id!, submitData as UpdateFieldInput)
      } else {
        await apiClient.createField(submitData)
      }
      
      onOpenChange(false)
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error saving field:', error)
      alert("An error occurred while saving the field")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{field ? "Edit Field" : "Create Field"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fieldName">Field Name *</Label>
              <Input
                id="fieldName"
                value={formData.fieldName}
                onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fieldId">Field ID *</Label>
              <Input
                id="fieldId"
                value={formData.fieldId}
                onChange={(e) => setFormData({ ...formData, fieldId: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspaceId">Workspace ID *</Label>
              <Input
                id="workspaceId"
                value={formData.workspaceId}
                onChange={(e) => setFormData({ ...formData, workspaceId: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspaceName">Workspace Name</Label>
              <Input
                id="workspaceName"
                value={formData.workspaceName}
                onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaignId">Campaign ID *</Label>
              <Input
                id="campaignId"
                value={formData.campaignId}
                onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                value={formData.campaignName}
                onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farmId">Farm ID *</Label>
              <Input
                id="farmId"
                value={formData.farmId}
                onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farmName">Farm Name</Label>
              <Input
                id="farmName"
                value={formData.farmName}
                onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hectares">Hectares</Label>
              <Input
                id="hectares"
                type="number"
                step="0.01"
                value={formData.hectares || ""}
                onChange={(e) => setFormData({ ...formData, hectares: e.target.value ? Number(e.target.value) : undefined })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crop">Crop</Label>
              <Input
                id="crop"
                value={formData.crop}
                onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hybrid">Hybrid</Label>
              <Input
                id="hybrid"
                value={formData.hybrid}
                onChange={(e) => setFormData({ ...formData, hybrid: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (field ? "Updating..." : "Creating...") : field ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
