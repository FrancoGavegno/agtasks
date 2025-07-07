"use server"

import { revalidatePath } from "next/cache"
import { client } from "./amplify-client"
import { serializeModelData } from "@/lib/serialization-utils"

// Project Actions
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
}) {
  try {
    const result = await client.models.Project.create(data)
    revalidatePath("/admin/project")
    return { success: true, data: result.data ? serializeModelData(result.data) : {} }
    // return { success: true, data: serializeModelData(result.data) }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateProject(
  id: string,
  data: Partial<{
    domainId: string
    areaId: string
    serviceDeskId: string
    requestTypeId: string
    name: string
    language: string
    tmpSourceSystem: string
    tmpServiceDeskId: string
    tmpRequestTypeId: string
    tmpQueueId: string
    queueId: string
  }>,
) {
  try {
    const result = await client.models.Project.update({ id, ...data })
    revalidatePath("/admin/project")
    return { success: true, data: result.data ? serializeModelData(result.data) : {} }
    // return { success: true, data: serializeModelData(result.data) }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteProject(id: string) {
  try {
    const result = await client.models.Project.update({ id, deleted: true })
    revalidatePath("/admin/project")
    return { success: true, data: result.data ? serializeModelData(result.data) : {} }
    // return { success: true, data: serializeModelData(result.data) }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getProject(id: string) {
  try {
    const result = await client.models.Project.get({ id })
    if (!result.data) {
      return { success: false, error: "Project not found" }
    }

    // Get related data if needed
    const servicesData = await result.data.services()
    const tasksData = await result.data.tasks()

    return {
      success: true,
      data: {
        ...serializeModelData(result.data),
        services: servicesData.data?.map((service) => serializeModelData(service)) || [],
        tasks: tasksData.data?.map((task) => serializeModelData(task)) || [],
      },
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// Service Actions
export async function createService(data: {
  projectId?: string
  name: string
  tmpRequestId?: string
  requestId?: string
}) {
  try {
    const result = await client.models.Service.create(data)
    revalidatePath("/admin/service")
    return { success: true, data: result.data ? serializeModelData(result.data) : {} }
    // return { success: true, data: serializeModelData(result.data) }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateService(
  id: string,
  data: Partial<{
    projectId: string
    name: string
    tmpRequestId: string
    requestId: string
  }>,
) {
  try {
    const result = await client.models.Service.update({ id, ...data })
    revalidatePath("/admin/service")
    return { success: true, data: result.data ? serializeModelData(result.data) : {} }
    // return { success: true, data: serializeModelData(result.data) }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteService(id: string) {
  try {
    const result = await client.models.Service.update({ id, deleted: true })
    revalidatePath("/admin/service")
    return { success: true, data: result.data ? serializeModelData(result.data) : {} }
    // return { success: true, data: serializeModelData(result.data) }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getService(id: string) {
  try {
    const result = await client.models.Service.get({ id })
    if (!result.data) {
      return { success: false, error: "Service not found" }
    }

    // Get related data if needed
    const projectData = await result.data.project()
    const tasksData = await result.data.tasks()

    return {
      success: true,
      data: {
        ...serializeModelData(result.data),
        project: projectData.data ? serializeModelData(projectData.data) : null,
        tasks: tasksData.data?.map((task) => serializeModelData(task)) || [],
      },
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// Task Actions
export async function createTask(data: {
  projectId?: string
  serviceId?: string
  tmpSubtaskId: string
  subtaskId?: string
  taskName: string
  taskType?: string
  taskData?: any
  userEmail: string
}) {
  try {
    const result = await client.models.Task.create(data)
    revalidatePath("/admin/task")
    return { success: true, data: result.data ? serializeModelData(result.data) : {} }
    // return { success: true, data: serializeModelData(result.data) }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateTask(
  id: string,
  data: Partial<{
    projectId: string
    serviceId: string
    tmpSubtaskId: string
    subtaskId: string
    taskName: string
    taskType: string
    taskData: any
    userEmail: string
  }>,
) {
  try {
    const result = await client.models.Task.update({ id, ...data })
    revalidatePath("/admin/task")
    return { success: true, data: result.data ? serializeModelData(result.data) : {} }
    // return { success: true, data: serializeModelData(result.data) }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteTask(id: string) {
  try {
    const result = await client.models.Task.update({ id, deleted: true })
    revalidatePath("/admin/task")
    return { success: true, data: result.data ? serializeModelData(result.data) : {} }
    // return { success: true, data: serializeModelData(result.data) }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getTask(id: string) {
  try {
    const result = await client.models.Task.get({ id })
    if (!result.data) {
      return { success: false, error: "Task not found" }
    }

    // Get related data if needed
    const projectData = await result.data.project()
    const serviceData = await result.data.service()
    const fieldsData = await result.data.fields()

    return {
      success: true,
      data: {
        ...serializeModelData(result.data),
        project: projectData.data ? serializeModelData(projectData.data) : null,
        service: serviceData.data ? serializeModelData(serviceData.data) : null,
        fields: fieldsData.data?.map((field) => serializeModelData(field)) || [],
      },
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// Field Actions
export async function createField(data: {
  taskId: string
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
  try {
    const result = await client.models.Field.create(data)
    revalidatePath("/admin/field")
    return { success: true, data: result.data ? serializeModelData(result.data) : {} }
    // return { success: true, data: serializeModelData(result.data) }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateField(
  id: string,
  data: Partial<{
    taskId: string
    workspaceId: string
    workspaceName: string
    campaignId: string
    campaignName: string
    farmId: string
    farmName: string
    fieldId: string
    fieldName: string
    hectares: number
    crop: string
    hybrid: string
  }>,
) {
  try {
    const result = await client.models.Field.update({ id, ...data })
    revalidatePath("/admin/field")
    return { success: true, data: result.data ? serializeModelData(result.data) : {} }
    // return { success: true, data: serializeModelData(result.data) }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteField(id: string) {
  try {
    const result = await client.models.Field.update({ id, deleted: true })
    revalidatePath("/admin/field")
    return { success: true, data: result.data ? serializeModelData(result.data) : {} }
    // return { success: true, data: serializeModelData(result.data) }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getField(id: string) {
  try {
    const result = await client.models.Field.get({ id })
    if (!result.data) {
      return { success: false, error: "Field not found" }
    }

    // Get related data if needed
    const taskData = await result.data.task()

    return {
      success: true,
      data: {
        ...serializeModelData(result.data),
        task: taskData.data ? serializeModelData(taskData.data) : null,
      },
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// Domain Protocol Actions
export async function createDomainProtocol(data: {
  domainId: string
  tmProtocolId: string
  name: string
  language: string
}) {
  try {
    const result = await client.models.DomainProtocol.create(data)
    revalidatePath("/admin/protocol")
    return { success: true, data: result.data ? serializeModelData(result.data) : {} }
    // return { success: true, data: serializeModelData(result.data) }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateDomainProtocol(
  id: string,
  data: Partial<{
    domainId: string
    tmProtocolId: string
    name: string
    language: string
  }>,
) {
  try {
    const result = await client.models.DomainProtocol.update({ id, ...data })
    revalidatePath("/admin/protocol")
    return { success: true, data: result.data ? serializeModelData(result.data) : {} }
    // return { success: true, data: serializeModelData(result.data) }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteDomainProtocol(id: string) {
  try {
    const result = await client.models.DomainProtocol.delete({ id })
    revalidatePath("/admin/protocol")
    return { success: true, data: result.data ? serializeModelData(result.data) : null }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getDomainProtocol(id: string) {
  try {
    const result = await client.models.DomainProtocol.get({ id })
    if (!result.data) {
      return { success: false, error: "Domain Protocol not found" }
    }

    return {
      success: true,
      data: serializeModelData(result.data),
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// Domain Form Actions
export async function createDomainForm(data: {
  domainId: string
  ktFormId: string
  name: string
  language: string
}) {
  try {
    const result = await client.models.DomainForm.create(data)
    revalidatePath("/admin/form")
    return { success: true, data: result.data ? serializeModelData(result.data) : {} }
    // return { success: true, data: serializeModelData(result.data) }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateDomainForm(
  id: string,
  data: Partial<{
    domainId: string
    ktFormId: string
    name: string
    language: string
  }>,
) {
  try {
    const result = await client.models.DomainForm.update({ id, ...data })
    revalidatePath("/admin/form")
    return { success: true, data: result.data ? serializeModelData(result.data) : {} }
    // return { success: true, data: serializeModelData(result.data) }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteDomainForm(id: string) {
  try {
    const result = await client.models.DomainForm.delete({ id })
    revalidatePath("/admin/form")
    return { success: true, data: result.data ? serializeModelData(result.data) : null }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getDomainForm(id: string) {
  try {
    const result = await client.models.DomainForm.get({ id })
    if (!result.data) {
      return { success: false, error: "Domain Form not found" }
    }

    return {
      success: true,
      data: serializeModelData(result.data),
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
