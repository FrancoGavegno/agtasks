import { z } from "zod"

// Service 
export const serviceSchema = z.object({
  projectId: z.string().optional(),
  tmpRequestId: z.string().optional(),
  requestId: z.string().optional(),
  name: z.string().min(1, "El name es requerido"),
  protocolId: z.string().min(1, "El protocolId es requerido"),
  deleted: z.boolean().optional(),
})

export type ServiceFormValues = z.infer<typeof serviceSchema>

// Task 
export const taskSchema = z.object({
  projectId: z.string().optional(),
  serviceId: z.string().optional(),
  tmpSubtaskId: z.string().optional(),
  subtaskId: z.string().optional(),
  taskName: z.string().min(1, "El taskName es requerido"),
  taskType: z.string().min(1, "El tipo de tarea es requerido"),
  taskData: z.any().optional(),
  userEmail: z.string().min(1, "El userEmail es requerido"),
  deleted: z.boolean().optional(),
  formId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.taskType === "fieldvisit" && (!data.formId || data.formId === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El formulario es requerido para tareas de tipo 'fieldvisit'",
      path: ["formId"],
    });
  }
});

export type TaskFormValues = z.infer<typeof taskSchema>

// Field
export const fieldSchema = z.object({
  workspaceId: z.string().min(1, "El workspace es requerido"),
  workspaceName: z.string().optional(),
  campaignId: z.string().min(1, "La campaña es requerida"),
  campaignName: z.string().optional(),
  farmId: z.string().min(1, "El establecimiento es requerido"),
  farmName: z.string().optional(),
  fieldId: z.string().min(1, "El lote es requerido"),
  fieldName: z.string().min(1, "El nombre del lote es requerido"),
  hectares: z.number().optional(),
  crop: z.string().optional(),
  hybrid: z.string().optional(),
  deleted: z.boolean().optional(),
})

export type FieldFormValues = z.infer<typeof fieldSchema>

// TaskField
export const taskFieldSchema = z.object({
  taskId: z.string().min(1, "El taskId es requerido"),
  fieldId: z.string().min(1, "El fieldId es requerido"),
})

export type TaskFieldFormValues = z.infer<typeof taskFieldSchema>

// Array de tareas (tasks)
export const tasksArraySchema = z.array(taskSchema).min(1, "Debe haber al menos una tarea")

export type TasksArrayFormValues = z.infer<typeof tasksArraySchema>

// Array de lotes/campos (fields)
export const fieldsArraySchema = z.array(fieldSchema).min(1, "Debe seleccionar al menos un lote")

export type FieldsArrayFormValues = z.infer<typeof fieldsArraySchema>

// "Create Service" Form Schema 
export const serviceFormSchema = serviceSchema.extend({
  tasks: tasksArraySchema,
  fields: fieldsArraySchema,
})

export type ServiceFormFullValues = z.infer<typeof serviceFormSchema>

// "Create Task" Form Schema 
export const taskFormSchema = taskSchema.and(
  z.object({
    fields: fieldsArraySchema,
  })
)

export type TaskFormFullValues = z.infer<typeof taskFormSchema>

// Jira Services (Requests) & SubTasks
export const jiraServiceQuerySchema = z.object({
  domainId: z.string().min(1, "domainId is required"),
  projectId: z.string().min(1, "projectId is required"),
  queueId: z.string().min(1, "queueId is required"),
})

export const jiraTaskQuerySchema = z.object({
  serviceId: z.string().min(1, "serviceId is required"),
})