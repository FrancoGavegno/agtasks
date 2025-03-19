"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronDown, MoreHorizontal } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

interface TasksListViewProps {
  tasks: Task[]
}

export function TasksListView({ tasks }: TasksListViewProps) {
  const [taskList, setTaskList] = useState<Task[]>(tasks)
  const [expandedTasks, setExpandedTasks] = useState<string[]>([])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "todo":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
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

  const toggleExpandTask = (taskId: string) => {
    if (expandedTasks.includes(taskId)) {
      setExpandedTasks(expandedTasks.filter((id) => id !== taskId))
    } else {
      setExpandedTasks([...expandedTasks, taskId])
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taskList.map((task) => (
              <>
                <TableRow key={task.id} className="group">
                  <TableCell className="py-2">
                    <Checkbox checked={task.status === "completed"} onCheckedChange={() => toggleTaskStatus(task.id)} />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 rounded-full"
                        onClick={() => toggleExpandTask(task.id)}
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${expandedTasks.includes(task.id) ? "rotate-180" : ""}`}
                        />
                      </Button>
                      <span className={task.status === "completed" ? "line-through text-muted-foreground" : ""}>
                        {task.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(task.status)}`}></div>
                      <span className="capitalize">{task.status.replace("-", " ")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(task.priority) as any}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    {task.serviceName ? (
                      <Badge variant="outline" className="bg-muted/50">
                        {task.serviceName}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Ad-hoc</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3 text-muted-foreground" />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback>
                          {task.assignee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Reassign</DropdownMenuItem>
                        <DropdownMenuItem>Change Status</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {expandedTasks.includes(task.id) && (
                  <TableRow>
                    <TableCell colSpan={8} className="bg-muted/50 p-4">
                      <div className="text-sm">{task.description}</div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

