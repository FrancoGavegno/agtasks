'use client'

import * as React from "react"
import { Check } from 'lucide-react'
import { format } from "date-fns"
import { useForm, useFieldArray } from "react-hook-form"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

type FormValues = {
  templateId: string;
  name: string;
  description: string;
  priority: string;
  status: string;
  dueDate: Date;
  selectedTasks: {
    name: string;
    selected: boolean;
    scope: string;
    farm: string;
    field_list: string;
    task_type: string;
    collect_form: string;
  }[];
};

const steps = [
  "Template Info",
  "Project Details",
  "Select Tasks",
  "Configure Tasks",
  "Review"
]


// Mock data for templates - replace with actual data from your API
const templates = [
  { id: "template1", name: "Productivity Map Template" },
  { id: "template2", name: "Field Survey Template" },
  { id: "template3", name: "Crop Monitoring Template" },
]

const priorities = [
  { label: "Urgent", value: "urgent" },
  { label: "High", value: "high" },
  { label: "Normal", value: "normal" },
  { label: "Low", value: "low" },
]

const statuses = [
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Review", value: "review" },
  { label: "Done", value: "done" },
]

const tasks = [
  "Generar reporte de mapa de productividad",
  "Validar MP con recorrida a campo",
  "Generar reporte de recorrida a campo",
  "Generar Mapa de Productividad",
]

const customFields = [
  { name: "scope", label: "Scope" },
  { name: "farm", label: "Farm" },
  { name: "field_list", label: "Field List" },
  { name: "task_type", label: "Task Type" },
  { name: "collect_form", label: "Collect Form" },
]

type Props = {
  templateId: string | undefined; // Puede ser undefined si no se encuentra
};

export default function CreateProjectStepper() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [selectAll, setSelectAll] = React.useState(false)
  const [applyToAll, setApplyToAll] = React.useState(false)

  const form = useForm<FormValues>({
    defaultValues: {
      templateId: "template1",
      name: "",
      description: "",
      priority: "normal",
      status: "todo",
      dueDate: new Date(),
      selectedTasks: tasks.map(task => ({
        name: task,
        selected: false,
        scope: "",
        farm: "",
        field_list: "",
        task_type: "",
        collect_form: "",
      })),
    },
  })

  const { fields: taskFields } = useFieldArray({
    control: form.control,
    name: "selectedTasks",
  })

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    form.setValue(
      'selectedTasks',
      taskFields.map((task) => ({ ...task, selected: checked }))
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <FormField
                                  control={form.control}
                                  name="templateId"
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Template</FormLabel>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <FormControl>
                                                  <SelectTrigger>
                                                      <SelectValue placeholder="Select a template" />
                                                  </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                  {templates.map((template) => (
                                                      <SelectItem key={template.id} value={template.id}>
                                                          {template.name}
                                                      </SelectItem>
                                                  ))}
                                              </SelectContent>
                                          </Select>
                                          <FormDescription>
                                              Choose a template to create your Project from
                                          </FormDescription>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
          
        )

      case 1:
        return (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be the display name of your project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter project description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {priorities.map((priority) => (
                          <FormItem key={priority.value} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={priority.value} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {priority.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {statuses.map((status) => (
                          <FormItem key={status.value} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={status.value} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {status.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mt-2 mb-8">
              <Switch
                id="select-all"
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all">Select All Tasks</Label>
            </div>
            {taskFields.map((task, index) => (
              <FormField
                key={task.id}
                control={form.control}
                name={`selectedTasks.${index}.selected`}
                render={({ field }) => (
                  <FormItem
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked)
                          setSelectAll(
                            form.getValues('selectedTasks').every((t) => t.selected)
                          )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {task.name}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="flex items-center space-x-2 mt-2 mb-8">
              <Switch
                id="apply-to-all"
                checked={applyToAll}
                onCheckedChange={setApplyToAll}
              />
              <Label htmlFor="apply-to-all">Apply first task's custom fields to all selected tasks</Label>
            </div>

            {taskFields.map((task, taskIndex) => (
              form.getValues(`selectedTasks.${taskIndex}.selected`) && (
                <div key={task.id} className="border p-4 rounded-md">
                  <h3 className="font-semibold mb-4">{task.name}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {customFields.map((field) => (
                      <FormField
                        key={`${task.id}-${field.name}`}
                        control={form.control}
                        name={`selectedTasks.${taskIndex}.${field.name}`}
                        render={({ field: formField }) => (
                          <FormItem className="mb-2">
                            <FormLabel>{field.label}</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                formField.onChange(value)
                                if (applyToAll && taskIndex === 0) {
                                  taskFields.forEach((_, index) => {
                                    if (form.getValues(`selectedTasks.${index}.selected`)) {
                                      form.setValue(`selectedTasks.${index}.${field.name}`, value)
                                    }
                                  })
                                }
                              }}
                              defaultValue={formField.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={`Select ${field.label}`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="option1">Option 1</SelectItem>
                                <SelectItem value="option2">Option 2</SelectItem>
                                <SelectItem value="option3">Option 3</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <h3 className="font-semibold text-lg">Project Summary</h3>
            <div className="space-y-1">
              <p><strong>Template:</strong> {form.getValues("template")}</p>
              <p><strong>Name:</strong> {form.getValues("name")}</p>
              <p><strong>Description:</strong> {form.getValues("description")}</p>
              <p><strong>Priority:</strong> {form.getValues("priority")}</p>
              <p><strong>Status:</strong> {form.getValues("status")}</p>
              <p><strong>Due Date:</strong> {format(form.getValues("dueDate"), "PPP")}</p>
            </div>
            <h3 className="font-semibold text-lg">Selected Tasks</h3>
            {taskFields.map((task, index) => (
              form.getValues(`selectedTasks.${index}.selected`) && (
                <div key={task.id} className="border p-4 rounded-md">
                  <h4 className="font-semibold mb-2">{task.name}</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {customFields.map((field) => (
                      <li key={`${task.id}-${field.name}`}>
                        <strong>{field.label}:</strong> {form.getValues(`selectedTasks.${index}.${field.name}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))} className="max-w-2xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className={cn(
                  "flex flex-col items-center space-y-2",
                  index <= currentStep
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                    index < currentStep
                      ? "bg-primary text-primary-foreground border-primary"
                      : index === currentStep
                      ? "border-primary"
                      : "border-muted"
                  )}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className="text-sm hidden md:block">{step}</span>
              </div>
            ))}
          </div>
          <div className="relative">
            <div
              className="absolute top-4 left-0 right-0 h-0.5 bg-muted"
              style={{
                width: "100%",
              }}
            />
            <div
              className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-300"
              style={{
                width: `${(currentStep / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="pt-4 space-y-6 min-h-[300px]">
            {renderStep()}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              type={currentStep === steps.length - 1 ? "submit" : "button"}
              onClick={currentStep === steps.length - 1 ? undefined : handleNext}
            >
              {currentStep === steps.length - 1 ? "Create Project" : "Next"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

