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

interface JiraDescriptionFields {
  description: string;
  descriptionPlain: string;
}

import {
  type CreateServiceFormValues,
  type SelectedLotDetail
} from "@/components/projects/validation-schemas"

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


// Genera campos Description de Service y Tasks en Jira
export const generateDescriptionField = async (data: CreateServiceFormValues): Promise<JiraDescriptionFields> => {
  const totalArea: number | string = data.selectedLots.reduce((sum: number, lot: SelectedLotDetail) => sum + (lot.hectares || 0), 0) || '0';

  const fieldsTable: string = `
  ||Lote||Hectáreas||Cultivo||Híbrido||
  ${data.selectedLots.map((lot: SelectedLotDetail) => `| ${lot.fieldName || '-'} | ${lot.hectares || '-'} | ${lot.cropName || '-'} | ${lot.hybridName || '-'} |
  `).join('')}
  `;

  const description: string = `
  *Espacio de trabajo:* ${data.workspaceName || 'No especificado'}
  *Campaña:* ${data.campaignName || 'No especificado'} 
  *Establecimiento:* ${data.establishmentName || 'No especificado'}
  *Hectáreas totales:* ${totalArea} h
  *Lotes:*
  ${fieldsTable}
  `;

  // Formato de lista vertical (más legible para muchos lotes)
  const descriptionPlain: string = `
  • Espacio de trabajo: ${data.workspaceName || 'No especificado'}
  • Campaña: ${data.campaignName || 'No especificado'}
  • Establecimiento: ${data.establishmentName || 'No especificado'}
  • Hectáreas totales: ${totalArea} h
  • Lotes:
  ${data.selectedLots.map((lot: SelectedLotDetail, index: number) =>
    `Lote ${index + 1}:
     - Nombre: ${lot.fieldName || '-'}
     - Hectáreas: ${lot.hectares || '-'}
     - Cultivo: ${lot.cropName || '-'}
     - Híbrido: ${lot.hybridName || '-'}`
  ).join('\n\n')}
  `;

  return {
    description,
    descriptionPlain
  };
};

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

export async function createService(
  serviceName: string,
  jiraDescription: string,
  userEmail: string,
  serviceDeskId: string = '140', // '107'
  requestTypeId: string = '252' // 153 = 01-Tandil 
): Promise<JiraServiceResponse> {

  try {
    const endpoint = "/rest/servicedeskapi/request";
    
    const payload = {
      serviceDeskId: serviceDeskId,
      requestTypeId: requestTypeId,
      requestFieldValues: {
        summary: serviceName,
        description: jiraDescription,
      },
      raiseOnBehalfOf: userEmail
    };

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
  description: string, // Ahora recibe el texto en formato Wiki
  agtasksUrl: string
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
      customfield_10338: agtasksUrl

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



