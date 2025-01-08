"use client"

import * as React from "react"
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { format } from "date-fns"
import { Check, ChevronDown, MoreHorizontal, Search } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

type Priority = "urgent" | "high" | "normal" | "low"
type Status = "todo" | "in-progress" | "review" | "done"
type TaskType = "tillage" | "field-visit" | "regular-task"
type Farm = "ds-bossio" | "ds-local" | "ds-local-kmz"
type FieldList = "lote-1b" | "lote-2b" | "lote-3b"
type CollectForm = "crop-monitoring" | "field-survey" | ""

interface Task {
    id: string
    name: string
    priority: Priority
    status: Status
    dueDate: Date
    scope: string
    taskType: TaskType
    farm: Farm
    fieldList: FieldList
    collectForm: CollectForm
}

const priorities: { label: string; value: Priority; color: string }[] = [
    { label: "Urgent", value: "urgent", color: "destructive" },
    { label: "High", value: "high", color: "destructive" },
    { label: "Normal", value: "normal", color: "default" },
    { label: "Low", value: "low", color: "secondary" },
]

const statuses: { label: string; value: Status }[] = [
    { label: "To Do", value: "todo" },
    { label: "In Progress", value: "in-progress" },
    { label: "Review", value: "review" },
    { label: "Done", value: "done" },
]

const taskTypes: { label: string; value: TaskType }[] = [
    { label: "Laboreo", value: "tillage" },
    { label: "Recorrida", value: "field-visit" },
    { label: "Tarea", value: "regular-task" },
]

const farms: { label: string; value: Farm }[] = [
    { label: "DS_Bossio", value: "ds-bossio" },
    { label: "DS_Local", value: "ds-local" },
    { label: "DS_Local_KMZ", value: "ds-local-kmz" },
]

const fieldLists: { label: string; value: FieldList }[] = [
    { label: "Lote 1B", value: "lote-1b" },
    { label: "Lote 2B", value: "lote-2b" },
    { label: "Lote 3B", value: "lote-3b" },
]

const collectForms: { label: string; value: CollectForm }[] = [
    { label: "Crop Monitoring", value: "crop-monitoring" },
    { label: "Field Survey", value: "field-survey" },
]

// Mock data
const tasks: Task[] = [
    {
        id: "TASK-8782",
        name: "Generar reporte de mapa de productividad",
        priority: "high",
        status: "in-progress",
        dueDate: new Date(2024, 1, 15),
        scope: "fgavegno@geoagro.com",
        taskType: "regular-task",
        farm: "ds-bossio",
        fieldList: "lote-3b",
        collectForm: "",
    },
    {
        id: "TASK-7878",
        name: "Validar MP con recorrida a campo",
        priority: "high",
        status: "todo",
        dueDate: new Date(2024, 1, 20),
        scope: "fgavegno@geoagro.com",
        taskType: "field-visit",
        farm: "ds-local",
        fieldList: "lote-3b",
        collectForm: "crop-monitoring",
    },
    {
        id: "TASK-7839",
        name: "Generar reporte de recorrida a campo",
        priority: "normal",
        status: "review",
        dueDate: new Date(2024, 1, 25),
        scope: "fgavegno@geoagro.com",
        taskType: "regular-task",
        farm: "ds-local-kmz",
        fieldList: "lote-3b",
        collectForm: "",
    },
    {
        id: "TASK-9939",
        name: "Generar mapa de productividad",
        priority: "low",
        status: "review",
        dueDate: new Date(2024, 1, 25),
        scope: "fgavegno@geoagro.com",
        taskType: "regular-task",
        farm: "ds-local-kmz",
        fieldList: "lote-3b",
        collectForm: "",
    },
]

export default function TaskList() {
    const t = useTranslations('TasksPage');

    const [search, setSearch] = React.useState("")
    const [selectedStatus, setSelectedStatus] = React.useState<Status | "">("")
    const [selectedPriority, setSelectedPriority] = React.useState<Priority | "">("")

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.name.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = selectedStatus ? task.status === selectedStatus : true
        const matchesPriority = selectedPriority ? task.priority === selectedPriority : true
        return matchesSearch && matchesStatus && matchesPriority
    })

    const getPriorityBadge = (priority: Priority) => {
        const priorityConfig = priorities.find((p) => p.value === priority)
        return (
            <Badge variant={priorityConfig?.color as any}>
                {priorityConfig?.label}
            </Badge>
        )
    }

    const getStatusIcon = (status: Status) => {
        switch (status) {
            case "todo":
                return "○"
            case "in-progress":
                return "◔"
            case "review":
                return "◕"
            case "done":
                return "●"
            default:
                return "○"
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Ambientación con mapa de productividad (DEMO)</CardTitle>
                <CardDescription>
                    View and manage your project tasks
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-[100px]">
                                Status <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedStatus("")}>
                                All
                            </DropdownMenuItem>
                            {statuses.map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status.value}
                                    checked={selectedStatus === status.value}
                                    onCheckedChange={() => setSelectedStatus(status.value)}
                                >
                                    {status.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-[100px]">
                                Priority <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedPriority("")}>
                                All
                            </DropdownMenuItem>
                            {priorities.map((priority) => (
                                <DropdownMenuCheckboxItem
                                    key={priority.value}
                                    checked={selectedPriority === priority.value}
                                    onCheckedChange={() => setSelectedPriority(priority.value)}
                                >
                                    {priority.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30px]">
                                    <Checkbox />
                                </TableHead>
                                <TableHead>Task</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Assignee</TableHead>
                                <TableHead>Farm</TableHead>
                                <TableHead>Field List</TableHead>
                                <TableHead>Collect Form</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{task.id}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {task.name}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {taskTypes.find((t) => t.value === task.taskType)?.label}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open status menu</span>
                                                    {getStatusIcon(task.status)}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {statuses.map((status) => (
                                                    <DropdownMenuItem key={status.value}>
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                task.status === status.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {status.label}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                                    <TableCell>{format(task.dueDate, "MMM dd, yyyy")}</TableCell>
                                    <TableCell>{task.scope}</TableCell>
                                    
                                    <TableCell>
                                        {farms.find((f) => f.value === task.farm)?.label}
                                    </TableCell>
                                    <TableCell>
                                        {fieldLists.find((f) => f.value === task.fieldList)?.label}
                                    </TableCell>
                                    <TableCell className="underline text-blue-500">
                                        <Link href="https://ee.kobotoolbox.org/x/gY0GIPKm" target="_blank">
                                            {collectForms.find((f) => f.value === task.collectForm)?.label}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Link href="/projects/1/tasks/1/collect-form">
                                                        {t("ddCollectForm")}
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link href="/projects/1/tasks/1/edit">
                                                        {t("ddEdit")}
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    {t("ddDelete")}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

