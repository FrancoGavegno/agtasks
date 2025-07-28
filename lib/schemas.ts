// Core Entity Schemas:

// domainProtocolSchema - For DomainProtocol model
// domainFormSchema - For DomainForm model
// fieldSchema - For Field model
// projectSchema - For Project model
// serviceSchema - For Service model
// taskSchema - For Task model
// taskFieldSchema - For TaskField junction table

// Relationship Schemas:
// projectWithRelationsSchema - Project with services and tasks
// serviceWithRelationsSchema - Service with project and tasks
// taskWithRelationsSchema - Task with project, service, and taskFields
// fieldWithRelationsSchema - Field with taskFields
// taskFieldWithRelationsSchema - TaskField with task and field

// Input Schemas for CRUD Operations:
// createProjectInputSchema - For creating projects (without auto-generated fields)
// updateProjectInputSchema - For updating projects (partial, without auto-generated fields)
// Similar patterns for all other entities

// Query Schemas:
// projectQuerySchema - For filtering projects
// serviceQuerySchema - For filtering services
// taskQuerySchema - For filtering tasks
// fieldQuerySchema - For filtering fields
// paginationSchema - For pagination parameters

// Response Schemas:
// listResponseSchema - Generic list response wrapper
// Specific list response schemas for each entity type

// All relationships preserved:
// Project → Services (hasMany)
// Project → Tasks (hasMany)
// Service → Tasks (hasMany)
// Task → TaskFields (hasMany)
// Field → TaskFields (hasMany)
// All belongsTo relationships

import { z } from "zod";

// Base schemas for common patterns
const baseEntitySchema = z.object({
  id: z.string().optional(), // Amplify auto-generates this
  createdAt: z.string().optional(), // Amplify auto-generates this
  updatedAt: z.string().optional(), // Amplify auto-generates this
});

// DomainProtocol Schema
export const domainProtocolSchema = baseEntitySchema.extend({
  domainId: z.string().min(1, "Domain ID is required"),
  tmProtocolId: z.string().min(1, "Template Protocol ID is required"),
  name: z.string().min(1, "Name is required"),
  language: z.string().min(1, "Language is required"),
});

export type DomainProtocol = z.infer<typeof domainProtocolSchema>;

// DomainForm Schema
export const domainFormSchema = baseEntitySchema.extend({
  domainId: z.string().min(1, "Domain ID is required"),
  ktFormId: z.string().min(1, "Kobo Toolbox Form ID is required"),
  name: z.string().min(1, "Name is required"),
  language: z.string().min(1, "Language is required"),
});

export type DomainForm = z.infer<typeof domainFormSchema>;

// Project Schema
export const projectSchema = baseEntitySchema.extend({
  domainId: z.string().min(1, "Domain ID is required"),
  areaId: z.string().min(1, "Area ID is required"),
  // 360 Integration defaults
  tmpSourceSystem: z.string().default("jira"),
  tmpServiceDeskId: z.string().default("TEM"),
  tmpRequestTypeId: z.string().default("87"),
  tmpQueueId: z.string().default("82"),
  // Task Manager Client Project
  serviceDeskId: z.string().min(1, "Service Desk ID is required"),
  requestTypeId: z.string().min(1, "Request Type ID is required"),
  queueId: z.string().optional(),
  // Project details
  name: z.string().min(1, "Project name is required"),
  language: z.string().optional(),
  deleted: z.boolean().default(false),
});

export type Project = z.infer<typeof projectSchema>;

// Service Schema
export const serviceSchema = baseEntitySchema.extend({
  projectId: z.string().min(1, "Project ID is required"),
  tmpRequestId: z.string().optional(), // template
  requestId: z.string().optional(), // client
  name: z.string().min(1, "Service name is required"),
  deleted: z.boolean().default(false),
  protocolId: z.string().optional(), // DomainProtocol reference
});

export type Service = z.infer<typeof serviceSchema>;

