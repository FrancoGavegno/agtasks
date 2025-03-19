"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

interface TasksGanttViewProps {
  tasks: Task[]
}

export function TasksGanttView({ tasks }: TasksGanttViewProps) {
  // Sort tasks by due date
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  // Calculate date range for the gantt chart
  const today = new Date()
  const earliestDate = new Date(Math.min(...tasks.map((t) => new Date(t.dueDate).getTime())))
  const latestDate = new Date(Math.max(...tasks.map((t) => new Date(t.dueDate).getTime())))

  // Ensure we have at least 2 weeks range
  earliestDate.setDate(earliestDate.getDate() - 7)
  latestDate.setDate(latestDate.getDate() + 7)

  // Generate dates for the header
  const dateRange: Date[] = []
  const currentDate = new Date(earliestDate)
  while (currentDate <= latestDate) {
    dateRange.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "todo":
        return "bg-gray-300"
      default:
        return "bg-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500"
      case "medium":
        return "border-blue-500"
      case "low":
        return "border-gray-500"
      default:
        return "border-gray-500"
    }
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-[250px_1fr] border-b">
            <div className="p-4 font-medium border-r">Task</div>
            <div className="grid" style={{ gridTemplateColumns: `repeat(${dateRange.length}, minmax(40px, 1fr))` }}>
              {dateRange.map((date, index) => (
                <div
                  key={index}
                  className={`p-2 text-center text-xs border-r ${isToday(date) ? "bg-primary/10 font-medium" : ""}`}
                >
                  {formatDate(date)}
                </div>
              ))}
            </div>
          </div>

          {sortedTasks.map((task) => {
            const taskDate = new Date(task.dueDate)
            const taskPosition = dateRange.findIndex((date) => date.toDateString() === taskDate.toDateString())

            return (
              <div key={task.id} className="grid grid-cols-[250px_1fr] border-b hover:bg-muted/50">
                <div className="p-4 border-r">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">{task.title}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${getPriorityColor(task.priority)} border-l-4`}>
                        {task.priority}
                      </Badge>
                      {task.serviceName && (
                        <Badge variant="outline" className="bg-muted/50">
                          {task.serviceName}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback>
                          {task.assignee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
                    </div>
                  </div>
                </div>
                <div
                  className="grid relative"
                  style={{ gridTemplateColumns: `repeat(${dateRange.length}, minmax(40px, 1fr))` }}
                >
                  {dateRange.map((date, index) => (
                    <div key={index} className={`border-r h-full ${isToday(date) ? "bg-primary/10" : ""}`}></div>
                  ))}

                  {taskPosition >= 0 && (
                    <div
                      className={`absolute h-6 rounded-md ${getStatusColor(task.status)} flex items-center justify-center text-white text-xs font-medium`}
                      style={{
                        left: `calc(${taskPosition} * 100% / ${dateRange.length})`,
                        width: `calc(100% / ${dateRange.length})`,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      Due
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

