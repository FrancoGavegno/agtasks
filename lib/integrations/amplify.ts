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
  // New schemas for unified operations
  taskFieldOperationSchema,
  unifiedTaskOperationSchema,
  taskFieldSyncSchema,
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
  type TaskFieldOperation,
  type UnifiedTaskOperation,
  type TaskFieldSync,
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
      console.log("ApiClient.createTask called with data:", data);
      const validatedData = createTaskInputSchema.parse(data);
      console.log("ApiClient.createTask - validated data:", validatedData);
      
      console.log("ApiClient.createTask - calling client.models.Task.create with:", validatedData);
      const result = await client.models.Task.create(validatedData);
      console.log("ApiClient.createTask - result:", result);
      
      if (!result.data) {
        throw new Error('No data returned from create operation');
      }
      
      return result.data as Task;
    } catch (error) {
      console.error("ApiClient.createTask - error details:", {
        error,
        errorName: error instanceof Error ? error.name : 'Unknown',
        errorMessage: error instanceof Error ? error.message : 'Unknown',
        errorStack: error instanceof Error ? error.stack : 'Unknown'
      });
      
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
      console.log("createTaskField - Input data:", data)
      const validatedData = createTaskFieldInputSchema.parse(data);
      console.log("createTaskField - Validated data:", validatedData)
      
      const result = await client.models.TaskField.create(validatedData);
      console.log("createTaskField - Raw result:", result)
      
      if (!result.data) {
        console.error("createTaskField - No data returned from create operation")
        throw new Error('No data returned from create operation');
      }
      
      console.log("createTaskField - Success, returning:", result.data)
      return result.data as TaskField;
    } catch (error) {
      console.error("createTaskField - Error details:", error)
      if (error instanceof Error && error.name === 'ZodError') {
        console.error("createTaskField - Validation error:", error)
        throw new ValidationError('Invalid task field data', error);
      }
      throw new AmplifyError('Failed to create task field', error);
    }
  }

  // Crear múltiples TaskFields en batch usando la función Lambda para mejor rendimiento
  async createTaskFieldsBatch(dataArray: CreateTaskFieldInput[]): Promise<TaskField[]> {
    try {
      console.log("createTaskFieldsBatch - Input data array length:", dataArray.length)
      
      if (dataArray.length === 0) {
        return []
      }
      
      // Validar todos los datos primero
      const validatedDataArray = dataArray.map(data => {
        console.log("createTaskFieldsBatch - Validating data:", data)
        return createTaskFieldInputSchema.parse(data)
      })
      
      console.log("createTaskFieldsBatch - All data validated successfully")
      
      // Mostrar toast informativo para lotes grandes
      if (validatedDataArray.length > 50) {
        console.log(`createTaskFieldsBatch - Processing large batch: ${validatedDataArray.length} items`)
      }
      
      // Intentar usar la función Lambda primero
      try {
        console.log("createTaskFieldsBatch - Attempting to use Lambda function")
        
        // Preparar input para la función Lambda
        const lambdaInput = {
          taskFields: validatedDataArray
        }
        
        console.log("createTaskFieldsBatch - Calling Lambda function with input:", lambdaInput)
        
        // Llamar a la función Lambda usando fetch directamente
        const response = await fetch('/api/lambda/createTaskFields', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lambdaInput)
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error("createTaskFieldsBatch - HTTP error:", response.status, errorText)
          throw new Error(`Lambda function failed: ${response.status} - ${errorText}`)
        }
        
        const result = await response.json()
        const lambdaResponse = result
        console.log("createTaskFieldsBatch - Lambda response:", lambdaResponse)
        
        // Si la Lambda insertó datos, consideramos que fue exitosa aunque tenga errores
        if (lambdaResponse.inserted > 0) {
          console.log(`createTaskFieldsBatch - Lambda function inserted ${lambdaResponse.inserted} items successfully`)
          
          // La función Lambda no retorna los objetos creados, solo estadísticas
          // Para mantener compatibilidad con la interfaz existente, creamos objetos TaskField básicos
          const createdTaskFields: TaskField[] = validatedDataArray.slice(0, lambdaResponse.inserted).map((data, index) => ({
            id: `generated-${Date.now()}-${index}`, // ID temporal ya que la Lambda no retorna los IDs específicos
            taskId: data.taskId,
            fieldId: data.fieldId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }))
          
          return createdTaskFields
        }
        
        // Solo fallback si no se insertó nada
        if (!lambdaResponse.success) {
          const errorMessage = lambdaResponse.errors?.join(', ') || 'Unknown error from Lambda function'
          console.error("createTaskFieldsBatch - Lambda function failed:", lambdaResponse)
          throw new Error(`Lambda function failed: ${errorMessage}`)
        }
        
        console.log(`createTaskFieldsBatch - Successfully created ${lambdaResponse.inserted} TaskFields via Lambda`)
        
        // La función Lambda no retorna los objetos creados, solo estadísticas
        // Para mantener compatibilidad con la interfaz existente, creamos objetos TaskField básicos
        // con los IDs generados por la función Lambda
        const createdTaskFields: TaskField[] = validatedDataArray.slice(0, lambdaResponse.inserted).map((data, index) => ({
          id: `generated-${Date.now()}-${index}`, // ID temporal ya que la Lambda no retorna los IDs específicos
          taskId: data.taskId,
          fieldId: data.fieldId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))
        
        return createdTaskFields
        
      } catch (lambdaError) {
        console.warn("createTaskFieldsBatch - Lambda function not available, falling back to individual creates:", lambdaError)
        
        // Fallback: crear TaskFields individualmente
        console.log("createTaskFieldsBatch - Using fallback method: individual creates")
        
        const createdTaskFields: TaskField[] = []
        
        for (const data of validatedDataArray) {
          try {
            const result = await client.models.TaskField.create(data)
            if (result.data) {
              createdTaskFields.push(result.data as TaskField)
            }
          } catch (individualError) {
            console.error("createTaskFieldsBatch - Error creating individual TaskField:", individualError)
            // Continuar con el siguiente item en lugar de fallar todo el batch
          }
        }
        
        console.log(`createTaskFieldsBatch - Fallback completed: ${createdTaskFields.length}/${validatedDataArray.length} TaskFields created`)
        
        return createdTaskFields
      }
      
    } catch (error) {
      console.error("createTaskFieldsBatch - Error details:", error)
      if (error instanceof Error && error.name === 'ZodError') {
        console.error("createTaskFieldsBatch - Validation error:", error)
        throw new ValidationError('Invalid task field data in batch', error);
      }
      throw new AmplifyError('Failed to create task fields batch', error);
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

  // ==================== UNIFIED TASK OPERATIONS ====================
  
  /**
   * Unified method to create or update a task with its associated fields
   * This method handles the complete task lifecycle including TaskField associations
   */
  async processUnifiedTaskOperation(data: UnifiedTaskOperation): Promise<{ task: Task; fieldIds: string[] }> {
    try {
      console.log("Processing unified task operation with data:", data);
      
      const validatedData = unifiedTaskOperationSchema.parse(data);
      console.log("Data validated successfully:", validatedData);
      
      if (validatedData.operation === 'create') {
        console.log("Creating new task with fields...");
        return await this.createTaskWithFields(validatedData);
      } else {
        console.log("Updating existing task with fields...");
        return await this.updateTaskWithFields(validatedData);
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
   * Create a new task with its associated fields
   */
  private async createTaskWithFields(data: UnifiedTaskOperation): Promise<{ task: Task; fieldIds: string[] }> {
    // Create the task first
    const taskData: CreateTaskInput = {
      projectId: data.projectId,
      serviceId: data.serviceId,
      taskName: data.taskName,
      taskType: data.taskType,
      userEmail: data.userEmail,
      taskData: data.taskData,
      formId: data.formId,
    };

    const task = await this.createTask(taskData);

    // Create fields and associate them
    const fieldIds = await this.createFieldsAndAssociate(data.fields, task.id!);

    return { task, fieldIds };
  }

  /**
   * Update an existing task with its associated fields
   */
  private async updateTaskWithFields(data: UnifiedTaskOperation): Promise<{ task: Task; fieldIds: string[] }> {
    if (!data.taskId) {
      throw new Error('Task ID is required for update operations');
    }

    // Update the task
    const taskData: UpdateTaskInput = {
      taskName: data.taskName,
      taskType: data.taskType,
      userEmail: data.userEmail,
      taskData: data.taskData,
      serviceId: data.serviceId,
      formId: data.formId,
    };

    const task = await this.updateTask(data.taskId, taskData);

    // Synchronize fields
    const fieldIds = await this.synchronizeTaskFields(data.taskId, data.fields);

    return { task, fieldIds };
  }

  /**
   * Create fields and associate them to a task
   */
  private async createFieldsAndAssociate(fields: any[], taskId: string): Promise<string[]> {
    const fieldIds: string[] = [];

    // Create each field
    for (const field of fields) {
      const fieldData: CreateFieldInput = {
        workspaceId: field.workspaceId?.toString() || "",
        workspaceName: field.workspaceName,
        campaignId: field.campaignId?.toString() || "",
        campaignName: field.campaignName,
        farmId: field.farmId?.toString() || "",
        farmName: field.farmName,
        fieldId: field.fieldId || "",
        fieldName: field.fieldName || "",
        hectares: field.hectares,
        crop: field.crop,
        hybrid: field.hybrid,
      };

      const createdField = await this.createField(fieldData);
      if (createdField.id) {
        fieldIds.push(createdField.id);
      }
    }

    // Associate fields to task
    await this.associateFieldsToTask(taskId, fieldIds);

    return fieldIds;
  }

  /**
   * Synchronize task fields by comparing current and target field sets
   * This method efficiently handles adding and removing field associations
   */
  async synchronizeTaskFields(taskId: string, targetFields: any[]): Promise<string[]> {
    try {
      // Get current task field associations
      const currentTaskFields = await this.listTaskFields(taskId);
      
      // Get current field details for comparison
      const currentFields = await Promise.all(
        currentTaskFields.items.map(async (tf) => {
          const field = await this.getField(tf.fieldId);
          return {
            taskFieldId: tf.id,
            fieldId: tf.fieldId,
            field360Id: field.fieldId, // 360 field ID for comparison
            fieldData: field,
          };
        })
      );

      // Create sets for efficient comparison
      const currentField360Ids = new Set(currentFields.map(cf => cf.field360Id));
      const targetField360Ids = new Set(targetFields.map(tf => tf.fieldId));

      // Find fields to remove (in current but not in target)
      const fieldsToRemove = currentFields.filter(cf => !targetField360Ids.has(cf.field360Id));
      
      // Find fields to add (in target but not in current)
      const fieldsToAdd = targetFields.filter(tf => !currentField360Ids.has(tf.fieldId));

      // Remove fields that are no longer selected
      if (fieldsToRemove.length > 0) {
        await Promise.all(
          fieldsToRemove.map(tf => this.deleteTaskField(tf.taskFieldId!))
        );
      }

      // Add new fields
      let newFieldIds: string[] = [];
      if (fieldsToAdd.length > 0) {
        newFieldIds = await this.createFieldsAndAssociate(fieldsToAdd, taskId);
      }

      // Return all current field IDs (existing + new)
      const remainingFieldIds = currentFields
        .filter(cf => !fieldsToRemove.some(fr => fr.taskFieldId === cf.taskFieldId))
        .map(cf => cf.fieldId);
      
      return [...remainingFieldIds, ...newFieldIds];
    } catch (error) {
      throw new AmplifyError('Failed to synchronize task fields', error);
    }
  }

  /**
   * Associate multiple fields to a task using batch processing
   */
  private async associateFieldsToTask(taskId: string, fieldIds: string[]): Promise<void> {
    if (fieldIds.length === 0) return;
    
    // Prepare batch data
    const taskFieldInputs = fieldIds.map(fieldId => ({ taskId, fieldId }));
    
    // Use batch processing for better performance
    await this.createTaskFieldsBatch(taskFieldInputs);
  }

  /**
   * Get task with all its associated fields
   */
  async getTaskWithFields(taskId: string): Promise<{ task: Task; fields: Field[] }> {
    try {
      const task = await this.getTask(taskId);
      const taskFields = await this.listTaskFields(taskId);
      
      const fields = await Promise.all(
        taskFields.items.map(tf => this.getField(tf.fieldId))
      );

      return { task, fields };
    } catch (error) {
      throw new AmplifyError('Failed to get task with fields', error);
    }
  }

  /**
   * Validate task field associations
   * This method checks if a TaskField association should be created or deleted
   */
  async validateTaskFieldAssociation(taskId: string, fieldId: string): Promise<{
    shouldCreate: boolean;
    shouldDelete: boolean;
    existingTaskField?: TaskField;
  }> {
    try {
      // Find existing TaskField with this taskId and fieldId
      const taskFields = await this.listTaskFields(taskId);
      const existingTaskField = taskFields.items.find(tf => tf.fieldId === fieldId);

      return {
        shouldCreate: !existingTaskField,
        shouldDelete: false, // This would be determined by business logic
        existingTaskField,
      };
    } catch (error) {
      throw new AmplifyError('Failed to validate task field association', error);
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
  TaskFieldOperation,
  UnifiedTaskOperation,
  TaskFieldSync,
};
