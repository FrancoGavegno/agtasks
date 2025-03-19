"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  serviceId: string | null
  serviceName: string | null
  assignee: {
    id: string
    name: string
    avatar: string
  }
}

interface TasksKanbanViewProps {
  tasks: Task[]
}

export function TasksKanbanView({ tasks }: TasksKanbanViewProps) {
  const [taskList, setTaskList] = useState<Task[]>(tasks)

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
    setTaskList(
      taskList.map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === "completed" ? "todo" : "completed"
          return { ...task, status: newStatus }
        }
        return task
      }),
    )
  }

  const todoTasks = taskList.filter((task) => task.status === "todo")
  const inProgressTasks = taskList.filter((task) => task.status === "in-progress")
  const completedTasks = taskList.filter((task) => task.status === "completed")

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">To Do</CardTitle>
          <p className="text-xs text-muted-foreground">{todoTasks.length} tasks</p>
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

                  {task.serviceName && (
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-muted/50">
                        {task.serviceName}
                      </Badge>
                    </div>
                  )}

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
          <p className="text-xs text-muted-foreground">{inProgressTasks.length} tasks</p>
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

                  {task.serviceName && (
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-muted/50">
                        {task.serviceName}
                      </Badge>
                    </div>
                  )}

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
          <p className="text-xs text-muted-foreground">{completedTasks.length} tasks</p>
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

                  {task.serviceName && (
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-muted/50">
                        {task.serviceName}
                      </Badge>
                    </div>
                  )}

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
  )
}

