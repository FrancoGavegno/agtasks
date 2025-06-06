"use server"

import axios, { type AxiosError, type AxiosResponse } from "axios"
import type {
  JiraCustomerData,
  JiraResponse,
  // JiraRequestData,
  // JiraRequest,
  QueueIssueResponse,
  JiraProjectRequest,
  JiraProjectResponse,
  // JiraCustomerRequestData,
  JiraServiceRequest,
  JiraServiceResponse,
  JiraSubtaskResponse,
  JiraRequest,
} from "@/lib/interfaces"

const JIRA_API_URL = process.env.NEXT_PUBLIC_JIRA_API_URL
const JIRA_API_TOKEN = process.env.NEXT_PUBLIC_JIRA_API_TOKEN

export const jiraApi = axios.create({
  baseURL: JIRA_API_URL,
  headers: {
    "Authorization": `Basic ${JIRA_API_TOKEN}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
  timeout: 3600000, // Timeout de 3600 segundos para evitar solicitudes eternas
})

// Interceptor opcional para manejar errores globalmente o añadir logging
jiraApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error("Jira API request failed:", error)
    throw error
  },
)

// Request participants
async function processParticipants(participants: string[]): Promise<string[]> {
  const participantsToSubmitInJira: string[] = []

  for (const participant of participants) {
    try {
      // Usar GetCustomer para buscar el cliente existente
      // const customerResult = await getCustomer(participant);
      // if (customerResult.success && customerResult.data) {
      //   participantsToSubmitInJira.push(customerResult.data.accountId);
      // } else {

      // Crear cliente si no existe usando CreateCustomer
      const customerData: JiraCustomerData = {
        displayName: participant,
        email: participant,
      }

      const createCustomerResult = await createCustomer(customerData)

      if (createCustomerResult.success && createCustomerResult.data) {
        participantsToSubmitInJira.push(createCustomerResult.data.accountId)
      } else {
        throw new Error(
          `Failed to create customer for participant: ${participant}. Error: ${createCustomerResult.error}`,
        )
      }

      //}
    } catch (error) {
      console.error("Error processing participant:", participant, error)
      // Opcional: continuar incluso si un participante falla
      continue
    }
  }

  return participantsToSubmitInJira
}

// Services  
export async function listServicesByProject(domainId: string, serviceDeskId: string, queueId: string): Promise<JiraResponse> {
  try {
    const endpoint = `/rest/servicedeskapi/servicedesk/${serviceDeskId}/queue/${queueId}/issue`
    const response = await jiraApi.get<QueueIssueResponse>(endpoint)
    // console.log('Jira queue issues retrieved successfully:', response.status);
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    let errorMessage: string

    if (axios.isAxiosError(error)) {
      errorMessage = `Jira API error: ${error.response?.status} ${error.response?.statusText} - ${error.response?.data?.message || error.message}`
    } else {
      errorMessage = "Unknown error occurred while fetching Jira queue issues"
    }
    return {
      success: false,
      error: errorMessage,
    }
  }
}

export async function createService(requestData: JiraServiceRequest): Promise<JiraServiceResponse> {
  // Referencia: https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-post

  try {
    const endpoint = "/rest/servicedeskapi/request";
    // Preparar el payload según la estructura requerida por la API
    const payload = {
      serviceDeskId: requestData.serviceDeskId,
      requestTypeId: requestData.requestTypeId,
      requestFieldValues: {
        summary: requestData.requestFieldValues.summary,
        description: requestData.requestFieldValues.description,
        // Agregar otros campos personalizados si están definidos
        // ...(requestData.requestFieldValues.customFields && {
        //   ...requestData.requestFieldValues.customFields
        // })
      },
      // Opcional: incluir si se proporciona
      ...(requestData.raiseOnBehalfOf && { raiseOnBehalfOf: requestData.raiseOnBehalfOf }),
      ...(requestData.requestParticipants && { requestParticipants: requestData.requestParticipants }),
      // Controlar si la descripción es en formato ADF
      // isAdfRequest: requestData.isAdfRequest || false
    };

    // console.log("payload:", JSON.stringify(payload, null, 2));
    // Realizar la solicitud POST
    const response = await jiraApi.post(endpoint, payload);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    let errorMessage: string;

    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      errorMessage = `Jira API error: ${error.response?.status} ${error.response?.statusText} - ${errorData?.errorMessages?.join(', ') || errorData?.message || error.message
        }`;
    } else {
      errorMessage = "Unknown error occurred while creating Jira service";
    }

    console.error("Error creating Jira service:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function createSubtask(
  parentIssueKey: string,
  summary: string,
  userEmail: string,
  description: string // Ahora recibe el texto en formato Wiki
): Promise<JiraSubtaskResponse | void> {

  const payload = {
    fields: {
      project: {
        key: parentIssueKey.split('-')[0]
      },
      summary: summary,
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: description // Texto plano con formato Wiki
              }
            ]
          }
        ]
      },
      issuetype: {
        name: "Sub-task"
      },
      parent: {
        key: parentIssueKey
      },
      customfield_10305: userEmail,
    }
  }

  try {
    const endpoint = `${JIRA_API_URL}/rest/api/3/issue`
    const response = await jiraApi.post(endpoint, payload)
    return response.data
  } catch (err) {
    console.error("Error creating subtask:", err)
    throw err
  }
}

export async function listTasksbyService(issueIdOrKey: string): Promise<JiraResponse> {
  try {
    // 1. Obtener detalles del Customer Request
    const issueEndpoint = `/rest/api/3/issue/${issueIdOrKey}`
    const issueResponse = await jiraApi.get(issueEndpoint)
    const issueData = issueResponse.data

    // 2. Extraer subtareas
    const subtasks = issueData.fields?.subtasks || []
    const result = {
      issueKey: issueData.key,
      issueSummary: issueData.fields?.summary,
      subtasks: subtasks.map((subtask: { key: string; fields: { summary: string; status: { name: string } } }) => ({
        key: subtask.key,
        summary: subtask.fields.summary,
        status: subtask.fields.status.name,
      })),
    }

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    let errorMessage: string

    if (axios.isAxiosError(error)) {
      errorMessage = `Jira API error: ${error.response?.status} ${error.response?.statusText} - ${error.response?.data?.message || error.message}`
    } else {
      errorMessage = "Unknown error occurred while fetching Jira request tasks"
    }
    return {
      success: false,
      error: errorMessage,
    }
  }
}

export async function getIssue(issueIdOrKey: string): Promise<JiraResponse> {
  try {
    const endpoint = `/rest/api/3/issue/${issueIdOrKey}`
    const response = await jiraApi.get(endpoint)

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    let errorMessage: string

    if (axios.isAxiosError(error)) {
      errorMessage = `Jira API error: ${error.response?.status} ${error.response?.statusText} - ${error.response?.data?.message || error.message}`
    } else {
      errorMessage = "Unknown error occurred while fetching Jira issue"
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

export async function createCustomer(customerData: JiraCustomerData): Promise<JiraResponse> {
  try {
    const response = await jiraApi.post("/rest/servicedeskapi/customer", customerData)
    // console.log('Jira customer created successfully:', response.status);

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    let errorMessage: string

    if (axios.isAxiosError(error)) {
      // Manejo específico de errores de Axios
      errorMessage = `Jira API error: ${error.response?.status} ${error.response?.statusText} - ${error.response?.data?.message || error.message}`
    } else {
      // Manejo de errores genéricos
      errorMessage = "Unknown error occurred while creating Jira customer"
    }

    // console.error('Error creating Jira customer:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    }
  }
}

// Projects 
export async function createProject(projectData: JiraProjectRequest): Promise<JiraResponse> {
  try {
    const endpoint = "/rest/api/3/project"
    const response = await jiraApi.post<JiraProjectResponse>(endpoint, projectData)

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    let errorMessage: string

    if (axios.isAxiosError(error)) {
      errorMessage = `Jira API error: ${error.response?.status} ${error.response?.statusText} - ${error.response?.data?.message || error.message}`
    } else {
      errorMessage = "Unknown error occurred while creating Jira project"
    }

    console.error("Error creating Jira project:", errorMessage)
    return {
      success: false,
      error: errorMessage,
    }
  }
}