// Task Schema
export const taskSchema = baseEntitySchema.extend({
  projectId: z.string().optional().nullable(),
  serviceId: z.string().optional().nullable(),
  tmpSubtaskId: z.string().optional(), // template
  subtaskId: z.string().optional(), // client
  taskName: z.string().min(1, "Task name is required"),
  taskType: z.string().min(1, "Task type is required"),
  taskData: z.union([z.record(z.any()), z.string()]).optional().nullable(), // JSON data for submitted form (can be object, string, or null)
  userEmail: z.string().email("Valid email is required").min(1, "User email is required"),
  deleted: z.boolean().default(false),
  formId: z.string().optional(), // DomainForm reference
});

export type Task = z.infer<typeof taskSchema>;

// Field Schema
export const fieldSchema = baseEntitySchema.extend({
  workspaceId: z.string().min(1, "Workspace ID is required"),
  workspaceName: z.string().optional(),
  campaignId: z.string().min(1, "Campaign ID is required"),
  campaignName: z.string().optional(),
  farmId: z.string().min(1, "Farm ID is required"),
  farmName: z.string().optional(),
  fieldId: z.string().min(1, "Field ID is required"),
  fieldName: z.string().min(1, "Field name is required"),
  hectares: z.number().positive().optional(),
  crop: z.string().optional(),
  hybrid: z.string().optional(),
  deleted: z.boolean().default(false),
});

export type Field = z.infer<typeof fieldSchema>;

// TaskField Schema (junction table)
export const taskFieldSchema = baseEntitySchema.extend({
  taskId: z.string().min(1, "Task ID is required"),
  fieldId: z.string().min(1, "Field ID is required"),
});

export type TaskField = z.infer<typeof taskFieldSchema>;

// Schemas with relationships (for API responses)
export const projectWithRelationsSchema = projectSchema.extend({
  services: z.array(serviceSchema).optional(),
  tasks: z.array(taskSchema).optional(),
});

export type ProjectWithRelations = z.infer<typeof projectWithRelationsSchema>;

export const serviceWithRelationsSchema = serviceSchema.extend({
  project: projectSchema.optional(),
  tasks: z.array(taskSchema).optional(),
});

export type ServiceWithRelations = z.infer<typeof serviceWithRelationsSchema>;

export const taskWithRelationsSchema = taskSchema.extend({
  project: projectSchema.optional(),
  service: serviceSchema.optional(),
  taskFields: z.array(taskFieldSchema).optional(),
});

export type TaskWithRelations = z.infer<typeof taskWithRelationsSchema>;

export const fieldWithRelationsSchema = fieldSchema.extend({
  taskFields: z.array(taskFieldSchema).optional(),
});

export type FieldWithRelations = z.infer<typeof fieldWithRelationsSchema>;

export const taskFieldWithRelationsSchema = taskFieldSchema.extend({
  task: taskSchema.optional(),
  field: fieldSchema.optional(),
});

export type TaskFieldWithRelations = z.infer<typeof taskFieldWithRelationsSchema>;

// Input schemas for mutations (without auto-generated fields)
export const createProjectInputSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProjectInputSchema = projectSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createServiceInputSchema = serviceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateServiceInputSchema = serviceSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createTaskInputSchema = taskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateTaskInputSchema = taskSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createFieldInputSchema = fieldSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateFieldInputSchema = fieldSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createTaskFieldInputSchema = taskFieldSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Query schemas for filtering
export const projectQuerySchema = z.object({
  domainId: z.string().optional(),
  areaId: z.string().optional(),
  deleted: z.boolean().optional(),
  includeServices: z.boolean().optional(),
  includeTasks: z.boolean().optional(),
});

export const serviceQuerySchema = z.object({
  projectId: z.string().optional(),
  deleted: z.boolean().optional(),
  includeTasks: z.boolean().optional(),
});

export const taskQuerySchema = z.object({
  projectId: z.string().optional(),
  serviceId: z.string().optional(),
  taskType: z.string().optional(),
  userEmail: z.string().optional(),
  deleted: z.boolean().optional(),
  includeFields: z.boolean().optional(),
});

export const fieldQuerySchema = z.object({
  workspaceId: z.string().optional(),
  campaignId: z.string().optional(),
  farmId: z.string().optional(),
  deleted: z.boolean().optional(),
});

export const jiraServiceQuerySchema = z.object({
  domainId: z.string().min(1, "domainId is required"),
  projectId: z.string().min(1, "projectId is required"),
  queueId: z.string().min(1, "queueId is required"),
});

