import { z } from "zod"

// Esquema de validación para el paso 1 (selección de protocolo)
export const step1Schema = z.object({
  protocol: z.enum(["variable-seeding", "satellite-monitoring", ""], {
    required_error: "Por favor, seleccione un protocolo",
  }),
})

export type Step1FormValues = z.infer<typeof step1Schema>

// Esquema de validación para el paso 2 (selección de lotes)
export const step2Schema = z.object({
  workspace: z.string({
    required_error: "Por favor, seleccione un espacio de trabajo",
  }),
  campaign: z.string({
    required_error: "Por favor, seleccione una campaña",
  }),
  establishment: z.string({
    required_error: "Por favor, seleccione un establecimiento",
  }),
  selectedLots: z.array(z.string()).min(1, {
    message: "Por favor, seleccione al menos un lote",
  }),
})

export type Step2FormValues = z.infer<typeof step2Schema>

// Esquema de validación para el paso 3 (asignación de tareas)
export const taskAssignmentSchema = z.object({
  task: z.string(),
  role: z
    .string({
      required_error: "Por favor, seleccione un rol",
    })
    .min(1, {
      message: "Por favor, seleccione un rol",
    }),
  assignedTo: z
    .string({
      required_error: "Por favor, seleccione un usuario",
    })
    .min(1, {
      message: "Por favor, seleccione un usuario",
    }),
})

export const step3Schema = z.object({
  taskAssignments: z.array(taskAssignmentSchema).min(1, {
    message: "Debe haber al menos una tarea asignada",
  }),
})

export type Step3FormValues = z.infer<typeof step3Schema>

// Esquema completo del formulario
export const createServiceSchema = z.object({
  protocol: step1Schema.shape.protocol,
  workspace: step2Schema.shape.workspace,
  campaign: step2Schema.shape.campaign,
  establishment: step2Schema.shape.establishment,
  selectedLots: step2Schema.shape.selectedLots,
  taskAssignments: step3Schema.shape.taskAssignments,
})

export type CreateServiceFormValues = z.infer<typeof createServiceSchema>
