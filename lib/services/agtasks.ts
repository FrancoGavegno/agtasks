import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/amplify/data/resource";
import { ServiceFormFullValues } from "@/components/services/validation-schemas";

// Amplify configuration - Singleton Client
let clientInstance: ReturnType<typeof generateClient<Schema>> | null = null;
let configured = false;

export function getClient() {
  if (!configured) {
    Amplify.configure(outputs);
    configured = true;
  }
  if (!clientInstance) {
    clientInstance = generateClient<Schema>();
  }
  return clientInstance;
}

// Domain Protocols 
export async function createDomainProtocol(
  domainId: string,
  data: { tmProtocolId: string; name: string; language: string },
) {
  try {
    const client = getClient();
    const response: { data: Schema["DomainProtocol"]["type"] | null; errors?: any[] } = await client.models.DomainProtocol.create({
      domainId,
      tmProtocolId: data.tmProtocolId,
      name: data.name,
      language: data.language,
    });

    if (!response.data) {
      throw new Error("Failed to create domain protocol");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating domain protocol in Amplify:", error);
    throw new Error(`Failed to create domain protocol: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteDomainProtocol(domainId: string, protocolId: string) {
  try {
    const client = getClient();
    const response: { data: Schema["DomainProtocol"]["type"] | null; errors?: any[] } = await client.models.DomainProtocol.delete({ id: protocolId });

    if (!response.data) {
      throw new Error(`Failed to delete domain protocol with ID ${protocolId}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error deleting domain protocol from Amplify:", error);
    throw new Error(`Failed to delete domain protocol: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function listDomainProtocols(domainId: string) {
  try {
    const client = getClient();
    const response: { data: Schema["DomainProtocol"]["type"][]; nextToken?: string | null; errors?: any[] } = await client.models.DomainProtocol.list({
      filter: { domainId: { eq: domainId } },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching domain protocols from Amplify:", error);
    throw new Error(`Failed to fetch domain protocols: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Domain Forms 
export async function createDomainForm(
  domainId: string,
  data: { name: string; language: string; ktFormId: string },
) {
  try {
    const client = getClient();
    const response: { data: Schema["DomainForm"]["type"] | null; errors?: any[] } = await client.models.DomainForm.create({
      domainId,
      name: data.name,
      language: data.language,
      ktFormId: data.ktFormId,
    });

    if (!response.data) {
      throw new Error("Failed to create domain form");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating domain form in Amplify:", error);
    throw new Error(`Failed to create domain form: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteDomainForm(domainId: string, formId: string) {
  try {
    const client = getClient();
    const response: { data: Schema["DomainForm"]["type"] | null; errors?: any[] } = await client.models.DomainForm.delete({ id: formId });

    if (!response.data) {
      throw new Error(`Failed to delete domain form with ID ${formId}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error deleting domain form from Amplify:", error);
    throw new Error(`Failed to delete domain form: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function listDomainForms(domainId: string) {
  try {
    const client = getClient();
    const response: { data: Schema["DomainForm"]["type"][]; nextToken?: string | null; errors?: any[] } = await client.models.DomainForm.list({
      filter: { domainId: { eq: domainId } },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching domain forms from Amplify:", error);
    throw new Error(`Failed to fetch domain forms: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// --- PROJECT CRUD ---
/**
 * Crea un nuevo Project
 */
export async function createProject(data: {
  domainId: string
  areaId: string
  serviceDeskId: string
  requestTypeId: string
  name: string
  language?: string
  tmpSourceSystem?: string
  tmpServiceDeskId?: string
  tmpRequestTypeId?: string
  tmpQueueId?: string
  queueId?: string
  deleted?: boolean
}) {
  const client = getClient();
  const response = await client.models.Project.create({
    ...data,
    queueId: data.queueId ? String(data.queueId) : undefined,
    deleted: data.deleted ?? false,
  });
  return response.data;
}

/**
 * Actualiza un Project existente
 */
export async function updateProject(id: string, data: Partial<{
  domainId?: string
  areaId?: string
  serviceDeskId?: string
  requestTypeId?: string
  name?: string
  language?: string
  tmpSourceSystem?: string
  tmpServiceDeskId?: string
  tmpRequestTypeId?: string
  tmpQueueId?: string
  queueId?: string
  deleted?: boolean
}>) {
  const client = getClient();
  const response = await client.models.Project.update({ id, ...data });
  return response.data;
}

/**
 * Elimina lógicamente un Project (soft delete)
 */
export async function deleteProject(id: string) {
  const client = getClient();
  const response = await client.models.Project.update({ id, deleted: true });
  return response.data;
}

/**
 * Obtiene un Project por ID, incluyendo sus Services y Tasks relacionados
 */
export async function getProject(id: string) {
  const client = getClient();
  const response = await client.models.Project.get({ id });
  if (!response.data) return null;
  let servicesData: any[] = [];
  let tasksData: any[] = [];
  if (typeof response.data.services === 'function') {
    const services = await response.data.services();
    servicesData = services.data ?? [];
  }
  if (typeof response.data.tasks === 'function') {
    const tasks = await response.data.tasks();
    tasksData = tasks.data ?? [];
  }
  return {
    ...response.data,
    services: servicesData,
    tasks: tasksData,
  };
}

/**
 * Lista todos los proyectos de un dominio
 */
export async function listProjectsByDomain(domainId: string) {
  const client = getClient();
  const response = await client.models.Project.list({
    filter: { domainId: { eq: domainId }, deleted: { ne: true } },
  });
  return response.data || [];
}

// --- SERVICE CRUD ---
/**
 * Crea un nuevo Service
 */
export async function createService(data: ServiceFormFullValues) {
  const client = getClient();

  const response = await client.models.Service.create({
    name: data.name,
    projectId: data.projectId || "",
    tmpRequestId: data.tmpRequestId,
		requestId: data.requestId,
    protocolId: data.protocolId
  });
    
  return response.data;
}

/**
 * Actualiza un Service existente
 */
export async function updateService(id: string, data: Partial<{
  projectId?: string
  name?: string
  tmpRequestId?: string
  requestId?: string
  deleted?: boolean
}>) {
  const client = getClient();
  const response = await client.models.Service.update({ id, ...data });
  return response.data;
}

/**
 * Elimina lógicamente un Service (soft delete)
 */
export async function deleteService(id: string) {
  const client = getClient();
  const response = await client.models.Service.update({ id, deleted: true });
  return response.data;
}

/**
 * Obtiene un Service por ID, incluyendo su Project y Tasks relacionados
 */
export async function getService(id: string) {
  const client = getClient();
  const response = await client.models.Service.get({ id });
  if (!response.data) return null;
  let projectData = null;
  let tasksData: any[] = [];
  if (typeof response.data.project === 'function') {
    const project = await response.data.project();
    projectData = project.data ?? null;
  }
  if (typeof response.data.tasks === 'function') {
    const tasks = await response.data.tasks();
    tasksData = tasks.data ?? [];
  }
  return {
    ...response.data,
    project: projectData,
    tasks: tasksData,
  };
}

/**
 * Lista todos los servicios de un proyecto
 */
export async function listServicesByProject(projectId: string) {
  const client = getClient();
  const response = await client.models.Service.list({
    filter: { projectId: { eq: projectId }, deleted: { ne: true } },
  });
  return response.data || [];
}

// --- TASK CRUD ---
/**
 * Crea un nuevo Task
 */
export async function createTask(data: {
  projectId?: string
  serviceId?: string
  tmpSubtaskId: string
  subtaskId?: string
  taskName: string
  taskType: string
  userEmail: string
  formId?: string
}) {
  const client = getClient();
  const response = await client.models.Task.create(data);
  return response.data;
}

/**
 * Actualiza un Task existente
 */
export async function updateTask(id: string, data: Partial<{
  projectId?: string
  serviceId?: string
  tmpSubtaskId?: string
  subtaskId?: string
  taskName?: string
  taskType?: string
  taskData?: any
  userEmail?: string
  deleted?: boolean
}>) {
  const client = getClient();
  const response = await client.models.Task.update({ id, ...data });
  return response.data;
}

/**
 * Elimina lógicamente un Task (soft delete)
 */
export async function deleteTask(id: string) {
  const client = getClient();
  const response = await client.models.Task.update({ id, deleted: true });
  return response.data;
}

/**
 * Obtiene un Task por ID
 */
export async function getTask(id: string) {
  const client = getClient();
  const response = await client.models.Task.get({ id });
  if (!response.data) return null;
  return response.data;
}

/**
 * Lista todas las ServiceTasks de un proyecto
 */
export async function listTasksByProject(projectId: string) {
  const client = getClient();
  const response = await client.models.Task.list({
    filter: { projectId: { eq: projectId }, deleted: { ne: true } },
  });
  return response.data || [];
}

/**
 * Crea un nuevo TaskField
 */
export async function createTaskField(data: {
  taskId: string
  fieldId: string
}) {
  const client = getClient();
  const response = await client.models.TaskField.create(data);
  return response.data;
}

// --- FIELD CRUD ---
/**
 * Crea un nuevo Field
*/
export async function createField(data: {
  workspaceId: string
  workspaceName?: string
  campaignId: string
  campaignName?: string
  farmId: string
  farmName?: string
  fieldId: string
  fieldName: string
  hectares?: number
  crop?: string
  hybrid?: string
}) {
  const client = getClient();
  const response = await client.models.Field.create(data);
  return response.data;
}

/**
 * Actualiza un Field existente
 */
export async function updateField(id: string, data: Partial<{
  workspaceId?: string
  workspaceName?: string
  campaignId?: string
  campaignName?: string
  farmId?: string
  farmName?: string
  fieldId?: string
  fieldName?: string
  hectares?: number
  crop?: string
  hybrid?: string
  deleted?: boolean
}>) {
  const client = getClient();
  const response = await client.models.Field.update({ id, ...data });
  return response.data;
}

/**
 * Elimina lógicamente un Field (soft delete)
 */
export async function deleteField(id: string) {
  const client = getClient();
  const response = await client.models.Field.update({ id, deleted: true });
  return response.data;
}

/**
 * Obtiene un Field por ID
 */
export async function getField(id: string) {
  const client = getClient();
  const response = await client.models.Field.get({ id });
  if (!response.data) return null;
  return response.data;
}

