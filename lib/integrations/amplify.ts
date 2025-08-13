import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/amplify/data/resource";
import {
  // Schemas
  domainProtocolSchema,
  domainFormSchema,
  projectSchema,
  serviceSchema,
  taskSchema,
  // Input schemas
  createDomainProtocolInputSchema,
  updateDomainProtocolInputSchema,
  createDomainFormInputSchema,
  updateDomainFormInputSchema,
  createProjectInputSchema,
  updateProjectInputSchema,
  createServiceInputSchema,
  updateServiceInputSchema,
  createTaskInputSchema,
  updateTaskInputSchema,
  // Query schemas
  projectQuerySchema,
  serviceQuerySchema,
  taskQuerySchema,
  paginationSchema,
  // Types
  type DomainProtocol,
  type DomainForm,
  type Project,
  type Service,
  type Task,
  type CreateDomainProtocolInput,
  type UpdateDomainProtocolInput,
  type CreateDomainFormInput,
  type UpdateDomainFormInput,
  type CreateProjectInput,
  type UpdateProjectInput,
  type CreateServiceInput,
  type UpdateServiceInput,
  type CreateTaskInput,
  type UpdateTaskInput,
  type ProjectQuery,
  type ServiceQuery,
  type TaskQuery,
  type Pagination,
  unifiedTaskOperationSchema,
  UnifiedTaskOperation,
} from "@/lib/schemas";

// La configuración de Amplify se maneja en providers.tsx
// Esta configuración solo se usa para datos del proyecto actual (Gen2)
// Amplify.configure(outputs);

// Genera el cliente de Amplify usando la configuración Gen2 para datos
// console.log("=== Generating Amplify client ===");
// console.log("=== outputs data ===", {
//   url: outputs.data.url,
//   region: outputs.data.aws_region,
//   authType: outputs.data.default_authorization_type
// });

// Configurar Amplify con la configuración completa de outputs para API
// En desarrollo: usar configuración del microservicio para Auth, pero outputs para API
// En producción: usar outputs para todo
console.log("=== Configurando Amplify para API (outputs) ===");
Amplify.configure(outputs);

// Verificar que la configuración esté disponible
// console.log("=== Current Amplify config ===", (globalThis as any).__AMPLIFY_CONFIG__);

let client: any;
try {
  client = generateClient<Schema>();
  // console.log("=== Amplify client generated ===", client);
  // console.log("=== Client models ===", client.models);
  // console.log("=== Client models keys ===", Object.keys(client.models || {}));
  // console.log("=== Project model exists ===", !!client.models?.Project);
} catch (error) {
  console.error("=== Error generating client ===", error);
  throw error;
}

// Error types
export class ValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AmplifyError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = "AmplifyError";
  }
}

// Generic CRUD operations with validation
export class ApiClient {
  // ==================== DOMAIN PROTOCOL OPERATIONS ====================
  
