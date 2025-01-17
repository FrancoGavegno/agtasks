"use client"

import { useState, useCallback } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormTypeSelector from "./FormTypeSelector";
import TaskSelector from "./TaskTypeSelector";
import FieldTypeSelector from "./FieldTypeSelector";
import FormPreview from "./FormPreview";
import JsonOutput from "./JsonOutput";
import { FormType, TaskType, FieldType } from "@/lib/interfaces"

export default function TemplateBuilder() {
  const [selectedProject, setSelectedProject] = useState<FormType | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<TaskType[]>([])
  const [taskFields, setTaskFields] = useState<{ [key: string]: FieldType[] }>({})
  const [showJsonOutput, setShowJsonOutput] = useState(false)

  const handleProjectSelect = useCallback((project: FormType) => {
    setSelectedProject({ ...project, title: project.title })
    setSelectedProject(project)
    setSelectedTasks([])
    setTaskFields({})
  }, [])

  const handleTaskSelect = useCallback((tasks: TaskType[]) => {
    setSelectedTasks(tasks)
    setTaskFields(prev => {
      const newTaskFields: { [key: string]: FieldType[] } = {}
      tasks.forEach(task => {
        if (prev[task.taskId]) {
          newTaskFields[task.taskId] = prev[task.taskId]
        } else {
          newTaskFields[task.taskId] = []
        }
      })
      return newTaskFields
    })
  }, [])

  const handleFieldSelect = useCallback((taskId: string, fields: FieldType[]) => {
    setTaskFields(prev => ({
      ...prev,
      [taskId]: fields
    }))
  }, [])

  const generateJson = useCallback(() => {
    const formData = {
      template: selectedProject,
      tasks: selectedTasks.map((task) => ({
        ...task,
        fields: taskFields[task.taskId] || []
      }))
    }
    return JSON.stringify(formData, null, 2)
  }, [selectedProject, selectedTasks, taskFields])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Template Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormTypeSelector onSelect={handleProjectSelect} />
        
        {selectedProject && (
          <TaskSelector
            formType={selectedProject}
            onSelect={handleTaskSelect}
          />
        )}
        
        {selectedTasks.map((task) => (
          <FieldTypeSelector
            key={task.taskId}
            taskId={task.taskId}
            taskName={task.taskName}
            onSelect={(fields: FieldType[]) => handleFieldSelect(task.taskId, fields)}
            selectedFields={taskFields[task.taskId] || []}
          />
        ))}
        
        {selectedProject && (
          <FormPreview
            formType={selectedProject}
            tasks={selectedTasks}
            taskFields={taskFields}
          />
        )}
        
        <Button 
          onClick={() => setShowJsonOutput(!showJsonOutput)}
          className="w-full"
        >
          {showJsonOutput ? "Hide JSON" : "Show JSON"}
        </Button>
        
        {showJsonOutput && <JsonOutput json={generateJson()} />}
      </CardContent>
    </Card>
  )
}

