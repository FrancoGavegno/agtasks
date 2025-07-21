import { z } from "zod"

// Domain Protocols (amplify/data/resource.ts)

export const domainProtocolSchema = z.object({
  tmProtocolId: z.string().min(1, "tmProtocolId is required"),
  name: z.string().min(1, "name is required"),
  language: z.string().min(1, "language is required"),
})

export const domainProtocolQuerySchema = z.object({
  domainId: z.string().min(1, "domainId is required"),
})

export const deleteDomainProtocolSchema = z.object({
  domainId: z.string().min(1, "domainId is required"),
  protocolId: z.string().min(1, "protocolId is required"),
})

export type DomainProtocolInput = z.infer<typeof domainProtocolSchema>

// Domain Roles (amplify/data/resource.ts)

export const domainRoleSchema = z.object({
  name: z.string().min(1, "name is required"),
  language: z.string().min(1, "language is required"),
})

export const domainRoleQuerySchema = z.object({
  domainId: z.string().min(1, "domainId is required"),
})

export const deleteDomainRoleSchema = z.object({
  domainId: z.string().min(1, "domainId is required"),
  roleId: z.string().min(1, "roleId is required"),
})

export type DomainRoleInput = z.infer<typeof domainRoleSchema>

// Domain Forms (amplify/data/resource.ts)

export const domainFormSchema = z.object({
  ktFormId: z.string().min(1, "ktFormId is required"),
  name: z.string().min(1, "name is required"),
  language: z.string().min(1, "language is required"),
})

export const domainFormQuerySchema = z.object({
  domainId: z.string().min(1, "domainId is required"),
})

export const deleteDomainFormSchema = z.object({
  domainId: z.string().min(1, "domainId is required"),
  formId: z.string().min(1, "formId is required"),
})

export type DomainFormInput = z.infer<typeof domainFormSchema>

// Projects

export const projectSchema = z.object({
  name: z.string().min(1, "name is required"),
  language: z.string().min(1, "language is required"),
  queueId: z.number().min(1, "queueId is required"),
})

export const projectQuerySchema = z.object({
  domainId: z.string().min(1, "domainId is required"),
})

export type ProjectInput = z.infer<typeof projectSchema>

// Services (amplify/data/resource.ts)

export const serviceSchema = z.object({
  projectId: z.string().min(1, "projectId is required"),
  serviceName: z.string().min(1, "serviceName is required"), // Nombre interno en Agtasks
  externalServiceKey: z.string().min(1, "externalServiceKey is required"), // ID en el task manager (ej. issueKey de Jira)
  sourceSystem: z.string().min(1, "sourceSystem is required"), // Ej.: "jira", "clickup", etc.
  externalTemplateId: z.string().min(1, "externalTemplateId is required"), // ID del template usado en el task manager
  workspaceId: z.string().min(1, "workspaceId is required"),
  campaignId: z.string().min(1, "campaignId is required"),
  farmId: z.string().min(1, "farmId is required"),
  totalArea: z.number().min(0, "totalArea is required"),
  startDate: z.string().min(1, "startDate is required"),
})

export const serviceFieldSchema = z.object({
  fieldId: z.string().min(1, "fieldId is required"),
})

export const serviceTaskSchema = z.object({
  externalTemplateId: z.string().min(1, "externalTemplateId is required"),
  sourceSystem: z.string().min(1, "sourceSystem is required"),
  roleId: z.string().min(1, "roleId is required"),
  userId: z.string().min(1, "userId is required"),
  taskName: z.string().optional(),
})

export const createServiceSchema = z.object({
  projectId: z.string().min(1, "projectId is required"),
  serviceName: z.string().min(1, "serviceName is required"),
  externalServiceKey: z.string().optional().default(`SRV-${Date.now()}`),
  sourceSystem: z.string().min(1, "sourceSystem is required"),
  externalTemplateId: z.string().min(1, "externalTemplateId is required"),
  workspaceId: z.string().min(1, "workspaceId is required"),
  campaignId: z.string().min(1, "campaignId is required"),
  farmId: z.string().min(1, "farmId is required"),
  totalArea: z.number().min(0, "totalArea is required").default(0),
  startDate: z.string().min(1, "startDate is required"),
  fields: z.array(serviceFieldSchema).optional(),
  tasks: z.array(serviceTaskSchema).optional(),
})

export const serviceQuerySchema = z.object({
  projectId: z.string().min(1, "projectId is required"),
})

export type ServiceInput = z.infer<typeof serviceSchema>
export type CreateServiceInput = z.infer<typeof createServiceSchema>


