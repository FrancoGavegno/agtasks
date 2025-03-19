"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  CalendarDays,
  CheckSquare,
  ChevronDown,
  Clock,
  Filter,
  Grid,
  List,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react"
import { TasksKanbanView } from "@/components/portals/tasks-kanban-view"
import { TasksListView } from "@/components/portals/tasks-list-view"
import { TasksGanttView } from "@/components/portals/tasks-gantt-view"
import { TasksCalendarView } from "@/components/portals/tasks-calendar-view"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { TaskForm } from "@/components/portals/task-form"
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';


export default function TasksPage() {
  const [viewType, setViewType] = useState<"kanban" | "list" | "gantt" | "calendar">("kanban")
  const [searchQuery, setSearchQuery] = useState("")
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)

  // Sample metrics data
  const metrics = {
    activeTasks: 12,
    completedTasks: 8,
    upcomingDeadlines: 5,
    overdueTasks: 2,
  }

  // Sample task data - this would normally come from a database
  const allTasks = [
    // Service-related tasks
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
  ]

  const handleTaskSubmit = (task: any) => {
    console.log("New task created:", task)
    // Here you would typically save the task to your database
    // and then update the task list
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and track all tasks across your organization</p>
        </div>
        <div className="flex gap-2">
         {/*  <Button onClick={() => setIsTaskFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button> */}
          <Button asChild>
            <Link href="/portals/1/tasks/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeTasks}</div>
            <p className="text-xs text-muted-foreground">Across all services and ad-hoc</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedTasks}</div>
            <p className="text-xs text-muted-foreground">In the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground">Due in the next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{metrics.overdueTasks}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
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

      {viewType === "kanban" && <TasksKanbanView tasks={allTasks} />}
      {viewType === "list" && <TasksListView tasks={allTasks} />}
      {viewType === "gantt" && <TasksGanttView tasks={allTasks} />}
      {viewType === "calendar" && <TasksCalendarView tasks={allTasks} />}

      <TaskForm open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen} onSubmit={handleTaskSubmit} />
    </div>
  )
}

