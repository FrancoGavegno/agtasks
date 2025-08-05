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
  tmpSourceSystem: z.string().default("jira"),
  tmpServiceDeskId: z.string().default("TEM"),
  tmpRequestTypeId: z.string().default("87"),
  tmpQueueId: z.string().default("82"),  
  serviceDeskId: z.string().min(1, "Service Desk ID is required"),
  requestTypeId: z.string().min(1, "Request Type ID is required"),
  queueId: z.string().optional(),
  name: z.string().min(1, "Project name is required"),
  language: z.string().optional(),
  deleted: z.boolean().default(false),
});

export type Project = z.infer<typeof projectSchema>;

// Service Schema
export const serviceSchema = baseEntitySchema.extend({
  projectId: z.string().min(1, "Project ID is required"),
  tmpRequestId: z.string().min(1, "Template ID is required"), // template
  requestId: z.string().min(1, "Request ID is required"), // client
  name: z.string().min(1, "Service name is required"),
  deleted: z.boolean().default(false),
  protocolId: z.string().min(1, "Protocol ID is required"), 
});

export type Service = z.infer<typeof serviceSchema>;

// Task Schema - Updated to match database schema exactly
export const taskSchema = baseEntitySchema.extend({
  projectId: z.string().min(1, "Project ID is required"),
  serviceId: z.string().optional().nullable(),
  tmpSubtaskId: z.string().optional().nullable(), // template
  subtaskId: z.string().optional().nullable(), // client
  taskName: z.string().min(1, "Task name is required"),
  taskType: z.string().min(1, "Task type is required"),
  taskData: z.string().optional().nullable(), // JSON string data for submitted form
  userEmail: z.string().email("Valid email is required").min(1, "User email is required"),
  deleted: z.boolean().default(false),
  formId: z.string().optional().nullable(), // DomainForm reference
  workspaceId: z.number().int().min(1, "Workspace ID is required"),
  workspaceName: z.string().optional(),
  seasonId: z.number().int().min(1, "Season ID is required"),
  seasonName: z.string().optional(),
  farmId: z.number().int().min(1, "Farm ID is required"),
  farmName: z.string().optional(),
  fieldIdsOnlyIncluded: z.array(z.number().int()).optional(),
});

export type Task = z.infer<typeof taskSchema>;

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
});

export type TaskWithRelations = z.infer<typeof taskWithRelationsSchema>;

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
  deleted: true,
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
  deleted: true,
});

export const updateTaskInputSchema = taskSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,  
});

// DomainProtocol input schemas
export const createDomainProtocolInputSchema = domainProtocolSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateDomainProtocolInputSchema = domainProtocolSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// DomainForm input schemas
export const createDomainFormInputSchema = domainFormSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateDomainFormInputSchema = domainFormSchema.partial().omit({
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
  workspaceId: z.number().int().optional(),
  seasonId: z.number().int().optional(),
  farmId: z.number().int().optional(),
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

// UI Form
export const serviceFormSchema = serviceSchema.extend({
  projectId: z.string().min(1, "Project ID is required"),
  tmpRequestId: z.string().min(1, "Template ID is required"),
  requestId: z.string().min(1, "Request ID is required"),
  name: z.string().min(1, "Service name is required"),
  protocolId: z.string().min(1, "Protocol ID is required"),
  protocolName: z.string().optional(),
  tasks: z.array(taskSchema).min(1, "At least 1 task is required"),  
})

// Task Form Schema for create/edit task forms - Updated to match database schema
export const taskFormSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  taskName: z.string().min(1, "Task name is required"),
  taskType: z.string().min(1, "Task type is required"),  
  userEmail: z.string().email("Valid email is required").min(1, "User email is required"),
  serviceId: z.string().optional(),
  tmpSubtaskId: z.string().optional(),
  subtaskId: z.string().optional(),
  taskData: z.string().optional().nullable(),
  formId: z.string().optional().nullable(),    
  workspaceId: z.number().int().min(1, "Workspace ID is required"),
  workspaceName: z.string().optional(),
  seasonId: z.number().int().min(1, "Season ID is required"),
  seasonName: z.string().optional(),
  farmId: z.number().int().min(1, "Farm ID is required"),
  farmName: z.string().optional(),
  fieldIdsOnlyIncluded: z.array(z.number().int()).optional(),
}).refine((data) => {
  // Validate that 360 Farm fields are properly set before submission
  return data.workspaceId > 0 && data.seasonId > 0 && data.farmId > 0;
}, {
  message: "Workspace, Season, and Farm must be selected before submitting the task",
  path: ["workspaceId"] // This will show the error on the workspace field
});
  
// Schema for unified task operations (create/update with fields)
export const unifiedTaskOperationSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  taskName: z.string().min(1, "Task name is required"),
  taskType: z.string().min(1, "Task type is required"),
  userEmail: z.string().email("Valid email is required").min(1, "User email is required"),
  serviceId: z.string().optional(),
  tmpSubtaskId: z.string().optional(),
  subtaskId: z.string().optional(),
  taskData: z.string().optional().nullable(),
  formId: z.string().optional().nullable(),  
  workspaceId: z.number().int().min(1, "Workspace ID is required"),
  workspaceName: z.string().optional(),
  seasonId: z.number().int().min(1, "Season ID is required"),
  seasonName: z.string().optional(),
  farmId: z.number().int().min(1, "Farm ID is required"),
  farmName: z.string().optional(),
  fieldIdsOnlyIncluded: z.array(z.number().int()).optional(),  
  operation: z.enum(["create", "update"]), // Operation type  
  taskId: z.string().optional(), // For update operations
}).refine((data) => {
  // taskId is required when operation is 'update'
  if (data.operation === 'update' && !data.taskId) {
    return false;
  }
  return true;
}, {
  message: "Task ID is required for update operations",
  path: ["taskId"]
});

// Export all types
export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;
export type CreateServiceInput = z.infer<typeof createServiceInputSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceInputSchema>;
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;
export type CreateDomainProtocolInput = z.infer<typeof createDomainProtocolInputSchema>;
export type UpdateDomainProtocolInput = z.infer<typeof updateDomainProtocolInputSchema>;
export type CreateDomainFormInput = z.infer<typeof createDomainFormInputSchema>;
export type UpdateDomainFormInput = z.infer<typeof updateDomainFormInputSchema>;
export type ProjectQuery = z.infer<typeof projectQuerySchema>;
export type ServiceQuery = z.infer<typeof serviceQuerySchema>;
export type TaskQuery = z.infer<typeof taskQuerySchema>;
export type JiraServiceQuery = z.infer<typeof jiraServiceQuerySchema>;
export type JiraTaskQuery = z.infer<typeof jiraTaskQuerySchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type ServiceFormValues = z.infer<typeof serviceFormSchema>
export type TaskFormValues = z.infer<typeof taskFormSchema>
export type UnifiedTaskOperation = z.infer<typeof unifiedTaskOperationSchema>