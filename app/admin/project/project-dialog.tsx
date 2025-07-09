"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createProject, updateProject } from "@/lib/services/agtasks"
import type { Schema } from "@/amplify/data/resource"

type Project = Schema["Project"]["type"]

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project | null
}

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    domainId: "",
    areaId: "",
    serviceDeskId: "",
    requestTypeId: "",
    name: "",
    language: "",
    tmpSourceSystem: "jira",
    tmpServiceDeskId: "TEM",
    tmpRequestTypeId: "87",
    tmpQueueId: "82",
    queueId: "",
  })

  // Auto-populate form when editing
  useEffect(() => {
    if (project) {
      setFormData({
        domainId: project.domainId || "",
        areaId: project.areaId || "",
        serviceDeskId: project.serviceDeskId || "",
        requestTypeId: project.requestTypeId || "",
        name: project.name || "",
        language: project.language || "",
        tmpSourceSystem: project.tmpSourceSystem || "jira",
        tmpServiceDeskId: project.tmpServiceDeskId || "TEM",
        tmpRequestTypeId: project.tmpRequestTypeId || "87",
        tmpQueueId: project.tmpQueueId || "82",
        queueId: project.queueId || "",
      })
    } else {
      // Reset form for create mode
      setFormData({
        domainId: "",
        areaId: "",
        serviceDeskId: "",
        requestTypeId: "",
        name: "",
        language: "",
        tmpSourceSystem: "jira",
        tmpServiceDeskId: "TEM",
        tmpRequestTypeId: "87",
        tmpQueueId: "82",
        queueId: "",
      })
    }
  }, [project, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = project ? await updateProject(project.id, formData) : await createProject(formData)

      if (result) {
        onOpenChange(false)
      } else {
        alert("An error occurred")
      }
    } catch (error) {
      alert("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Create Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {" "}
          {/* Changed to space-y-4 */}
          <div className="grid grid-cols-2 gap-4">
            {" "}
            {/* Consolidated all fields into one grid */}
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
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
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
              <Label htmlFor="areaId">Area ID *</Label>
              <Input
                id="areaId"
                value={formData.areaId}
                onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tmpSourceSystem">Template Source System</Label>
              <Input
                id="tmpSourceSystem"
                value={formData.tmpSourceSystem}
                onChange={(e) => setFormData({ ...formData, tmpSourceSystem: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tmpServiceDeskId">Template Service Desk ID</Label>
              <Input
                id="tmpServiceDeskId"
                value={formData.tmpServiceDeskId}
                onChange={(e) => setFormData({ ...formData, tmpServiceDeskId: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tmpRequestTypeId">Template Request Type ID</Label>
              <Input
                id="tmpRequestTypeId"
                value={formData.tmpRequestTypeId}
                onChange={(e) => setFormData({ ...formData, tmpRequestTypeId: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tmpQueueId">Template Queue ID</Label>
              <Input
                id="tmpQueueId"
                value={formData.tmpQueueId}
                onChange={(e) => setFormData({ ...formData, tmpQueueId: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceDeskId">Service Desk ID *</Label>
              <Input
                id="serviceDeskId"
                value={formData.serviceDeskId}
                onChange={(e) => setFormData({ ...formData, serviceDeskId: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestTypeId">Request Type ID *</Label>
              <Input
                id="requestTypeId"
                value={formData.requestTypeId}
                onChange={(e) => setFormData({ ...formData, requestTypeId: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="queueId">Queue ID</Label>
              <Input
                id="queueId"
                value={formData.queueId}
                onChange={(e) => setFormData({ ...formData, queueId: e.target.value })}
                disabled={isLoading}
              />
            </div>
            
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (project ? "Updating..." : "Creating...") : project ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
