"use client"

import { Textarea } from "@/components/ui/textarea"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, PaperclipIcon } from "lucide-react"

interface AdvancedOptionsProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function AdvancedOptions({ formData, updateFormData }: AdvancedOptionsProps) {
  const [newTag, setNewTag] = useState("")

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateFormData({ tags: [...formData.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    updateFormData({ tags: formData.tags.filter((t: string) => t !== tag) })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault()
      handleAddTag()
    }
  }

  const simulateFileUpload = () => {
    // Simulate file upload
    const newFile = {
      name: "Task_Document.pdf",
      size: "1.2 MB",
    }
    updateFormData({ attachments: [...formData.attachments, newFile] })
  }

  const removeAttachment = (index: number) => {
    const newAttachments = [...formData.attachments]
    newAttachments.splice(index, 1)
    updateFormData({ attachments: newAttachments })
  }

  const toggleDependency = (taskId: string) => {
    if (formData.dependencies.includes(taskId)) {
      updateFormData({
        dependencies: formData.dependencies.filter((id: string) => id !== taskId),
      })
    } else {
      updateFormData({
        dependencies: [...formData.dependencies, taskId],
      })
    }
  }

  // Sample tasks for dependencies
  const sampleTasks = [
    { id: "task-1", title: "Review soil analysis report" },
    { id: "task-2", title: "Create seeding prescription map" },
    { id: "task-3", title: "Calibrate seeding equipment" },
    { id: "task-4", title: "Field preparation" },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tags & Categorization</CardTitle>
          <CardDescription>Add tags to help organize and find this task later</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add tags and press Enter"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated-hours">Estimated Hours</Label>
            <Input
              id="estimated-hours"
              type="number"
              placeholder="Enter estimated hours"
              min="0"
              step="0.5"
              value={formData.estimatedHours}
              onChange={(e) => updateFormData({ estimatedHours: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dependencies">Dependencies</Label>
            <Select>
              <SelectTrigger id="dependencies">
                <SelectValue placeholder="Select dependent tasks" />
              </SelectTrigger>
              <SelectContent>
                {sampleTasks.map((task) => (
                  <SelectItem key={task.id} value={task.id} onSelect={() => toggleDependency(task.id)}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This task will only become active after the selected tasks are completed
            </p>
            {formData.dependencies.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Selected dependencies:</p>
                <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1">
                  {formData.dependencies.map((depId: string) => {
                    const task = sampleTasks.find((t) => t.id === depId)
                    return task ? <li key={depId}>{task.title}</li> : null
                  })}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attachments & Documents</CardTitle>
          <CardDescription>Add relevant files and documents to this task</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={simulateFileUpload}
          >
            <p className="text-sm text-muted-foreground">Click to upload files or drag and drop</p>
          </div>

          {formData.attachments.length > 0 && (
            <div className="space-y-2 mt-2">
              {formData.attachments.map((file: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeAttachment(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 mt-4">
            <Label>Additional Notes</Label>
            <Textarea placeholder="Any other information that might be helpful..." rows={4} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

