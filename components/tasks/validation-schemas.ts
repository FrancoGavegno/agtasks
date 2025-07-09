import { z } from "zod"

export const createTaskStepperSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  taskType: z.string().min(1, "El tipo de tarea es obligatorio"),
  workspace: z.string().min(1, "El espacio de trabajo es obligatorio"),
  campaign: z.string().min(1, "La campaña es obligatoria"),
  establishment: z.string().min(1, "El establecimiento es obligatorio"),
  selectedLots: z.array(z.any()).min(1, "Debes seleccionar al menos un lote"),
  projectId: z.string().min(1),
  serviceId: z.string().optional(), // No obligatorio
  userEmail: z.string().email("Email inválido"),
})

export type CreateTaskStepperFormValues = z.infer<typeof createTaskStepperSchema> 