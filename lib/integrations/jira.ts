"use server" 

import axios, { type AxiosError, type AxiosResponse } from "axios"
import type {
  JiraCustomerData,
  JiraResponse,
  JiraRequestData,
  JiraRequest,
  QueueIssueResponse,
  JiraProjectRequest,
  JiraProjectResponse,
  JiraCustomerRequestData,
} from "@/lib/interfaces"

const JIRA_API_URL = process.env.NEXT_PUBLIC_JIRA_API_URL || "your_jira_username"
const JIRA_API_TOKEN = process.env.NEXT_PUBLIC_JIRA_API_TOKEN || "your_jira_api_token"

// 

const JIRA_SD_ID = process.env.NEXT_PUBLIC_JIRA_SD_ID || "your_jira_sd_id"

export const jiraApi = axios.create({
  baseURL: JIRA_API_URL,
  headers: {
    Authorization: `Basic ${JIRA_API_TOKEN}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000, // Timeout de 10 segundos para evitar solicitudes eternas
})

// Interceptor opcional para manejar errores globalmente o añadir logging
jiraApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error("Jira API request failed:", error)
    throw error
  },
)

// Task Manager Protocols

export async function listTaskManagerProtocols(serviceDeskId: string, queueId: string): Promise<JiraResponse> {
  try {
    const endpoint = `/rest/servicedeskapi/servicedesk/${serviceDeskId}/queue/${queueId}/issue`
    const response = await jiraApi.get<QueueIssueResponse>(endpoint)

    // console.log(response.data.values);
    // console.log('Jira queue issues retrieved successfully:', response.status);
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
      errorMessage = "Unknown error occurred while fetching Jira queue issues"
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}








// Función para formatear datos (simplificada sin fields y monitors)
const formatDataToJiraPost = (data: JiraRequestData, lang: string): string => {
  // Implementa la lógica de formateo aquí (puedes ajustarla según tu necesidad)
  return JSON.stringify({ data, lang })
}

// Función para obtener issues de una queue específica
export async function getQueueIssues(serviceDeskId: string, queueId: number): Promise<JiraResponse> {
  try {
    const endpoint = `/rest/servicedeskapi/servicedesk/${serviceDeskId}/queue/${queueId}/issue`
    const response = await jiraApi.get<QueueIssueResponse>(endpoint)

    // console.log(response.data.values);
    // console.log('Jira queue issues retrieved successfully:', response.status);
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
      errorMessage = "Unknown error occurred while fetching Jira queue issues"
    }

    // console.error('Error fetching Jira queue issues:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    }
  }
}

// Nueva función para obtener un issue específico (adaptada del código node-fetch)
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

// Actualización en CreateRequest:
export async function createRequest(data: JiraRequestData, lang: string, env: string): Promise<JiraResponse> {
  try {
    // Generar el summary según el entorno
    const summary =
      env === "test"
        ? `TEST - ${data.request} - ${data.workspace} - ${data.farm}`
        : `${data.request} - ${data.workspace} - ${data.farm}`

    // Crear el issue para Jira
    const issue: JiraRequest = {
      summary,
      description: formatDataToJiraPost(data, lang),
      //customfield_10076: data.date_limit,
    }

    // Obtener credenciales del secreto (simulando get_secret)
    //const secret = await getSecret('prod/api/jira_user', 'us-east-1');
    //const authHeader = `Basic ${Buffer.from(`${secret.user_jira}:${secret.password_jira}`).toString('base64')}`;

    // Procesar participantes usando la función separada
    const participantsToSubmitInJira = data.participants ? await processParticipants(data.participants) : []

    // Crear la solicitud de cliente en Jira
    await jiraApi.post("/rest/servicedeskapi/request", {
      serviceDeskId: JIRA_SD_ID,
      requestTypeId: "54",
      requestFieldValues: issue,
      // requestFieldValues: {
      //   "description": "I need a new *mouse* for my Mac",
      //   "summary": "Request JSD help via REST"
      // },
      raiseOnBehalfOf: "fgavegno@geoagro.com",
      requestParticipants: participantsToSubmitInJira,
    })

    // console.log('Jira request created successfully');
    return {
      success: true,
    }
  } catch (error) {
    let errorMessage: string

    if (axios.isAxiosError(error)) {
      errorMessage = `Jira API error: ${error.response?.status} ${error.response?.statusText} - ${error.response?.data?.message || error.message}`
    } else {
      errorMessage = "Unknown error occurred while creating Jira request"
    }

    console.error("Error creating Jira request:", errorMessage)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

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

// Nueva función para crear una solicitud de cliente según la documentación de la API
// https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-post
export async function createCustomerRequest(requestData: JiraCustomerRequestData): Promise<JiraResponse> {
  try {
    const endpoint = "/rest/servicedeskapi/request"

    // Preparar los datos según la estructura de la API
    const payload = {
      serviceDeskId: requestData.serviceDeskId,
      requestTypeId: requestData.requestTypeId,
      requestFieldValues: requestData.requestFieldValues,
      raiseOnBehalfOf: requestData.raiseOnBehalfOf,
      requestParticipants: requestData.requestParticipants || [],
    }

    // Realizar la solicitud POST
    const response = await jiraApi.post(endpoint, payload)

    console.log("Jira customer request created successfully:", response.status)
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    let errorMessage: string

    if (axios.isAxiosError(error)) {
      errorMessage = `Jira API error: ${error.response?.status} ${error.response?.statusText} - ${error.response?.data?.message || error.message}`
    } else {
      errorMessage = "Unknown error occurred while creating Jira customer request"
    }

    console.error("Error creating Jira customer request:", errorMessage)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

