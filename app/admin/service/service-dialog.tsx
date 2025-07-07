"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createService, updateService } from "@/lib/admin-actions"
import type { Schema } from "@/amplify/data/resource"

type Service = Schema["Service"]["type"]
type Project = Schema["Project"]["type"]

interface ServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: Service | null
  projects: Project[]
}

export function ServiceDialog({ open, onOpenChange, service, projects }: ServiceDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    projectId: "",
    tmpRequestId: "",
    requestId: "",
  })

  // Auto-populate form when editing
  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        projectId: service.projectId || "",
        tmpRequestId: service.tmpRequestId || "",
        requestId: service.requestId || "",
      })
    } else {
      // Reset form for create mode
      setFormData({
        name: "",
        projectId: "",
        tmpRequestId: "",
        requestId: "",
      })
    }
  }, [service, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = service ? await updateService(service.id, formData) : await createService(formData)

      if (result.success) {
        onOpenChange(false)
      } else {
        alert(result.error || "An error occurred")
      }
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
          <DialogTitle>{service ? "Edit Service" : "Create Service"}</DialogTitle>
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
            <Label htmlFor="projectId">Project</Label>
            <Select
              value={formData.projectId}
              onValueChange={(value) => setFormData({ ...formData, projectId: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Project</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tmpRequestId">Template Request ID</Label>
            <Input
              id="tmpRequestId"
              value={formData.tmpRequestId}
              onChange={(e) => setFormData({ ...formData, tmpRequestId: e.target.value })}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="requestId">Request ID</Label>
            <Input
              id="requestId"
              value={formData.requestId}
              onChange={(e) => setFormData({ ...formData, requestId: e.target.value })}
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (service ? "Updating..." : "Creating...") : service ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
