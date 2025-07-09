import { z } from "zod"

// Tasks Schema
export const taskAssignmentSchema = z.object({
  task: z.string(),
  taskType: z.string(),
  assignedTo: z.string(),
});

// Fields Schema
export const selectedLotDetailSchema = z.object({
  fieldId: z.string(),
  fieldName: z.string(),
  hectares: z.number(),
  cropName: z.string(),
  hybridName: z.string().optional(),
})

export type SelectedLotDetail = z.infer<typeof selectedLotDetailSchema>

// Step 1 Protocol Selection
export const step1Schema = z.object({
  protocol: z.string({ required_error: "Por favor, seleccione un protocolo" }),
  protocolName: z.string().optional(),
  taskAssignments: z.array(taskAssignmentSchema),
})

export type Step1FormValues = z.infer<typeof step1Schema>

// Step 2 Fields Selection
export const step2Schema = z.object({
  workspace: z.string().min(1, "Debe seleccionar un espacio de trabajo"),
  workspaceName: z.string().optional(),
  campaign: z.string().min(1, "Debe seleccionar una campaña"),
  campaignName: z.string().optional(),
  establishment: z.string().min(1, "Debe seleccionar un establecimiento"),
  establishmentName: z.string().optional(),
  selectedLots: z.array(selectedLotDetailSchema).min(1, "Debe seleccionar al menos un lote"),
  selectedLotsNames: z.record(z.string()).optional(),
})

export type Step2FormValues = z.infer<typeof step2Schema>

// Step 3 Users of Tasks Selection
export const step3Schema = z.object({
  taskAssignments: z.array(taskAssignmentSchema).refine(
    (tasks) => tasks.every((task) => !!task.assignedTo && task.assignedTo.length > 0),
    {
      message: "Todas las tareas deben tener un usuario asignado",
      path: ["taskAssignments"],
    },
  )
})

export type Step3FormValues = z.infer<typeof step3Schema>

// Create Service Form Schema
export const createServiceSchema = z.object({
  protocol: step1Schema.shape.protocol,
  workspace: step2Schema.shape.workspace,
  campaign: step2Schema.shape.campaign,
  establishment: step2Schema.shape.establishment,
  selectedLots: step2Schema.shape.selectedLots,
  taskAssignments: step3Schema.shape.taskAssignments,
})

export type CreateServiceFormValues = Step1FormValues & Step2FormValues & Step3FormValues
