import { Amplify } from "aws-amplify"
import outputs from "@/amplify_outputs.json"
import { generateClient } from "aws-amplify/api"
import type { Schema } from "@/amplify/data/resource"
import type { Project, Service, Role } from "@/lib/interfaces"

// Amplify configuration
let clientInstance: ReturnType<typeof generateClient<Schema>> | null = null
let configured = false
export function getClient() {
  if (!configured) {
    Amplify.configure(outputs)
    configured = true
  }

  if (!clientInstance) {
    clientInstance = generateClient<Schema>()
  }

  return clientInstance
}
const client = getClient()

// Domain Protocols (amplify/data/resource.ts)
export async function createDomainProtocol(
  domainId: string,
  data: { tmProtocolId: string; name: string; language: string },
) {
  return await client.models.DomainProtocol.create({
    domainId,
    tmProtocolId: data.tmProtocolId,
    name: data.name,
    language: data.language,
  })
}

export async function listDomainProtocols(domainId: string) {
  return await client.models.DomainProtocol.list({ filter: { domainId: { eq: domainId } } })
}

export async function deleteDomainProtocol(domainId: string, protocolId: string) {
  return await client.models.DomainProtocol.delete({ id: protocolId })
}

// Domain Roles (amplify/data/resource.ts)
export async function createDomainRole(domainId: string, data: { name: string; language: string }) {
  return await client.models.DomainRole.create({
    domainId,
    name: data.name,
    language: data.language,
  })
}

export async function listDomainRoles(domainId: string) {
  return await client.models.DomainRole.list({ filter: { domainId: { eq: domainId } } })
}

export async function deleteDomainRole(domainId: string, roleId: string) {
  return await client.models.DomainRole.delete({ id: roleId })
}

// Domain Forms (amplify/data/resource.ts)

export async function createDomainForm(domainId: string, data: { name: string; language: string; ktFormId: string }) {
  return await client.models.DomainForm.create({
    domainId,
    name: data.name,
    language: data.language,
    ktFormId: data.ktFormId,
  })
}

export async function listDomainForms(domainId: string) {
  return await client.models.DomainForm.list({ filter: { domainId: { eq: domainId } } })
}

export async function deleteDomainForm(domainId: string, formId: string) {
  return await client.models.DomainForm.delete({ id: formId })
}

// Roles