  async createDomainProtocol(data: CreateDomainProtocolInput): Promise<DomainProtocol> {
    try {
      const validatedData = createDomainProtocolInputSchema.parse(data);
      const result = await client.models.DomainProtocol.create(validatedData);
      
      if (!result.data) {
        throw new Error('No data returned from create operation');
      }
      
      return domainProtocolSchema.parse(result.data);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid domain protocol data', error);
      }
      throw new AmplifyError('Failed to create domain protocol', error);
    }
  }

  async getDomainProtocol(id: string): Promise<DomainProtocol> {
    try {
      const result = await client.models.DomainProtocol.get({ id });
      if (!result) {
        throw new Error('Domain protocol not found');
      }
      return domainProtocolSchema.parse(result.data);
    } catch (error) {
      throw new AmplifyError('Failed to get domain protocol', error);
    }
  }

  async updateDomainProtocol(id: string, data: UpdateDomainProtocolInput): Promise<DomainProtocol> {
    try {
      const validatedData = updateDomainProtocolInputSchema.parse(data);
      const result = await client.models.DomainProtocol.update({ id, ...validatedData });
      return domainProtocolSchema.parse(result.data);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid domain protocol data', error);
      }
      throw new AmplifyError('Failed to update domain protocol', error);
    }
  }

  async deleteDomainProtocol(id: string): Promise<void> {
    try {
      await client.models.DomainProtocol.delete({ id });
    } catch (error) {
      throw new AmplifyError('Failed to delete domain protocol', error);
    }
  }

  async listDomainProtocols(domainId?: string): Promise<{ items: DomainProtocol[]; nextToken?: string }> {
    try {
      const filter = domainId ? { domainId: { eq: domainId } } : undefined;
      const result = await client.models.DomainProtocol.list({ filter });
      return {
        items: result.data.map((item: any) => domainProtocolSchema.parse(item)),
        nextToken: result.nextToken || undefined
      };
    } catch (error) {
      throw new AmplifyError('Failed to list domain protocols', error);
    }
  }

  // ==================== DOMAIN FORM OPERATIONS ====================
  
  async createDomainForm(data: CreateDomainFormInput): Promise<DomainForm> {
    try {
      const validatedData = createDomainFormInputSchema.parse(data);
      const result = await client.models.DomainForm.create(validatedData);
      
      if (!result.data) {
        throw new Error('No data returned from create operation');
      }
      
      return domainFormSchema.parse(result.data);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid domain form data', error);
      }
      throw new AmplifyError('Failed to create domain form', error);
    }
  }

  async getDomainForm(id: string): Promise<DomainForm> {
    try {
      const result = await client.models.DomainForm.get({ id });
      if (!result) {
        throw new Error('Domain form not found');
      }
      return domainFormSchema.parse(result.data);
    } catch (error) {
      throw new AmplifyError('Failed to get domain form', error);
    }
  }

  async updateDomainForm(id: string, data: UpdateDomainFormInput): Promise<DomainForm> {
    try {
      const validatedData = updateDomainFormInputSchema.parse(data);
      const result = await client.models.DomainForm.update({ id, ...validatedData });
      return domainFormSchema.parse(result.data);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid domain form data', error);
      }
      throw new AmplifyError('Failed to update domain form', error);
    }
  }

  async deleteDomainForm(id: string): Promise<void> {
    try {
      await client.models.DomainForm.delete({ id });
    } catch (error) {
      throw new AmplifyError('Failed to delete domain form', error);
    }
  }

  async listDomainForms(domainId?: string): Promise<{ items: DomainForm[]; nextToken?: string }> {
    try {
      const filter = domainId ? { domainId: { eq: domainId } } : undefined;
      const result = await client.models.DomainForm.list({ filter });
      return {
        items: result.data.map((item: any) => domainFormSchema.parse(item)),
        nextToken: result.nextToken || undefined
      };
    } catch (error) {
      throw new AmplifyError('Failed to list domain forms', error);
    }
  }

  // ==================== PROJECT OPERATIONS ====================
  
  async createProject(data: CreateProjectInput): Promise<Project> {
    try {
      const validatedData = createProjectInputSchema.parse(data);
      const result = await client.models.Project.create(validatedData);
      
      if (!result.data) {
        throw new Error('No data returned from create operation');
      }
      
      return result.data as Project;
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid project data', error);
      }
      throw new AmplifyError('Failed to create project', error);
    }
  }

  async getProject(id: string): Promise<Project> {
    try {
      const result = await client.models.Project.get({ id });
      if (!result) {
        throw new Error('Project not found');
      }
      return projectSchema.parse(result.data);
    } catch (error) {
      throw new AmplifyError('Failed to get project', error);
    }
  }

  async updateProject(id: string, data: UpdateProjectInput): Promise<Project> {
    try {
      const validatedData = updateProjectInputSchema.parse(data);
      const result = await client.models.Project.update({ id, ...validatedData });
      return projectSchema.parse(result.data);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid project data', error);
      }
      throw new AmplifyError('Failed to update project', error);
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      await client.models.Project.delete({ id });
    } catch (error) {
      throw new AmplifyError('Failed to delete project', error);
    }
  }

  async listProjects(query?: ProjectQuery & Pagination): Promise<{ items: Project[]; nextToken?: string }> {
    try {
      // console.log("=== listProjects called with query ===", query);
      
      const validatedQuery = {
        ...paginationSchema.parse(query || {}),
        ...projectQuerySchema.parse(query || {})
      };
      
      // console.log("=== validatedQuery ===", validatedQuery);
      
      const filter: any = {};
      if (validatedQuery.domainId) filter.domainId = { eq: validatedQuery.domainId };
      if (validatedQuery.areaId) filter.areaId = { eq: validatedQuery.areaId };
      if (validatedQuery.deleted !== undefined) filter.deleted = { eq: validatedQuery.deleted };

      // console.log("=== filter ===", filter);

      const result = await client.models.Project.list({
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        limit: validatedQuery.limit,
        nextToken: validatedQuery.nextToken
      });

      // console.log("=== listProjects result ===", result);

      return {
        items: result.data.map((item: any) => projectSchema.parse(item)),
        nextToken: result.nextToken || undefined
      };
    } catch (error) {
      console.error("=== listProjects error details ===", {
        error,
        name: (error as any).name,
        message: (error as any).message,
        code: (error as any).code,
        stack: (error as any).stack
      });
      
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid query parameters', error);
      }
      throw new AmplifyError('Failed to list projects', error);
    }
  }

  // ==================== SERVICE OPERATIONS ====================
  
  async createService(data: CreateServiceInput): Promise<Service> {
    try {
      const validatedData = createServiceInputSchema.parse(data);
      const result = await client.models.Service.create(validatedData);
      
      if (!result.data) {
        throw new Error('No data returned from create operation');
      }
      
      return result.data as Service;
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid service data', error);
      }
      throw new AmplifyError('Failed to create service', error);
    }
  }

  async getService(id: string): Promise<Service> {
    try {
      const result = await client.models.Service.get({ id });
      if (!result) {
        throw new Error('Service not found');
      }
      return serviceSchema.parse(result.data);
    } catch (error) {
      throw new AmplifyError('Failed to get service', error);
    }
  }

  async updateService(id: string, data: UpdateServiceInput): Promise<Service> {
    try {
      const validatedData = updateServiceInputSchema.parse(data);
      const result = await client.models.Service.update({ id, ...validatedData });
      return serviceSchema.parse(result.data);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid service data', error);
      }
      throw new AmplifyError('Failed to update service', error);
    }
  }

  async deleteService(id: string): Promise<void> {
    try {
      await client.models.Service.delete({ id });
    } catch (error) {
      throw new AmplifyError('Failed to delete service', error);
    }
  }

  async listServices(query?: ServiceQuery & Pagination): Promise<{ items: Service[]; nextToken?: string }> {
    try {
      // Validar query de forma más robusta
      const validatedQuery = {
        ...paginationSchema.parse(query || {}),
        ...serviceQuerySchema.parse(query || {})
      };
      
      const filter: any = {};
      if (validatedQuery.projectId) filter.projectId = { eq: validatedQuery.projectId };
      if (validatedQuery.deleted !== undefined) filter.deleted = { eq: validatedQuery.deleted };

      const result = await client.models.Service.list({
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        limit: validatedQuery.limit,
        nextToken: validatedQuery.nextToken
      });

      return {
        items: result.data.map((item: any) => serviceSchema.parse(item)),
        nextToken: result.nextToken || undefined
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid query parameters', error);
      }
      throw new AmplifyError('Failed to list services', error);
    }
  }

  // ==================== TASK OPERATIONS ====================
  
  async createTask(data: CreateTaskInput): Promise<Task> {
    try {
      const validatedData = createTaskInputSchema.parse(data);
      
      const result = await client.models.Task.create(validatedData);
      
      if (!result.data) {
        throw new Error('No data returned from create operation');
      }
      
      return result.data as Task;
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid task data', error);
      }
      throw new AmplifyError('Failed to create task', error);
    }
  }

  async getTask(id: string): Promise<Task> {
    try {
      const result = await client.models.Task.get({ id });
      if (!result) {
        throw new Error('Task not found');
      }
      return taskSchema.parse(result.data);
    } catch (error) {
      throw new AmplifyError('Failed to get task', error);
    }
  }

  async updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
    try {
      const validatedData = updateTaskInputSchema.parse(data);      
      const result = await client.models.Task.update({ id, ...validatedData });
      return taskSchema.parse(result.data);
    } catch (error) {      
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid task data', error);
      }
      throw new AmplifyError('Failed to update task', error);
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await client.models.Task.delete({ id });
    } catch (error) {
      throw new AmplifyError('Failed to delete task', error);
    }
  }

  async listTasks(query?: TaskQuery & Pagination): Promise<{ items: Task[]; nextToken?: string }> {
    try {
      // Validar query de forma más robusta
      const validatedQuery = {
        ...paginationSchema.parse(query || {}),
        ...taskQuerySchema.parse(query || {})
      };
      
      const filter: any = {};
      if (validatedQuery.projectId) filter.projectId = { eq: validatedQuery.projectId };
      if (validatedQuery.serviceId) filter.serviceId = { eq: validatedQuery.serviceId };
      if (validatedQuery.taskType) filter.taskType = { eq: validatedQuery.taskType };
      if (validatedQuery.userEmail) filter.userEmail = { eq: validatedQuery.userEmail };
      if (validatedQuery.deleted !== undefined) filter.deleted = { eq: validatedQuery.deleted };
      if (validatedQuery.workspaceId) filter.workspaceId = { eq: validatedQuery.workspaceId };
      if (validatedQuery.seasonId) filter.seasonId = { eq: validatedQuery.seasonId };
      if (validatedQuery.farmId) filter.farmId = { eq: validatedQuery.farmId };

      const result = await client.models.Task.list({
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        limit: validatedQuery.limit,
        nextToken: validatedQuery.nextToken
      });

      return {
        items: result.data.map((item: any) => taskSchema.parse(item)),
        nextToken: result.nextToken || undefined
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid query parameters', error);
      }
      throw new AmplifyError('Failed to list tasks', error);
    }
  }

  // ==================== UNIFIED TASK OPERATIONS ====================
  
  /**
   * Unified method to create or update a task
   * This method handles the complete task lifecycle using fieldIdsOnlyIncluded
   */
  async processUnifiedTaskOperation(data: UnifiedTaskOperation): Promise<{ task: Task; fieldIds: number[] }> {
    try {
      // console.log("Processing unified task operation with data:", data);
      
      const validatedData = unifiedTaskOperationSchema.parse(data);
      // console.log("Data validated successfully:", validatedData);
      
      if (validatedData.operation === 'create') {
        // console.log("Creating new task...");
        return await this.createTaskWith360Data(validatedData);
      } else {
        // console.log("Updating existing task...");
        return await this.updateTaskWith360Data(validatedData);
      }
    } catch (error) {
      console.error("Error in processUnifiedTaskOperation:", error);
      
      if (error instanceof Error && error.name === 'ZodError') {
        console.error("Validation error details:", error);
        throw new ValidationError('Invalid unified task operation data', error);
      }
      
      // Log the original error for debugging
      if (error instanceof Error) {
        console.error("Original error message:", error.message);
        console.error("Original error stack:", error.stack);
      }
      
      throw new AmplifyError('Failed to process unified task operation', error);
    }
  }

  /**
   * Create a new task with 360 Farm data
   */
  private async createTaskWith360Data(data: UnifiedTaskOperation): Promise<{ task: Task; fieldIds: number[] }> {
    // Create the task with 360 Farm data
    const taskData: CreateTaskInput = {
      projectId: data.projectId,
      serviceId: data.serviceId,
      taskName: data.taskName,
      taskType: data.taskType,
      userEmail: data.userEmail,
      taskData: data.taskData,
      formId: data.formId,
      workspaceId: data.workspaceId,
      workspaceName: data.workspaceName,
      seasonId: data.seasonId,
      seasonName: data.seasonName,
      farmId: data.farmId,
      farmName: data.farmName,
      fieldIdsOnlyIncluded: data.fieldIdsOnlyIncluded,
    };

    const task = await this.createTask(taskData);

    return { 
      task, 
      fieldIds: data.fieldIdsOnlyIncluded || [] 
    };
  }

  /**
   * Update an existing task with 360 Farm data
   */
  private async updateTaskWith360Data(data: UnifiedTaskOperation): Promise<{ task: Task; fieldIds: number[] }> {
    if (!data.taskId) {
      throw new Error('Task ID is required for update operations');
    }

    // Update the task with 360 Farm data
    const taskData: UpdateTaskInput = {
      taskName: data.taskName,
      taskType: data.taskType,
      userEmail: data.userEmail,
      taskData: data.taskData,
      serviceId: data.serviceId,
      formId: data.formId,
      workspaceId: data.workspaceId,
      workspaceName: data.workspaceName,
      seasonId: data.seasonId,
      seasonName: data.seasonName,
      farmId: data.farmId,
      farmName: data.farmName,
      fieldIdsOnlyIncluded: data.fieldIdsOnlyIncluded,
    };

    const task = await this.updateTask(data.taskId, taskData);

    return { 
      task, 
      fieldIds: data.fieldIdsOnlyIncluded || [] 
    };
  }

  
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types for convenience
export type {
  DomainProtocol,
  DomainForm, 
  Project,
  Service,
  Task,  
  CreateProjectInput,
  UpdateProjectInput,
  CreateServiceInput,
  UpdateServiceInput,
  CreateTaskInput,
  UpdateTaskInput,
  ProjectQuery,
  ServiceQuery,
  TaskQuery,
  Pagination  
};
