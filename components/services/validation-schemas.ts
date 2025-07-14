import { z } from "zod"

// Service Schema
export const serviceSchema = z.object({
  projectId: z.string().optional(),
  tmpRequestId: z.string().optional(),
  requestId: z.string().optional(),
  name: z.string().min(1, "El nombre es requerido"),
  protocolId: z.string().min(1, "El protocolo es requerido"),
  deleted: z.boolean().optional(),
  tasks: z.array(z.any()).optional(), // Relación, puede ser ajustada
})
export type ServiceFormValues = z.infer<typeof serviceSchema>

// Task Schema
export const taskSchema = z.object({
  projectId: z.string().optional(),
  serviceId: z.string().optional(),
  tmpSubtaskId: z.string().min(1, "El template es requerido"),
  subtaskId: z.string().optional(),
  taskName: z.string().min(1, "El nombre de la tarea es requerido"),
  taskType: z.string(),
  taskData: z.any().optional(),
  userEmail: z.string().min(1, "El usuario es requerido"),
  deleted: z.boolean().optional(),
  formId: z.string().optional(),
  taskFields: z.array(z.any()).optional(), // Relación, puede ser ajustada
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

// Field Schema
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
  taskFields: z.array(z.any()).optional(), // Relación, puede ser ajustada
})
export type FieldFormValues = z.infer<typeof fieldSchema>

// TaskField Schema
export const taskFieldSchema = z.object({
  taskId: z.string().min(1, "El taskId es requerido"),
  fieldId: z.string().min(1, "El fieldId es requerido"),
  // Relaciones omitidas para validación UI
})
export type TaskFieldFormValues = z.infer<typeof taskFieldSchema>

// Array de tareas (tasks)
export const tasksArraySchema = z.array(taskSchema).min(1, "Debe haber al menos una tarea")
export type TasksArrayFormValues = z.infer<typeof tasksArraySchema>

// Array de lotes/campos (fields)
export const fieldsArraySchema = z.array(fieldSchema).min(1, "Debe seleccionar al menos un lote")
export type FieldsArrayFormValues = z.infer<typeof fieldsArraySchema>

// Esquema de formulario de servicio completo (para validación de todo el flujo)
export const serviceFormSchema = serviceSchema.extend({
  tasks: tasksArraySchema,
  fields: fieldsArraySchema,
})
export type ServiceFormFullValues = z.infer<typeof serviceFormSchema>