export const listRoles = async (language?: string): Promise<Role[]> => {
  try {
    // Get the Amplify client
    const client = getClient()

    // Prepare filter - if language is provided, filter by it
    const filter = language ? { language: { eq: language } } : undefined

    // Query for roles
    const response = await client.models.Role.list({ filter })

    // Map the response to the Role interface
    const roles = response.data.map((item) => ({
      id: item.id,
      name: item.name,
      language: item.language || "ES", // Default to ES if language is not provided
    }))

    return roles
  } catch (error) {
    console.error("Error fetching roles from Amplify:", error)
    throw new Error(`Failed to fetch roles: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Projects

export const listProjectsByDomain = async (domainId: string): Promise<Project[]> => {
  try {
    // Get the Amplify client
    const client = getClient()

    // Query for projects with matching domainId and not deleted
    const response = await client.models.Project.list({
      filter: {
        domainId: { eq: domainId },
        deleted: { ne: true }, // Filter out deleted projects
      },
    })

    return response.data
  } catch (error) {
    console.error("Error fetching projects from Amplify:", error)
    throw new Error(`Failed to fetch projects: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export const getProject = async (projectId: string): Promise<Project> => {
  try {
    // Get the Amplify client
    const client = getClient()

    // Query for the specific project
    const response = await client.models.Project.get({ id: projectId })

    // If project not found, throw error
    if (!response.data) {
      throw new Error(`Project with ID ${projectId} not found`)
    }

    return response.data
  } catch (error) {
    console.error("Error fetching project from Amplify:", error)
    throw new Error(`Failed to fetch project: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// To Do: en Etapa 2 se guardará el projecto en el task manager, usando un template de projecto
// y una vez creado guardar una referencia en Agtasks.
export const createProject = async (domainId: string, data: { name: string; language: string; queueId: number }) => {
  try {
    // Get the Amplify client
    const client = getClient()
    // Create the project
    const response = await client.models.Project.create({
      domainId,
      name: data.name,
      language: data.language,
      queueId: data.queueId,
      deleted: false, // Default value for deleted
    })
    // If project creation fails, throw error
    if (!response.data) {
      throw new Error(`Failed to create project`)
    }
    return response.data
  } catch (error) {
    console.error("Error creating project in Amplify:", error)
    throw new Error(`Failed to create project: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Services
export const createService = async (data: any) => {
  try {
    // Get the Amplify client
    const client = getClient()

    // Create the service
    const serviceResponse = await client.models.Service.create({
      projectId: data.projectId,
      serviceName: data.serviceName,
      externalServiceKey: data.externalServiceKey || `SRV-${Date.now()}`,
      sourceSystem: data.sourceSystem,
      externalTemplateId: data.externalTemplateId,
      workspaceId: data.workspaceId,
      campaignId: data.campaignId,
      farmId: data.farmId,
      totalArea: data.totalArea || 0,
      startDate: data.startDate,
      endDate: data.endDate,
    })

    if (!serviceResponse.data) {
      throw new Error("Failed to create service")
    }

    const serviceId = serviceResponse.data.id

    // Create service fields if provided
    if (data.fields && Array.isArray(data.fields) && data.fields.length > 0) {
      for (const fieldId of data.fields) {
        await client.models.ServiceField.create({
          serviceId,
          fieldId,
        })
      }
    }

    // Create service tasks if provided
    if (data.tasks && Array.isArray(data.tasks) && data.tasks.length > 0) {
      for (const task of data.tasks) {
        await client.models.ServiceTask.create({
          serviceId,
          externalTemplateId: task.externalTemplateId,
          sourceSystem: task.sourceSystem,
          roleId: task.roleId,
          userId: task.userId,
        })
      }
    }

    return serviceResponse.data
  } catch (error) {
    console.error("Error creating service in Amplify:", error)
    throw new Error(`Failed to create service: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export const listServicesByProject = async (projectId: string): Promise<Service[]> => {
  try {
    // Get the Amplify client
    const client = getClient()

    // Query for services related to this project
    const servicesResponse = await client.models.Service.list({
      filter: {
        projectId: { eq: projectId },
      },
    })

    if (!servicesResponse.data.length) {
      console.log(`No services found for project ${projectId}`)
      return []
    }

    // Create a map to store service data with their fields and tasks
    const serviceMap = new Map()

    // 2. For each service, get its fields
    for (const service of servicesResponse.data) {
      // Store basic service info
      serviceMap.set(service.id, {
        projectId: service.projectId,
        id: service.id,
        serviceName: service.serviceName,
        externalServiceKey: service.externalServiceKey,
        sourceSystem: service.sourceSystem,
        externalTemplateId: service.externalTemplateId,
        workspaceId: service.workspaceId,
        campaignId: service.campaignId,
        farmId: service.farmId,
        lots: [], // Will be populated with field data
        totalArea: service.totalArea,
        startDate: service.startDate,
        tasks: [], // Will be populated with task data
      })
    }

    // Get all service IDs for batch queries
    const serviceIds = servicesResponse.data.map((service) => service.id)

    // 3. Query for all fields related to these services
    const fieldsResponse = await client.models.ServiceField.list({
      filter: {
        or: serviceIds.map((id) => ({ serviceId: { eq: id } })),
      },
    })

    // Process fields and add them to their respective services
    for (const field of fieldsResponse.data) {
      const service = serviceMap.get(field.serviceId)
      if (service) {
        service.lots.push(field.fieldId)
      }
    }

    // 4. Query for all tasks related to these services
    const tasksResponse = await client.models.ServiceTask.list({
      filter: {
        or: serviceIds.map((id) => ({ serviceId: { eq: id } })),
      },
    })

    // Get all role IDs and user IDs for batch queries
    const roleIds = Array.from(new Set(tasksResponse.data.map((task) => task.roleId)))
    const userIds = Array.from(new Set(tasksResponse.data.map((task) => task.userId)))

    // 5. Query for all roles and users in one batch
    const [rolesResponse, usersResponse] = await Promise.all([
      client.models.Role.list({
        filter: {
          or: roleIds.map((roleId) => ({ id: { eq: roleId } })),
        },
      }),
      client.models.User.list({
        filter: {
          or: userIds.map((userId) => ({ id: { eq: userId } })),
        },
      }),
    ])

    // Create maps for quick lookup
    const roleMap = new Map(rolesResponse.data.map((role) => [role.id, role]))
    const userMap = new Map(usersResponse.data.map((user) => [user.id, user]))

    // Process tasks and add them to their respective services
    for (const task of tasksResponse.data) {
      const service = serviceMap.get(task.serviceId)
      if (service) {
        const role = roleMap.get(task.roleId)
        const user = userMap.get(task.userId)

        service.tasks.push({
          id: task.id,
          externalTemplateId: task.externalTemplateId,
          sourceSystem: task.sourceSystem,
          role: role ? { id: role.id, name: role.name } : { id: task.roleId, name: "Unknown Role" },
          user: user
            ? { id: user.id, name: user.name, email: user.email }
            : { id: task.userId, name: "Unknown User", email: "" },
        })
      }
    }

    // 6. Calculate progress and determine status for each service
    for (const service of Array.from(serviceMap.values())) {
      // Convert lots array to string for interface compatibility
      service.lots = service.lots.length > 0 ? service.lots.join(", ") : "Sin lotes asignados"

      // Calculate progress based on tasks (simplified example)
      // In a real scenario, you might have task completion status to calculate this
      const totalTasks = service.tasks.length
      const completedTasks = 0 // This would come from task status in a real scenario

      if (totalTasks > 0) {
        service.progress = Math.round((completedTasks / totalTasks) * 100)
      }

      // Determine status based on dates and progress
      const now = new Date()
      const startDate = service.startDate ? new Date(service.startDate) : null
      const endDate = service.endDate ? new Date(service.endDate) : null

      if (service.progress === 100) {
        service.status = "Finalizado"
      } else if (startDate && now >= startDate) {
        service.status = "En progreso"
      } else {
        service.status = "Planificado"
      }

      // Remove tasks array as it's not part of the Service interface
      delete service.tasks
    }

    // Convert map to array for return
    return Array.from(serviceMap.values())
  } catch (error) {
    console.error("Error fetching services from Amplify:", error)
    throw new Error(`Failed to fetch services: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export const getService = async (serviceId: string): Promise<Service> => {
  try {
    // Get the Amplify client
    const client = getClient()

    // Query for the specific service
    const response = await client.models.Service.get({ id: serviceId })

    // If service not found, throw error
    if (!response.data) {
      throw new Error(`Service with ID ${serviceId} not found`)
    }

    return {
      ...response.data,
      endDate: undefined,
    }
  } catch (error) {
    console.error("Error fetching service from Amplify:", error)
    throw new Error(`Failed to fetch service: ${error instanceof Error ? error.message : String(error)}`)
  }
}
