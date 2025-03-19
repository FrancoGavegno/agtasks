"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

interface TasksCalendarViewProps {
  tasks: Task[]
}

export function TasksCalendarView({ tasks }: TasksCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate)

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const today = new Date()
  const isToday = (day: number) => {
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  const getTasksForDay = (day: number) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return taskDate.getDate() === day && taskDate.getMonth() === month && taskDate.getFullYear() === year
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-blue-500"
      case "low":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const renderCalendarDays = () => {
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border p-1"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTasks = getTasksForDay(day)

      days.push(
        <div key={day} className={`h-24 border p-1 ${isToday(day) ? "bg-primary/10" : ""}`}>
          <div className="flex justify-between items-start">
            <span
              className={`text-sm font-medium ${isToday(day) ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center" : ""}`}
            >
              {day}
            </span>
          </div>
          <div className="mt-1 space-y-1 overflow-y-auto max-h-[70px]">
            {dayTasks.map((task) => (
              <div
                key={task.id}
                className="text-xs p-1 rounded truncate flex items-center gap-1"
                style={{ backgroundColor: task.status === "completed" ? "#e2e8f0" : "#f8fafc" }}
              >
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                <span className={task.status === "completed" ? "line-through text-muted-foreground" : ""}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>,
      )
    }

    return days
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {monthName} {year}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0">
          {weekdays.map((day) => (
            <div key={day} className="text-center font-medium p-2 border">
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </CardContent>
    </Card>
  )
}