export const jiraTaskQuerySchema = z.object({
  serviceId: z.string().min(1, "serviceId is required"),
});

// Pagination schema
export const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  nextToken: z.string().optional(),
});

// Response schemas
export const listResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    nextToken: z.string().optional(),
  });

export const projectListResponseSchema = listResponseSchema(projectWithRelationsSchema);
export const serviceListResponseSchema = listResponseSchema(serviceWithRelationsSchema);
export const taskListResponseSchema = listResponseSchema(taskWithRelationsSchema);
export const fieldListResponseSchema = listResponseSchema(fieldWithRelationsSchema);

// Export all types
export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;
export type CreateServiceInput = z.infer<typeof createServiceInputSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceInputSchema>;
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;
export type CreateFieldInput = z.infer<typeof createFieldInputSchema>;
export type UpdateFieldInput = z.infer<typeof updateFieldInputSchema>;
export type CreateTaskFieldInput = z.infer<typeof createTaskFieldInputSchema>;

export type ProjectQuery = z.infer<typeof projectQuerySchema>;
export type ServiceQuery = z.infer<typeof serviceQuerySchema>;
export type TaskQuery = z.infer<typeof taskQuerySchema>;
export type FieldQuery = z.infer<typeof fieldQuerySchema>;
export type JiraServiceQuery = z.infer<typeof jiraServiceQuerySchema>;
export type JiraTaskQuery = z.infer<typeof jiraTaskQuerySchema>;
export type Pagination = z.infer<typeof paginationSchema>;

// Jira protocol subtasks 
export const protocolTasksSchema = z.record(z.array(z.object({
  key: z.string(),
  fields: z.object({
    summary: z.string().optional(),
    issuetype: z.object({
      name: z.string()
    }).optional()
  }).optional()
})))

export type ProtocolTasks = z.infer<typeof protocolTasksSchema>

// Task Form Schema for create/edit task forms
export const taskFormSchema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  taskType: z.string().min(1, "Task type is required"),
  fields: z.array(z.object({
    id: z.number().optional(),
    workspaceId: z.number().optional(),
    workspaceName: z.string().optional(),
    campaignId: z.number().optional(),
    campaignName: z.string().optional(),
    farmId: z.number().optional(),
    farmName: z.string().optional(),
    fieldId: z.string().optional(),
    fieldName: z.string().optional(),
    hectares: z.number().optional(),
    crop: z.string().optional(),
    hybrid: z.string().optional(),
    cropDate: z.string().optional(),
    cropId: z.number().optional(),
    cropName: z.string().optional(),
    hybridId: z.number().optional(),
    hybridName: z.string().optional(),
    layerId: z.number().optional(),
    seasonId: z.number().optional(),
    name: z.string().optional(),
  })).min(1, "At least one field must be selected"),
  projectId: z.string().min(1, "Project ID is required"),
  serviceId: z.string().optional(),
  userEmail: z.string().email("Valid email is required").min(1, "User email is required"),
  tmpSubtaskId: z.string().optional(),
  subtaskId: z.string().optional(),
  taskData: z.union([z.record(z.any()), z.string()]).optional().nullable(),
  deleted: z.boolean().default(false),
  formId: z.string().optional(),
})

export type TaskFormFullValues = z.infer<typeof taskFormSchema>

// Field Form Values for task fields
export const fieldFormSchema = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),
  workspaceName: z.string().optional(),
  campaignId: z.string().min(1, "Campaign ID is required"),
  campaignName: z.string().optional(),
  farmId: z.string().min(1, "Farm ID is required"),
  farmName: z.string().optional(),
  fieldId: z.string().min(1, "Field ID is required"),
  fieldName: z.string().min(1, "Field name is required"),
  hectares: z.number().positive().optional(),
  crop: z.string().optional(),
  hybrid: z.string().optional(),
})

export type FieldFormValues = z.infer<typeof fieldFormSchema>

// Task Field Form Values for task-field associations
export const taskFieldFormSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  fieldId: z.string().min(1, "Field ID is required"),
})

export type TaskFieldFormValues = z.infer<typeof taskFieldFormSchema>