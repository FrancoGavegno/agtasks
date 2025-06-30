import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { generateClient } from "aws-amplify/api";
import { data, type Schema } from "@/amplify/data/resource";
import type {
  Project,
  Service,
  Role,
  ServiceTask,
  ServiceField
} from "@/lib/interfaces";
import {
  type CreateServiceFormValues,
  type SelectedLotDetail
} from "@/components/projects/validation-schemas"
import {
  createSubtask
} from "@/lib/integrations/jira"

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

// Domain Roles 
export async function createDomainRole(domainId: string, data: { name: string; language: string }) {
  try {
    const client = getClient();
    const response: { data: Schema["DomainRole"]["type"] | null; errors?: any[] } = await client.models.DomainRole.create({
      domainId,
      name: data.name,
      language: data.language,
    });

    if (!response.data) {
      throw new Error("Failed to create domain role");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating domain role in Amplify:", error);
    throw new Error(`Failed to create domain role: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteDomainRole(domainId: string, roleId: string) {
  try {
    const client = getClient();
    const response: { data: Schema["DomainRole"]["type"] | null; errors?: any[] } = await client.models.DomainRole.delete({ id: roleId });

    if (!response.data) {
      throw new Error(`Failed to delete domain role with ID ${roleId}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error deleting domain role from Amplify:", error);
    throw new Error(`Failed to delete domain role: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function listDomainRoles(domainId: string) {
  try {
    const client = getClient();
    const response: { data: Schema["DomainRole"]["type"][]; nextToken?: string | null; errors?: any[] } = await client.models.DomainRole.list({
      filter: { domainId: { eq: domainId } },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching domain roles from Amplify:", error);
    throw new Error(`Failed to fetch domain roles: ${error instanceof Error ? error.message : String(error)}`);
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

// Roles
export const createRole = async (data: { name: string; language: string }): Promise<Role> => {
  try {
    const client = getClient();
    const response: { data: Schema["Role"]["type"] | null; errors?: any[] } = await client.models.Role.create({
      name: data.name,
      language: data.language,
    });
    if (!response.data) {
      throw new Error("Failed to create role");
    }
    return {
      ...response.data,
      language: response.data.language || "ES", // Default to "ES" if language is undefined
    };
  } catch (error) {
    console.error("Error creating role in Amplify:", error);
    throw new Error(`Failed to create role: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const deleteRole = async (roleId: string) => {
  try {
    const client = getClient();
    const response: {
      data: Schema["Role"]["type"] | null; errors?: any[]
    } = await client.models.Role.delete({ id: roleId });
    if (!response.data) {
      throw new Error(`Failed to delete role with ID ${roleId}`);
    }
    return response.data;
  }
  catch (error) {
    console.error("Error deleting role from Amplify:", error);
    throw new Error(`Failed to delete role: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const listRoles = async (language: string): Promise<Role[]> => {
  try {
    const client = getClient();

    const response: { data: Schema["Role"]["type"][]; nextToken?: string | null; errors?: any[] } = await client.models.Role.list({
      filter: { language: { eq: language } },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching roles from Amplify:", error);
    throw new Error(`Failed to fetch roles: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const listAllRoles = async (): Promise<Role[]> => {
  try {
    const client = getClient();

    const response: {
      data: Schema["Role"]["type"][]; nextToken?: string | null; errors?: any[]
    } = await client.models.Role.list()

    return response.data;
  } catch (error) {
    console.error("Error fetching roles from Amplify:", error);
    throw new Error(`Failed to fetch roles: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Projects
export const createProject = async (
  domainId: string,
  data: {
    areaId: string;
    language: string;
    sourceSystem: string;
    projectId: string;
    requestTypeId: string;
    queueId: number;
    name: string;
  },
) => {
  try {
    const client = getClient();
    const response: { data: Schema["Project"]["type"] | null; errors?: any[] } = await client.models.Project.create({
      domainId,
      areaId: data.areaId,
      language: data.language,
      sourceSystem: data.sourceSystem,
      projectId: data.projectId,
      requestTypeId: data.requestTypeId,
      queueId: data.queueId,
      name: data.name,
      deleted: false,
    });

    if (!response.data) {
      throw new Error(`Failed to create project`);
    }

    return response.data;
  } catch (error) {
    console.error("Error creating project in Amplify:", error);
    throw new Error(`Failed to create project: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const getProject = async (projectId: string): Promise<Project> => {
  try {
    const client = getClient();
    const response: { data: Schema["Project"]["type"] | null; errors?: any[] } = await client.models.Project.get({ id: projectId });

    if (!response.data) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching project from Amplify:", error);
    throw new Error(`Failed to fetch project: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const listProjectsByDomain = async (domainId: string): Promise<Project[]> => {
  try {
    const client = getClient();
    const response: { data: Schema["Project"]["type"][]; nextToken?: string | null; errors?: any[] } = await client.models.Project.list({
      filter: {
        domainId: { eq: domainId },
        deleted: { ne: true },
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching projects from Amplify:", error);
    throw new Error(`Failed to fetch projects: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Services
export const createService = async (
  data: CreateServiceFormValues,
  projectId: string,
  serviceName: string,
  issueKey: string
) => {
  try {
    const client = getClient();

    const totalArea: number = data.selectedLots.reduce((sum: number, lot: SelectedLotDetail) => sum + (lot.hectares || 0), 0);

    const serviceData = {
      projectId: projectId,
      serviceName: serviceName,
      externalServiceKey: issueKey,
      externalTemplateId: data.protocol,
      workspaceId: data.workspace,
      workspaceName: data.workspaceName,
      campaignId: data.campaign,
      campaignName: data.campaignName,
      farmId: data.establishment,
      farmName: data.establishmentName,
      totalArea: totalArea,
      startDate: new Date().toISOString(),
    };

    const response: { data: Schema["Service"]["type"] | null; errors?: any[] } = await client.models.Service.create(serviceData);

    if (!response.data) {
      throw new Error("Failed to create service");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating service in Amplify:", error);
    throw new Error(`Failed to create service: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const createServiceFields = async (serviceId: string, fields: any[]): Promise<void> => {
  try {
    const client = getClient();

    await Promise.all(
      fields.map((field: SelectedLotDetail) =>
        client.models.ServiceField.create({
          serviceId,
          fieldId: field.fieldId,
          fieldName: field.fieldName,
          hectares: field.hectares,
          crop: field.cropName,
          hybrid: field.hybridName,
        }),
      ),
    );
  } catch (error) {
    console.error("Error creating service fields in Amplify:", error);
    throw new Error(`Failed to create service fields: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const createServiceTasks = async (
  serviceId: string,
  tasks: any[],
  locale: string,
  domain: string,
  project: string,
  serviceDeskId: string
): Promise<string[]> => {
  try {
    const client = getClient();
    const taskResults: string[] = [];
    for (const task of tasks) {
      // Create ServiceTask in Agtasks 
      const response: {
        data: { id: string } | null; errors?: any[]
      } = await client.models.ServiceTask.create({
        serviceId,
        externalTemplateId: task.externalTemplateId,
        taskName: task.taskName,
        taskType: task.taskType,
        userEmail: task.userEmail,
      });

      if (!response.data) {
        throw new Error(`Failed to create task: ${task.taskName}`);
      }

      const taskId = response.data.id;

      // Create Subtask in Jira 
      if (task.parentIssueKey && task.description) {
        try {
          const baseUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_SITE_URL
            : 'http://localhost:3000'

          const agtasksUrl = `${baseUrl}/${locale}/domains/${domain}/projects/${project}/tasks/${taskId}`;

          await createSubtask(
            task.parentIssueKey,
            task.taskName,
            task.userEmail,
            task.description,
            agtasksUrl,
            task.taskType,
            serviceDeskId
          );
        } catch (error) {
          console.error(`Failed to create Jira subtask for task ${task.taskName}:`, error);
          // No lanzamos error para permitir que el proceso continúe
        }
      } else {
        console.warn(`Skipping Jira subtask creation for task ${task.taskName}: missing parentIssueKey or description`);
      }

      taskResults.push(taskId);
    }
    return taskResults;
  } catch (error) {
    console.error("Error creating service tasks in Amplify:", error);
    throw new Error(`Failed to create service tasks: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Tasks
export const getServiceTask = async (taskId: string): Promise<ServiceTask> => {
  const client = getClient();

  // obtengo ServiceTask
  const taskResponse: {
    data: Schema["ServiceTask"]["type"] | null; errors?: any[]
  } = await client.models.ServiceTask.get({ id: taskId });

  if (!taskResponse.data) {
    throw new Error(`Task with ID ${taskId} not found`);
  }

  return {
    ...taskResponse.data,
    taskType: taskResponse.data?.taskType ?? "",
  } as ServiceTask;
}

export const updateServiceTask = async (
  taskId: string, 
  formData: Record<string, any>
): Promise<{ success: boolean; data?: any; error?: any }> => {
  const client = getClient();

  try {
    const response = await client.models.ServiceTask.update({
      id: taskId,
      formData: JSON.stringify(formData),
    });

    if (!response.data) {
      return { success: false, error: "No se pudo actualizar la tarea" };
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Ocurrió un error al intentar actualizar la tarea: ", error);
    return { success: false, error };
  }
};

export const listServicesByProject = async (
  projectId: string,
  options: {
    page: number;
    pageSize: number;
    searchQuery?: string;
    sortBy?: keyof Service;
    sortDirection?: "asc" | "desc";
  },
): Promise<{ services: Service[]; total: number }> => {
  try {
    const client = getClient();
    const { pageSize, searchQuery = "", sortBy = "createdAt", sortDirection = "desc" } = options;

    const filter: any = { projectId: { eq: projectId } };
    if (searchQuery) {
      filter.serviceName = { contains: searchQuery.toLowerCase() };
    }

    // Obtener todos los servicios sin paginación real si pageSize es grande
    let allServices: Schema["Service"]["type"][] = [];
    let nextToken: string | null | undefined = undefined;
    do {
      const response: { data: Schema["Service"]["type"][]; nextToken?: string | null; errors?: any[] } = await client.models.Service.list({
        filter,
        limit: pageSize,
        ...(nextToken && { nextToken }),
      });
      allServices = allServices.concat(response.data);
      nextToken = response.nextToken;
    } while (nextToken);

    const total = allServices.length;

    const servicesWithRelations = await Promise.all(
      allServices.map(async (service) => {
        const fieldsResponse = await service.fields();
        const lots = fieldsResponse.data.map((field) => field.fieldId).join(", ") || "Sin lotes asignados";

        const tasksResponse = await service.tasks();
        const tasks = await Promise.all(
          tasksResponse.data.map(async (task) => {
            return task;
          }),
        );

        const totalTasks = tasks.length;
        const completedTasks = 0;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          id: service.id,
          projectId: service.projectId,
          serviceName: service.serviceName,
          externalTemplateId: service.externalTemplateId,
          externalServiceKey: service.externalServiceKey,
          workspaceId: service.workspaceId,
          workspaceName: service.workspaceName,
          campaignId: service.campaignId,
          campaignName: service.campaignName,
          farmId: service.farmId,
          farmName: service.farmName,
          lots: lots,
          totalArea: service.totalArea,
          startDate: service.startDate,
          endDate: service.endDate,
          progress,
          createdAt: service.createdAt,
        } as Service;
      }),
    );

    const sortedServices = servicesWithRelations.sort((a, b) => {
      if (sortBy === 'createdAt') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const valueA = a[sortBy]?.toString().toLowerCase() || "";
        const valueB = b[sortBy]?.toString().toLowerCase() || "";
        return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
    });

    return { services: sortedServices, total };
  } catch (error) {
    console.error("Error fetching services from Amplify:", error);
    throw new Error(`Failed to fetch services: ${error instanceof Error ? error.message : String(error)}`);
  }
};

