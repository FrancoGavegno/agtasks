"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { apiClient } from "@/lib/integrations/amplify"
import type { Schema } from "@/amplify/data/resource"

type Task = Schema["Task"]["type"]
type Project = Schema["Project"]["type"]
type Service = Schema["Service"]["type"]

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
  projects: Project[]
  services: Service[] // All services are passed here
}

export function TaskDialog({ open, onOpenChange, task, projects, services }: TaskDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    taskName: "",
    taskType: "",
    userEmail: "",
    projectId: "",
    serviceId: "",
    tmpSubtaskId: "",
    subtaskId: "",
    taskData: "",
    formId: "",
    deleted: false
  })
  const [filteredServices, setFilteredServices] = useState<Service[]>([])

  // Auto-populate form when editing or reset for creating
  useEffect(() => {
    if (task) {
      setFormData({
        taskName: task.taskName || "",
        taskType: task.taskType || "",
        userEmail: task.userEmail || "",
        projectId: task.projectId || "",
        serviceId: task.serviceId || "",
        tmpSubtaskId: task.tmpSubtaskId || "",
        subtaskId: task.subtaskId || "",
        taskData: task.taskData ? JSON.stringify(task.taskData, null, 2) : "",
        formId: task.formId || "",
        deleted: false
      })
    } else {
      // Reset form for create mode
      setFormData({
        taskName: "",
        taskType: "",
        userEmail: "",
        projectId: "",
        serviceId: "",
        tmpSubtaskId: "",
        subtaskId: "",
        taskData: "",
        formId: "",
        deleted: false
      })
    }
  }, [task, open])

  // Filter services based on selected project
  useEffect(() => {
    if (formData.projectId && formData.projectId !== "none") {
      const servicesForProject = services.filter((service) => service.projectId === formData.projectId)
      setFilteredServices(servicesForProject)

      // If current serviceId is not valid for the new project, reset it
      if (formData.serviceId && !servicesForProject.some((s) => s.id === formData.serviceId)) {
        setFormData((prev) => ({ ...prev, serviceId: "" }))
      }
    } else {
      setFilteredServices([])
      setFormData((prev) => ({ ...prev, serviceId: "" })) // Reset service if no project selected
    }
  }, [formData.projectId, services])

  const handleProjectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      projectId: value === "none" ? "" : value, // Store empty string if "No Project"
      serviceId: "", // Reset service when project changes
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let parsedTaskData = null
      if (formData.taskData.trim()) {
        try {
          parsedTaskData = JSON.parse(formData.taskData)
        } catch (error) {
          alert("Invalid JSON in Task Data field")
          setIsLoading(false)
          return
        }
      }

      const submitData = {
        ...formData,
        taskData: parsedTaskData,
        projectId: formData.projectId === "" ? undefined : formData.projectId, // Send undefined if empty
        serviceId: formData.serviceId === "" ? undefined : formData.serviceId, // Send undefined if empty
      }

      const result = task ? await apiClient.updateTask(task.id, submitData) : await apiClient.createTask(submitData)

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taskName">Task Name *</Label>
              <Input
                id="taskName"
                value={formData.taskName}
                onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskType">Task Type</Label>
              <Input
                id="taskType"
                value={formData.taskType}
                onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tmpSubtaskId">Template Subtask ID *</Label>
              <Input
                id="tmpSubtaskId"
                value={formData.tmpSubtaskId}
                onChange={(e) => setFormData({ ...formData, tmpSubtaskId: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtaskId">Subtask ID</Label>
              <Input
                id="subtaskId"
                value={formData.subtaskId}
                onChange={(e) => setFormData({ ...formData, subtaskId: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectId">Project</Label>
              <Select
                value={formData.projectId || "none"} // Use "none" for empty state
                onValueChange={handleProjectChange}
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
              <Label htmlFor="serviceId">Service</Label>
              <Select
                value={formData.serviceId || "none"} // Use "none" for empty state
                onValueChange={(value) => setFormData({ ...formData, serviceId: value === "none" ? "" : value })}
                disabled={isLoading || !formData.projectId || filteredServices.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Service</SelectItem>
                  {filteredServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
              <Label htmlFor="userEmail">User Email *</Label>
              <Input
                id="userEmail"
                type="email"
                value={formData.userEmail}
                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
          <div className="space-y-2">
            <Label htmlFor="formId">Form ID</Label>
            <Input
              id="formId"
              value={formData.formId}
              onChange={(e) => setFormData({ ...formData, formId: e.target.value })}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taskData">Task Data (JSON)</Label>
            <Textarea
              id="taskData"
              value={formData.taskData}
              onChange={(e) => setFormData({ ...formData, taskData: e.target.value })}
              placeholder='{"key": "value"}'
              rows={4}
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (task ? "Updating..." : "Creating...") : task ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
