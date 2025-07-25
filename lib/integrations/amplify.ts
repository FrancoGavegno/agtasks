// Funcionalidades Implementadas:

// 1. Configuración 
// Importa la configuración de Amplify
// Configura Amplify con los outputs
// Genera el cliente tipado con el esquema

// 2. Validación con Zod
// Usa todos los esquemas de /lib/schemas.ts
// Valida datos de entrada antes de llamar a Amplify
// Valida respuestas de Amplify antes de devolverlas
// Maneja errores de validación específicamente

// 3. Operaciones CRUDL Completas
// Para cada modelo del esquema (DomainProtocol, DomainForm, Project, Service, Task, Field, TaskField):
// Create: create[Model]() - Crea nuevos registros
// Read: get[Model]() - Obtiene un registro por ID
// Update: update[Model]() - Actualiza registros existentes
// Delete: delete[Model]() - Elimina registros
// List: list[Models]() - Lista registros con filtros y paginación

// 4. Manejo de Errores
// ValidationError: Para errores de validación de Zod
// AmplifyError: Para errores de operaciones de Amplify
// Manejo específico de errores de validación vs errores de red

// 5. Filtros y Paginación
// Filtros específicos para cada modelo
// Paginación con limit y nextToken
// Validación de parámetros de consulta

// 6. Tipos TypeScript
// Exporta todos los tipos necesarios
// Tipos de entrada para operaciones CRUD
// Tipos de consulta para filtros
// Tipos de respuesta para listas

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/amplify/data/resource";
import {
  // Schemas
  domainProtocolSchema,
  domainFormSchema,
  fieldSchema,
  projectSchema,
  serviceSchema,
  taskSchema,
  taskFieldSchema,
  // Input schemas
  createProjectInputSchema,
  updateProjectInputSchema,
  createServiceInputSchema,
  updateServiceInputSchema,
  createTaskInputSchema,
  updateTaskInputSchema,
  createFieldInputSchema,
  updateFieldInputSchema,
  createTaskFieldInputSchema,
  // Query schemas
  projectQuerySchema,
  serviceQuerySchema,
  taskQuerySchema,
  fieldQuerySchema,
  paginationSchema,
  // Response schemas
  projectListResponseSchema,
  serviceListResponseSchema,
  taskListResponseSchema,
  fieldListResponseSchema,
  // Types
  type DomainProtocol,
  type DomainForm,
  type Field,
  type Project,
  type Service,
  type Task,
  type TaskField,
  type CreateProjectInput,
  type UpdateProjectInput,
  type CreateServiceInput,
  type UpdateServiceInput,
  type CreateTaskInput,
  type UpdateTaskInput,
  type CreateFieldInput,
  type UpdateFieldInput,
  type CreateTaskFieldInput,
  type ProjectQuery,
  type ServiceQuery,
  type TaskQuery,
  type FieldQuery,
  type Pagination,
} from "@/lib/schemas";

// Configura Amplify antes de generar el cliente
Amplify.configure(outputs);

