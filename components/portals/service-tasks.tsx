"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assignee: {
    id: string
    name: string
    avatar: string
  }
}

export function ServiceTasks() {
  // Sample tasks data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Review soil analysis report",
      description: "Analyze soil sample results and identify zones for variable seeding rates",
      dueDate: "2025-02-20",
      status: "completed",
      priority: "high",
      assignee: {
        id: "1",
        name: "Maria Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "2",
      title: "Create seeding prescription map",
      description: "Generate variable rate seeding prescription map based on soil analysis",
      dueDate: "2025-02-25",
      status: "completed",
      priority: "high",
      assignee: {
        id: "4",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "3",
      title: "Calibrate seeding equipment",
      description: "Ensure seeding equipment is properly calibrated for variable rate application",
      dueDate: "2025-03-05",
      status: "in-progress",
      priority: "medium",
      assignee: {
        id: "3",
        name: "Carlos Mendez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "4",
      title: "Field preparation",
      description: "Prepare field for seeding according to the plan",
      dueDate: "2025-03-10",
      status: "in-progress",
      priority: "medium",
      assignee: {
        id: "2",
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "5",
      title: "Execute variable seeding",
      description: "Implement variable seeding according to prescription map",
      dueDate: "2025-03-20",
      status: "todo",
      priority: "high",
      assignee: {
        id: "3",
        name: "Carlos Mendez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "6",
      title: "Post-seeding field inspection",
      description: "Inspect field after seeding to ensure proper implementation",
      dueDate: "2025-03-25",
      status: "todo",
      priority: "medium",
      assignee: {
        id: "1",
        name: "Maria Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "7",
      title: "Document seeding rates and coverage",
      description: "Record actual seeding rates and coverage for future reference",
      dueDate: "2025-03-30",
      status: "todo",
      priority: "low",
      assignee: {
        id: "4",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const toggleTaskStatus = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === "completed" ? "todo" : "completed"
          return { ...task, status: newStatus }
        }
        return task
      }),
    )
  }

  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tasks</h2>
          <p className="text-sm text-muted-foreground">Manage and track tasks for this service</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
            <CardDescription>{todoTasks.length} tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todoTasks.map((task) => (
              <div key={task.id} className="rounded-md border p-3 shadow-sm">
                <div className="flex items-start gap-2">
                  <Checkbox id={`task-${task.id}`} className="mt-1" onCheckedChange={() => toggleTaskStatus(task.id)} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor={`task-${task.id}`} className="font-medium cursor-pointer">
                        {task.title}
                      </label>
                      <Badge variant={getPriorityColor(task.priority) as any}>{task.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        <span>Due {formatDate(task.dueDate)}</span>
                      </div>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback>
                          {task.assignee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <CardDescription>{inProgressTasks.length} tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {inProgressTasks.map((task) => (
              <div key={task.id} className="rounded-md border p-3 shadow-sm">
                <div className="flex items-start gap-2">
                  <Checkbox id={`task-${task.id}`} className="mt-1" onCheckedChange={() => toggleTaskStatus(task.id)} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor={`task-${task.id}`} className="font-medium cursor-pointer">
                        {task.title}
                      </label>
                      <Badge variant={getPriorityColor(task.priority) as any}>{task.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        <span>Due {formatDate(task.dueDate)}</span>
                      </div>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback>
                          {task.assignee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CardDescription>{completedTasks.length} tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedTasks.map((task) => (
              <div key={task.id} className="rounded-md border p-3 shadow-sm bg-muted/50">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id={`task-${task.id}`}
                    className="mt-1"
                    checked={true}
                    onCheckedChange={() => toggleTaskStatus(task.id)}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={`task-${task.id}`}
                        className="font-medium cursor-pointer line-through text-muted-foreground"
                      >
                        {task.title}
                      </label>
                      <Badge variant={getPriorityColor(task.priority) as any}>{task.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        <span>Due {formatDate(task.dueDate)}</span>
                      </div>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback>
                          {task.assignee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

