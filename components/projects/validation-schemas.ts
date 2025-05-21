import { z } from "zod"

// Esquema de validación para el paso 1 (selección de protocolo)
export const step1Schema = z.object({
  protocol: z.string({ required_error: "Por favor, seleccione un protocolo" }),
  protocolName: z.string().optional(),
  taskAssignments: z.array(
    z.object({
      task: z.string(),
      role: z.string(),
      assignedTo: z.string(),
    }),
  ),
})

export type Step1FormValues = z.infer<typeof step1Schema>

// Esquema de validación para el paso 2 (selección de lotes)
export const step2Schema = z.object({
  workspace: z.string().min(1, "Debe seleccionar un espacio de trabajo"),
  workspaceName: z.string().optional(),
  campaign: z.string().min(1, "Debe seleccionar una campaña"),
  campaignName: z.string().optional(),
  establishment: z.string().min(1, "Debe seleccionar un establecimiento"),
  establishmentName: z.string().optional(),
  selectedLots: z.array(z.string()).min(1, "Debe seleccionar al menos un lote"),
  selectedLotsNames: z.record(z.string()).optional(),
})

export type Step2FormValues = z.infer<typeof step2Schema>

// Esquema de validación para el paso 3 (asignación de tareas)
export const taskAssignmentSchema = z.object({
  task: z.string(),
  role: z.string({ required_error: "Por favor, seleccione un rol" }).min(1, { message: "Por favor, seleccione un rol" }),
  assignedTo: z.string({ required_error: "Por favor, seleccione un usuario" }).min(1, { message: "Por favor, seleccione un usuario" }),
})

export const step3Schema = z.object({
  taskAssignments: z.array(taskAssignmentSchema).refine(
    (tasks) => {
      // Solo validar tareas que tengan un rol seleccionado
      const tasksWithRoles = tasks.filter((task) => task.role.length > 0)
      return tasksWithRoles.every((task) => task.assignedTo.length > 0)
    },
    {
      message: "Todas las tareas con rol asignado deben tener un usuario asignado",
      path: ["taskAssignments"],
    },
  ),
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

// Asegurarse de que CreateServiceFormValues incluya los nuevos campos
export type CreateServiceFormValues = Step1FormValues & Step2FormValues & Step3FormValues
