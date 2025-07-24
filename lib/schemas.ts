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
  userEmail: z.string().optional(), // Cambiado a opcional - se validará según contexto
  deleted: z.boolean().optional(),
  formId: z.string().optional(), // Cambiado a opcional - se validará según contexto
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

// Función para validar tareas habilitadas - VALIDACIÓN PRINCIPAL PARA EL FORMULARIO
export const validateEnabledTasks = (tasks: TaskFormValues[], enabledTasks: Set<number>) => {
  const errors: { [key: string]: string } = {}
  
  // Validar que al menos una tarea esté habilitada
  if (enabledTasks.size === 0) {
    errors.enabledTasks = "Al menos una tarea debe estar habilitada para continuar."
    return errors
  }
  
  // Validar solo las tareas habilitadas
  enabledTasks.forEach((taskIndex) => {
    const task = tasks[taskIndex]
    if (!task) return
    
    // Validar userEmail para todas las tareas habilitadas
    if (!task.userEmail || task.userEmail.trim() === "") {
      errors[`tasks.${taskIndex}.userEmail`] = "El usuario es requerido para tareas habilitadas"
    }
    
    // Validar formId solo para tareas tipo "fieldvisit" que estén habilitadas
    if (task.taskType === "fieldvisit" && (!task.formId || task.formId.trim() === "")) {
      errors[`tasks.${taskIndex}.formId`] = "El formulario es requerido para tareas de tipo 'fieldvisit'"
    }
  })
  
  return errors
}

// Función para validar el formulario completo usando la validación contextual
export const validateServiceForm = (formData: any, enabledTasks: Set<number>) => {
  const errors: { [key: string]: string } = {}
  
  // Validar campos básicos del servicio
  if (!formData.name || formData.name.trim() === "") {
    errors.name = "El nombre del servicio es requerido"
  }
  
  if (!formData.protocolId || formData.protocolId.trim() === "") {
    errors.protocolId = "El protocolo es requerido"
  }
  
  // Validar tareas usando la función contextual
  if (formData.tasks && Array.isArray(formData.tasks)) {
    const taskErrors = validateEnabledTasks(formData.tasks, enabledTasks)
    Object.assign(errors, taskErrors)
  }
  
  // Validar campos (lotes)
  if (!formData.fields || !Array.isArray(formData.fields) || formData.fields.length === 0) {
    errors.fields = "Debe seleccionar al menos un lote"
  }
  
  return errors
}

// Array de lotes/campos (fields)
export const fieldsArraySchema = z.array(fieldSchema).min(1, "Debe seleccionar al menos un lote")

export type FieldsArrayFormValues = z.infer<typeof fieldsArraySchema>

// "Create Service" Form Schema 
export const serviceFormSchema = serviceSchema.extend({
  tasks: z.array(taskSchema), // Array simple sin validación automática
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