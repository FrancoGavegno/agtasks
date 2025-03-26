"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, ChevronDown, Filter, Grid, List, Plus, Search, SlidersHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { TasksKanbanView } from "./tasks-kanban-view"
import { TasksListView } from "./tasks-list-view"
import { TasksGanttView } from "./tasks-gantt-view"
import { TasksCalendarView } from "./tasks-calendar-view"

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
  serviceId: string | null
  serviceName: string | null
}

export function ServiceTasks() {
  const [viewType, setViewType] = useState<"kanban" | "list" | "gantt" | "calendar">("kanban")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Sample tasks data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Review soil analysis report",
      description: "Analyze soil sample results and identify zones for variable seeding rates",
      dueDate: "2025-02-20",
      status: "completed",
      priority: "high",
      serviceId: "1",
      serviceName: "Variable Seeding - North Field",
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
      serviceId: "1",
      serviceName: "Variable Seeding - North Field",
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
      serviceId: "1",
      serviceName: "Variable Seeding - North Field",
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
      serviceId: "1",
      serviceName: "Variable Seeding - North Field",
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
      serviceId: "1",
      serviceName: "Variable Seeding - North Field",
      assignee: {
        id: "3",
        name: "Carlos Mendez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    // Ad-hoc tasks (not related to any service)
    {
      id: "8",
      title: "Equipment maintenance",
      description: "Perform regular maintenance on all field equipment",
      dueDate: "2025-03-15",
      status: "todo",
      priority: "medium",
      serviceId: null,
      serviceName: null,
      assignee: {
        id: "5",
        name: "Miguel Torres",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "9",
      title: "Team training session",
      description: "Conduct training on new precision agriculture software",
      dueDate: "2025-03-08",
      status: "todo",
      priority: "high",
      serviceId: null,
      serviceName: null,
      assignee: {
        id: "1",
        name: "Maria Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "10",
      title: "Update weather station",
      description: "Install firmware updates on all weather stations",
      dueDate: "2025-03-12",
      status: "in-progress",
      priority: "low",
      serviceId: null,
      serviceName: null,
      assignee: {
        id: "7",
        name: "David Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "11",
      title: "Quarterly equipment inventory",
      description: "Complete inventory of all precision agriculture equipment",
      dueDate: "2025-03-30",
      status: "todo",
      priority: "medium",
      serviceId: null,
      serviceName: null,
      assignee: {
        id: "5",
        name: "Miguel Torres",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "12",
      title: "Review irrigation system",
      description: "Check all irrigation systems for the upcoming season",
      dueDate: "2025-04-05",
      status: "todo",
      priority: "high",
      serviceId: null,
      serviceName: null,
      assignee: {
        id: "7",
        name: "David Wilson",
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-todo" defaultChecked />
                      <Label htmlFor="filter-todo">To Do</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-in-progress" defaultChecked />
                      <Label htmlFor="filter-in-progress">In Progress</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-completed" defaultChecked />
                      <Label htmlFor="filter-completed">Completed</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Priority</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-high" defaultChecked />
                      <Label htmlFor="filter-high">High</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-medium" defaultChecked />
                      <Label htmlFor="filter-medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-low" defaultChecked />
                      <Label htmlFor="filter-low">Low</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Task Type</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-service" defaultChecked />
                      <Label htmlFor="filter-service">Service Tasks</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-adhoc" defaultChecked />
                      <Label htmlFor="filter-adhoc">Ad-hoc Tasks</Label>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-between">
                  <Button variant="outline" size="sm">
                    Reset
                  </Button>
                  <Button size="sm">Apply</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="adhoc">Ad-hoc Tasks</SelectItem>
              <SelectItem value="service-1">Variable Seeding - North Field</SelectItem>
              <SelectItem value="service-2">Precision Irrigation - East Field</SelectItem>
              <SelectItem value="service-3">Variable Fertilization - South Field</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 w-full md:w-auto justify-between md:justify-start">
          <div className="flex border rounded-md p-1">
            <Button
              variant={viewType === "kanban" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setViewType("kanban")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewType === "list" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setViewType("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewType === "gantt" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setViewType("gantt")}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button
              variant={viewType === "calendar" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setViewType("calendar")}
            >
              <CalendarDays className="h-4 w-4" />
            </Button>
          </div>

          <Select defaultValue="assignee">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="assignee">Assignee</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="service">Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewType === "kanban" && <TasksKanbanView tasks={tasks} />}
      {viewType === "list" && <TasksListView tasks={tasks} />}
      {viewType === "gantt" && <TasksGanttView tasks={tasks} />}
      {viewType === "calendar" && <TasksCalendarView tasks={tasks} />}

      {/*<div className="grid gap-6 md:grid-cols-3">
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
      */}


    </div>
  )
}

