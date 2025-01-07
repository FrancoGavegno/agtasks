"use client"

import * as React from "react"

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon, DotsHorizontalIcon, EyeNoneIcon } from "@radix-ui/react-icons"
import { Bug, LaptopMinimalCheck, Tractor, Smartphone, CheckCircle2, Circle, Clock, FileCode2, HelpCircle, Layout, MoreHorizontal } from 'lucide-react'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
//import { useToast } from "@/components/ui/use-toast"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface Task {
  id: string
  title: string
  type: "task" | "field_visit" | "tillage"
  form: string
  status: "todo" | "in_progress" | "done" | "backlog" | "canceled"
  priority: "low" | "medium" | "high"
  selected?: boolean
}

const tasks: Task[] = [
  {
    id: "TASK-8782",
    title: "You can't compress the program without quantifying the open-source SSD",
    type: "tillage",
    form: "",
    status: "in_progress",
    priority: "medium",
  },
  {
    id: "TASK-7878",
    title: "Try to calculate the EXE feed, maybe it will index the multi-byte pixel",
    type: "field_visit",
    form: "Field Survey 2024",
    status: "in_progress",
    priority: "medium",
  },
  {
    id: "TASK-7839",
    title: "We need to bypass the neural TCP card",
    type: "task",
    form: "",
    status: "todo",
    priority: "high",
  },
  {
    id: "TASK-5562",
    title: "The SAS interface is down, bypass the open-source pixel so we can back",
    type: "field_visit",
    form: "",
    status: "canceled",
    priority: "medium",
  },
  {
    id: "TASK-8686",
    title: "I'll parse the wireless SSL protocol, that should driver the API panel",
    type: "field_visit",
    form: "Crop Monitoring",
    status: "todo",
    priority: "medium",
  },
]

export function TaskList() {
  const t = useTranslations('TasksPage');

  const [selectedTasks, setSelectedTasks] = React.useState<Task[]>(tasks)
  const { toast } = useToast()

  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSelectedTasks(currentTasks =>
        currentTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      )

      toast({
        title: "Status updated",
        description: "Task status has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive",
      })
    }
  }

  const getTypeIcon = (type: Task["type"]) => {
    switch (type) {
      case "task":
        return <LaptopMinimalCheck className="h-4 w-4 text-blue-500" />
      case "field_visit":
        return <Smartphone className="h-4 w-4 text-yellow-500" />
      case "tillage":
        return <Tractor className="h-4 w-4 text-green-500" />
    }
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "todo":
        return <Circle className="h-4 w-4 text-slate-500" />
      case "canceled":
        return <EyeNoneIcon className="h-4 w-4 text-red-500" />
      default:
        return <HelpCircle className="h-4 w-4 text-slate-500" />
    }
  }

  return (
    <div className="container px-1 py-10 mx-auto">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/projects">Projects</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Ambientación con Mapa de Productividad</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold">Ambientación con Mapa de Productividad</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Card className="w-full">
          <div className="flex items-center justify-between space-x-2 p-4">
            <div className="flex flex-1 items-center space-x-2">
              <Input
                placeholder={t("filterPlaceholder")}
                className="h-8 w-[150px] lg:w-[250px]"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <CaretSortIcon className="mr-2 h-4 w-4" />
                    {t("statusSearch")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Todo</DropdownMenuItem>
                  <DropdownMenuItem>In Progress</DropdownMenuItem>
                  <DropdownMenuItem>Done</DropdownMenuItem>
                  <DropdownMenuItem>Canceled</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <CaretSortIcon className="mr-2 h-4 w-4" />
                    {t("prioritySearch")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <ArrowUpIcon className="mr-2 h-4 w-4 text-red-500" />
                    High
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CaretSortIcon className="mr-2 h-4 w-4 text-yellow-500" />
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArrowDownIcon className="mr-2 h-4 w-4 text-green-500" />
                    Low
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* <Button size="sm" className="h-8 border-dashed">
              <DotsHorizontalIcon className="h-4 w-4" />  
              <Link href="/projects/1/tasks/create">Create</Link>
            </Button>*/}
          </div>
          <div className="border-t">
            <div className="relative w-full">
              <div className="divide-y">
                <div className="sticky top-0 bg-background px-4 py-2">
                  <div className="flex items-center gap-6">
                    <Checkbox />
                    <div className="flex-1 text-sm font-medium">{t("colTask")}</div>
                    <div className="flex items-center gap-4">
                      <div className="w-[120px] text-sm font-medium">{t("colStatus")}</div>
                      <div className="w-[90px] text-sm font-medium">{t("colPriority")}</div>
                      <div className="w-[90px] text-sm font-medium">{t("colKoboForm")}</div>

                      <div className="w-8" />
                    </div>
                  </div>
                </div>
                {selectedTasks.map((task) => (
                  <div key={task.id} className="px-4 py-2">
                    <div className="flex items-center gap-6">
                      <Checkbox checked={task.selected} />
                      <div className="flex flex-1 items-center gap-2">
                        {getTypeIcon(task.type)}
                        <span className="text-sm font-medium">{task.id}</span>
                        <span className="text-sm text-muted-foreground">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-4">

                        <Select
                          value={task.status}
                          onValueChange={(value: Task["status"]) =>
                            handleStatusChange(task.id, value)
                          }
                        >
                          <SelectTrigger className="h-8 w-[120px] flex items-center gap-2">
                            {getStatusIcon(task.status)}
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todo">Todo</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                            <SelectItem value="canceled">Canceled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Badge
                          variant={task.priority === "high" ? "destructive" : "secondary"}
                          className="w-[90px] justify-center"
                        >
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>

                        <div className="w-[90px] text-sm underline text-blue-500">
                          <Link href="/projects/1/tasks/1/kobo-form">{task.form}</Link>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("dropdownLabel")}</DropdownMenuLabel>
                            <DropdownMenuItem><Link href="/projects/1/tasks/1/edit">{t("dropdownEdit")}</Link></DropdownMenuItem>
                            <DropdownMenuItem><Link href="/projects/1/tasks/1/kobo-form">{t("dropdownKobo")}</Link></DropdownMenuItem>
                            {/* <DropdownMenuItem>Make a copy</DropdownMenuItem>
                            <DropdownMenuItem>Favorite</DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              {t("dropdownDelete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

