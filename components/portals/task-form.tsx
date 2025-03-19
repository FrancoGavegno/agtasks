"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (task: any) => void
}

export function TaskForm({ open, onOpenChange, onSubmit }: TaskFormProps) {
  const [taskTitle, setTaskTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date>()
  const [priority, setPriority] = useState<string>("")
  const [status, setStatus] = useState<string>("todo")
  const [selectedAssignee, setSelectedAssignee] = useState<string>("")
  const [selectedService, setSelectedService] = useState<string>("")
  const [isServiceTask, setIsServiceTask] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [attachments, setAttachments] = useState<{ name: string; size: string }[]>([])

  // Sample data for services and team members
  const services = [
    { id: "1", name: "Variable Seeding - North Field" },
    { id: "2", name: "Precision Irrigation - East Field" },
    { id: "3", name: "Variable Fertilization - South Field" },
    { id: "4", name: "Soil Analysis - West Field" },
    { id: "5", name: "Harvest Monitoring - Central Field" },
  ]

  const teamMembers = [
    { id: "1", name: "Maria Rodriguez", role: "Technical Lead", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "2", name: "John Smith", role: "Project Owner", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "3", name: "Carlos Mendez", role: "Field Operator", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "4", name: "Sarah Johnson", role: "Data Analyst", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "5", name: "Miguel Torres", role: "Equipment Provider", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "6", name: "Laura Chen", role: "Soil Scientist", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "7", name: "David Wilson", role: "Irrigation Specialist", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  const handleSubmit = () => {
    // Create task object
    const task = {
      title: taskTitle,
      description,
      dueDate,
      priority,
      status,
      assigneeId: selectedAssignee,
      serviceId: isServiceTask ? selectedService : null,
      tags,
      attachments,
    }

    // Call onSubmit callback if provided
    if (onSubmit) {
      onSubmit(task)
    }

    // Reset form
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setTaskTitle("")
    setDescription("")
    setDueDate(undefined)
    setPriority("")
    setStatus("todo")
    setSelectedAssignee("")
    setSelectedService("")
    setIsServiceTask(false)
    setTags([])
    setNewTag("")
    setAttachments([])
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
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
    setAttachments([...attachments, newFile])
  }

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments]
    newAttachments.splice(index, 1)
    setAttachments(newAttachments)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to track work that needs to be completed.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Task Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the task in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="due-date">
                  Due Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">
                  Priority <span className="text-destructive">*</span>
                </Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignee">
                  Assignee <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                  <SelectTrigger id="assignee">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {member.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-service-task"
                  checked={isServiceTask}
                  onCheckedChange={(checked) => setIsServiceTask(checked as boolean)}
                />
                <Label htmlFor="is-service-task">This task is related to a service</Label>
              </div>
            </div>

            {isServiceTask && (
              <div className="space-y-2">
                <Label htmlFor="service">
                  Service <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 pt-4">
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
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Attachments</Label>
              <div
                className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={simulateFileUpload}
              >
                <p className="text-sm text-muted-foreground">Click to upload files or drag and drop</p>
              </div>
              {attachments.length > 0 && (
                <div className="space-y-2 mt-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated-hours">Estimated Hours</Label>
              <Input id="estimated-hours" type="number" placeholder="Enter estimated hours" min="0" step="0.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dependencies">Dependencies</Label>
              <Select>
                <SelectTrigger id="dependencies">
                  <SelectValue placeholder="Select dependent tasks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task-1">Review soil analysis report</SelectItem>
                  <SelectItem value="task-2">Create seeding prescription map</SelectItem>
                  <SelectItem value="task-3">Calibrate seeding equipment</SelectItem>
                  <SelectItem value="task-4">Field preparation</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This task will only become active after the selected tasks are completed
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!taskTitle || !dueDate || !priority || !selectedAssignee || (isServiceTask && !selectedService)}
          >
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

