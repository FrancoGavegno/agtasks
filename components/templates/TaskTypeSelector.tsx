"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown } from 'lucide-react';
import { FormType, TaskType } from "@/lib/interfaces";
import { taskTypes } from "@/utils/mockData";

const allColumns = [
  { key: "taskId", title: "ID" },
  { key: "taskName", title: "Task Name" },
  { key: "description", title: "Description" },
  { key: "documentation", title: "Documentation" },
]

interface TaskTypeSelectorProps {
  formType: FormType;
  onSelect: (tasks: any[]) => void;
}

export default function TaskSelector({ formType, onSelect }: TaskTypeSelectorProps) {
  const [selectedTasks, setSelectedTasks] = useState<TaskType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleColumns, setVisibleColumns] = useState(["taskName", "description"])
  const [allTasks, setAllTasks] = useState(taskTypes)
  const [newTask, setNewTask] = useState({
    taskId: "",
    taskName: "",
    description: "",
    documentation: ""
  })

  const filteredTasks = allTasks.filter((task) =>
    task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTaskToggle = (task: TaskType) => {
    setSelectedTasks((prev: TaskType[]) => {
      const newSelection = prev.some((t) => t.taskId === task.taskId)
        ? prev.filter((t) => t.taskId !== task.taskId)
        : [...prev, task]
      onSelect(newSelection)
      return newSelection
    })
  }

  const handleSelectAll = (checked: boolean) => {
    const newSelection: TaskType[] = checked ? filteredTasks : []
    setSelectedTasks(newSelection)
    onSelect(newSelection)
  }

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newTask.taskId.trim() && newTask.taskName.trim()) {
      setAllTasks(prev => [...prev, { ...newTask }])
      setNewTask({
        taskId: "",
        taskName: "",
        description: "",
        documentation: ""
      })
    }
  }

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns((prev: string[]) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey]
    )
  }

  return (
    <div className="space-y-2">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Tasks Type Selection for {formType.title}</h2>
        <p className="text-sm text-muted-foreground">
          Step 2
        </p>
      </div>

      <Card className="pt-4">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              id="search-tasks"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {allColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={visibleColumns.includes(column.key)}
                    onCheckedChange={() => toggleColumn(column.key)}
                  >
                    {column.title}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ScrollArea className="h-[300px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        filteredTasks.length > 0 &&
                        filteredTasks.every((task) =>
                          selectedTasks.some((t) => t.taskId === task.taskId)
                        )
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  {visibleColumns.map((columnKey) => (
                    <TableHead key={columnKey}>
                      {allColumns.find((col) => col.key === columnKey)?.title}
                    </TableHead>
                  ))}
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.taskId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTasks.some((t) => t.taskId === task.taskId)}
                        onCheckedChange={() => handleTaskToggle(task)}
                      />
                    </TableCell>
                    {visibleColumns.map((columnKey) => (
                      <TableCell key={columnKey}>{(task as any)[columnKey]}</TableCell>
                    ))}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {task.documentation && (
                            <DropdownMenuCheckboxItem
                              onSelect={() => window.open(task.documentation, '_blank')}
                            > View Documentation
                            </DropdownMenuCheckboxItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          <div className="text-sm text-muted-foreground">
            {selectedTasks.length} of {filteredTasks.length} task(s) selected
          </div>

          {/* <Card>
            <CardHeader>
              <CardTitle className="text-sm">Add New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taskId">ID</Label>
                    <Input
                      id="taskId"
                      value={newTask.taskId}
                      onChange={(e) => setNewTask(prev => ({ ...prev, taskId: e.target.value }))}
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taskName">Task Name</Label>
                    <Input
                      id="taskName"
                      value={newTask.taskName}
                      onChange={(e) => setNewTask(prev => ({ ...prev, taskName: e.target.value }))}
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      placeholder=""
                      className=""
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentation">Documentation</Label>
                    <Input
                      id="documentation"
                      value={newTask.documentation}
                      onChange={(e) => setNewTask(prev => ({ ...prev, documentation: e.target.value }))}
                      placeholder=""
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Add Task
                </Button>
              </form>
            </CardContent>
          </Card> */}

        </CardContent>
      </Card>

      <div className="space-y-2 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Fields Selection</h2>
          <p className="text-sm text-muted-foreground">
            Step 3
          </p>
        </div>
      </div>

    </div>
  )
}