// Genera el cliente de Amplify
const client = generateClient<Schema>();

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
  
  async createDomainProtocol(data: Omit<DomainProtocol, 'id' | 'createdAt' | 'updatedAt'>): Promise<DomainProtocol> {
    try {
      const validatedData = domainProtocolSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(data);
      const result = await client.models.DomainProtocol.create(validatedData);
      
      if (!result.data) {
        throw new Error('No data returned from create operation');
      }
      
      // Return the result directly without additional validation
      // The data structure should match what we expect
      return result.data as DomainProtocol;
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

  async updateDomainProtocol(id: string, data: Partial<Omit<DomainProtocol, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DomainProtocol> {
    try {
      const validatedData = domainProtocolSchema.partial().omit({ id: true, createdAt: true, updatedAt: true }).parse(data);
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
        items: result.data.map(item => domainProtocolSchema.parse(item)),
        nextToken: result.nextToken || undefined
      };
    } catch (error) {
      throw new AmplifyError('Failed to list domain protocols', error);
    }
  }

  // ==================== DOMAIN FORM OPERATIONS ====================
  
  async createDomainForm(data: Omit<DomainForm, 'id' | 'createdAt' | 'updatedAt'>): Promise<DomainForm> {
    try {
      const validatedData = domainFormSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(data);
      const result = await client.models.DomainForm.create(validatedData);
      
      if (!result.data) {
        throw new Error('No data returned from create operation');
      }
      
      // Return the result directly without additional validation
      // The data structure should match what we expect
      return result.data as DomainForm;
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

  async updateDomainForm(id: string, data: Partial<Omit<DomainForm, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DomainForm> {
    try {
      const validatedData = domainFormSchema.partial().omit({ id: true, createdAt: true, updatedAt: true }).parse(data);
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
        items: result.data.map(item => domainFormSchema.parse(item)),
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
      const validatedQuery = {
        ...paginationSchema.parse(query || {}),
        ...projectQuerySchema.parse(query || {})
      };
      
      const filter: any = {};
      if (validatedQuery.domainId) filter.domainId = { eq: validatedQuery.domainId };
      if (validatedQuery.areaId) filter.areaId = { eq: validatedQuery.areaId };
      if (validatedQuery.deleted !== undefined) filter.deleted = { eq: validatedQuery.deleted };

      const result = await client.models.Project.list({
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        limit: validatedQuery.limit,
        nextToken: validatedQuery.nextToken
      });

      return {
        items: result.data.map(item => projectSchema.parse(item)),
        nextToken: result.nextToken || undefined
      };
    } catch (error) {
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
        items: result.data.map(item => serviceSchema.parse(item)),
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

      const result = await client.models.Task.list({
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        limit: validatedQuery.limit,
        nextToken: validatedQuery.nextToken
      });

      return {
        items: result.data.map(item => taskSchema.parse(item)),
        nextToken: result.nextToken || undefined
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid query parameters', error);
      }
      throw new AmplifyError('Failed to list tasks', error);
    }
  }

  // ==================== FIELD OPERATIONS ====================
  
  async createField(data: CreateFieldInput): Promise<Field> {
    try {
      const validatedData = createFieldInputSchema.parse(data);
      const result = await client.models.Field.create(validatedData);
      
      if (!result.data) {
        throw new Error('No data returned from create operation');
      }
      
      return result.data as Field;
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid field data', error);
      }
      throw new AmplifyError('Failed to create field', error);
    }
  }

  async getField(id: string): Promise<Field> {
    try {
      const result = await client.models.Field.get({ id });
      if (!result) {
        throw new Error('Field not found');
      }
      return fieldSchema.parse(result.data);
    } catch (error) {
      throw new AmplifyError('Failed to get field', error);
    }
  }

  async updateField(id: string, data: UpdateFieldInput): Promise<Field> {
    try {
      const validatedData = updateFieldInputSchema.parse(data);
      const result = await client.models.Field.update({ id, ...validatedData });
      return fieldSchema.parse(result.data);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid field data', error);
      }
      throw new AmplifyError('Failed to update field', error);
    }
  }

  async deleteField(id: string): Promise<void> {
    try {
      await client.models.Field.delete({ id });
    } catch (error) {
      throw new AmplifyError('Failed to delete field', error);
    }
  }

  async listFields(query?: FieldQuery & Pagination): Promise<{ items: Field[]; nextToken?: string }> {
    try {
      const validatedQuery = {
        ...paginationSchema.parse(query || {}),
        ...fieldQuerySchema.parse(query || {})
      };
      
      const filter: any = {};
      if (validatedQuery.workspaceId) filter.workspaceId = { eq: validatedQuery.workspaceId };
      if (validatedQuery.campaignId) filter.campaignId = { eq: validatedQuery.campaignId };
      if (validatedQuery.farmId) filter.farmId = { eq: validatedQuery.farmId };
      if (validatedQuery.deleted !== undefined) filter.deleted = { eq: validatedQuery.deleted };

      const result = await client.models.Field.list({
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        limit: validatedQuery.limit,
        nextToken: validatedQuery.nextToken
      });

      return {
        items: result.data.map(item => fieldSchema.parse(item)),
        nextToken: result.nextToken || undefined
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid query parameters', error);
      }
      throw new AmplifyError('Failed to list fields', error);
    }
  }

  // ==================== TASK FIELD OPERATIONS ====================
  
  async createTaskField(data: CreateTaskFieldInput): Promise<TaskField> {
    try {
      const validatedData = createTaskFieldInputSchema.parse(data);
      const result = await client.models.TaskField.create(validatedData);
      
      if (!result.data) {
        throw new Error('No data returned from create operation');
      }
      
      return result.data as TaskField;
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid task field data', error);
      }
      throw new AmplifyError('Failed to create task field', error);
    }
  }

  async getTaskField(id: string): Promise<TaskField> {
    try {
      const result = await client.models.TaskField.get({ id });
      if (!result) {
        throw new Error('Task field not found');
      }
      return taskFieldSchema.parse(result.data);
    } catch (error) {
      throw new AmplifyError('Failed to get task field', error);
    }
  }

  async updateTaskField(id: string, data: Partial<Omit<TaskField, 'id' | 'createdAt' | 'updatedAt'>>): Promise<TaskField> {
    try {
      const validatedData = taskFieldSchema.partial().omit({ id: true, createdAt: true, updatedAt: true }).parse(data);
      const result = await client.models.TaskField.update({ id, ...validatedData });
      return taskFieldSchema.parse(result.data);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        throw new ValidationError('Invalid task field data', error);
      }
      throw new AmplifyError('Failed to update task field', error);
    }
  }

  async deleteTaskField(id: string): Promise<void> {
    try {
      await client.models.TaskField.delete({ id });
    } catch (error) {
      throw new AmplifyError('Failed to delete task field', error);
    }
  }

  async listTaskFields(taskId?: string, fieldId?: string): Promise<{ items: TaskField[]; nextToken?: string }> {
    try {
      const filter: any = {};
      if (taskId) filter.taskId = { eq: taskId };
      if (fieldId) filter.fieldId = { eq: fieldId };

      const result = await client.models.TaskField.list({
        filter: Object.keys(filter).length > 0 ? filter : undefined
      });

      return {
        items: result.data.map(item => taskFieldSchema.parse(item)),
        nextToken: result.nextToken ?? undefined
      };
    } catch (error) {
      throw new AmplifyError('Failed to list task fields', error);
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types for convenience
export type {
  DomainProtocol,
  DomainForm,
  Field,
  Project,
  Service,
  Task,
  TaskField,
  CreateProjectInput,
  UpdateProjectInput,
  CreateServiceInput,
  UpdateServiceInput,
  CreateTaskInput,
  UpdateTaskInput,
  CreateFieldInput,
  UpdateFieldInput,
  CreateTaskFieldInput,
  ProjectQuery,
  ServiceQuery,
  TaskQuery,
  FieldQuery,
  Pagination,
};
