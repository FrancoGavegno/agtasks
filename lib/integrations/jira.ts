"use server"

import axios, { type AxiosError, type AxiosResponse } from "axios"
import type {
  JiraCustomerData,
  // JiraResponse,
  // JiraRequestData,
  // JiraRequest,
  // JiraCustomerRequestData,
  // JiraServiceRequest,
  // JiraRequest,
  QueueIssueResponse,
  JiraProjectRequest,
  JiraProjectResponse,
  JiraServiceResponse,
  JiraSubtaskResponse,
} from "@/lib/interfaces"

import {
  type CreateServiceFormValues,
  type SelectedLotDetail
} from "@/components/projects/validation-schemas"

// Interfaces 
interface JiraStatus {
  name: string;
}

interface JiraSubtask {
  key: string;
  fields: {
    summary: string;
    status: JiraStatus;
    [key: string]: any; // Para campos personalizados dinámicos
  };
}

interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    subtasks?: JiraSubtask[];
    [key: string]: any;
  };
}

interface SubtaskResult {
  key: string;
  summary: string;
  status: string;
  customFields?: Record<string, any>; // Objeto para almacenar custom fields
}

interface JiraResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ListTasksResult {
  issueKey: string;
  issueSummary: string;
  subtasks: SubtaskResult[];
}

interface JiraDescriptionFields {
  description: string;
  descriptionPlain: string;
}

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

// Service y Task Description Field Formatting
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

// Service Desk Customers
export async function getCustomer(email: string, serviceDeskId: string): Promise<JiraResponse> {
  try {
    // const endpoint = `/rest/servicedeskapi/customer`
    const endpoint = `/rest/servicedeskapi/servicedesk/${serviceDeskId}/customer`
    const response = await jiraApi.get(endpoint, {
      params: {
        query: encodeURIComponent(email),
        start: 0,
        limit: 5
      }
    })

    // Check if customer exists in the response
    const customers = response.data.values || []
    const customer = customers.find((c: any) => c.emailAddress === email)

    if (customer) {
      return {
        success: true,
        data: customer
      }
    }

    return {
      success: false,
      error: "Customer not found"
    }
  } catch (error) {
    let errorMessage: string

    if (axios.isAxiosError(error)) {
      errorMessage = `Jira API error: ${error.response?.status} ${error.response?.statusText} - ${error.response?.data?.message || error.message}`
    } else {
      errorMessage = "Unknown error occurred while fetching Jira customer"
    }

    return {
      success: false,
      error: errorMessage
    }
  }
}

export async function createCustomer(customerData: JiraCustomerData, serviceDeskId: string): Promise<JiraResponse> {
  try {
    // const endpoint = "/rest/servicedeskapi/customer"
    const endpoint = `/rest/servicedeskapi/servicedesk/${serviceDeskId}/customer`
    const response = await jiraApi.post(endpoint, customerData)

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    let errorMessage: string

    if (axios.isAxiosError(error)) {
      errorMessage = `Jira API error: ${error.response?.status} ${error.response?.statusText} - ${error.response?.data?.message || error.message}`
    } else {
      errorMessage = "Unknown error occurred while creating Jira customer"
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

// Protocol Templates & Services
export async function listServicesByProject(
  domainId: string, 
  serviceDeskId: string, 
  queueId: string
): Promise<JiraResponse> {
  try {
    const endpoint = `/rest/servicedeskapi/servicedesk/${serviceDeskId}/queue/${queueId}/issue`
    const response = await jiraApi.get<QueueIssueResponse>(endpoint)
    
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
  serviceDeskId: string,
  requestTypeId: string 
): Promise<JiraServiceResponse> {
  try {
    const endpoint = "/rest/servicedeskapi/request";

    const payload = {
      serviceDeskId: parseInt(serviceDeskId, 10),
      requestTypeId: parseInt(requestTypeId, 10),
      requestFieldValues: {
        summary: serviceName,
        description: jiraDescription,
      },
      raiseOnBehalfOf: userEmail
    };

    // console.log('Creating Jira service with payload:', JSON.stringify(payload, null, 2));

    const response = await jiraApi.post(endpoint, payload);
    // console.log('Jira service created successfully:', response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    let errorMessage: string;
    let errorDetails: Record<string, unknown> = {};
    
    if (axios.isAxiosError(error)) {
      errorDetails = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      };
    }

    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      errorDetails = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: errorData,
        headers: error.response?.headers
      };
      errorMessage = `Jira API error: ${error.response?.status} ${error.response?.statusText} - ${errorData?.errorMessages?.join(', ') || errorData?.message || error.message}`;
    } else {
      errorMessage = "Unknown error occurred while creating Jira service";
    }

    console.error("Error creating Jira service:", {
      errorMessage,
      errorDetails,
      originalError: error
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Tasks
export async function createSubtask(
  parentIssueKey: string,
  summary: string,
  userEmail: string,
  description: string,
  agtasksUrl: string,
  taskType: string,
  serviceDeskId: string
): Promise<JiraSubtaskResponse | void> {
  try {
    // Create the subtask
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
                  text: description
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
        customfield_10338: agtasksUrl,
        customfield_10371: taskType,        
      }
    }

    const endpoint = `${JIRA_API_URL}/rest/api/3/issue`
    const response = await jiraApi.post(endpoint, payload)
    const subtaskKey = response.data.key
    
    if (userEmail !== ""){    
      // let participantsToSubmitInJira: string[] = []
      let customerId: string = ""

      // Usar GetCustomer para buscar el cliente existente
      const customerResult = await getCustomer(userEmail, serviceDeskId);
      
      if (customerResult.success && customerResult.data) {
        customerId = customerResult.data.accountId
        // participantsToSubmitInJira.push(customerResult.data.accountId);

        console.log("Encontré este customer: ", userEmail)
      } else {

        // Crear cliente si no existe usando CreateCustomer
        const customerData: JiraCustomerData = {
          displayName: encodeURIComponent(userEmail),
          email: encodeURIComponent(userEmail),
        }

        const createCustomerResult = await createCustomer(customerData, serviceDeskId)
        if (createCustomerResult.success && createCustomerResult.data) {
          // participantsToSubmitInJira.push(createCustomerResult.data.accountId)
          customerId = customerResult.data.accountId

          console.log("Tuve que crear este customer: ", userEmail)
        } else {
          throw new Error(
            `Failed to create customer for participant: ${userEmail}. Error: ${createCustomerResult.error}`,
          )
        }

      }

      if (customerId !== "") {
        const participantEndpoint = `/rest/servicedeskapi/request/${subtaskKey}/participant`
        const participantPayload = {
          accountIds: customerId
        }

        await jiraApi.post(participantEndpoint, participantPayload)

      }

      // const participants = await processParticipants([userEmail], serviceDeskId)
      
      // if (participants.length > 0) {
      //   const participantEndpoint = `/rest/servicedeskapi/request/${subtaskKey}/participant`
      //   const participantPayload = {
      //     accountIds: participants
      //   }
      //   await jiraApi.post(participantEndpoint, participantPayload)
      // }

    }

    return response.data
  } catch (err) {
    console.error("Error creating subtask:", err)
    throw err
  }
}

export async function listTasksbyService(
  issueIdOrKey: string,
  customFieldsToFetch: string[] = []
): Promise<JiraResponse<ListTasksResult>> {
  try {
    const endpoint = `/rest/api/3/issue/${issueIdOrKey}`
    const response = await jiraApi.get<JiraIssue>(endpoint)
    
    const issueData = response.data
    const subtasks = issueData.fields?.subtasks || []

    const enrichedSubtasks = await Promise.all(
      subtasks.map(async (subtask) => {
        let customFieldsData: Record<string, any> = {}

        if (customFieldsToFetch.length > 0) {
          const fieldsQuery = customFieldsToFetch.join(',')

          const response = await jiraApi.get<JiraSubtask>(
            `/rest/api/3/issue/${subtask.key}?fields=${fieldsQuery}`
          )
          
          customFieldsData = response.data.fields
        }

        return {
          key: subtask.key,
          summary: subtask.fields.summary,
          status: subtask.fields.status.name,
          customFields: customFieldsData
        }
      })
    );

    const result: ListTasksResult = {
      issueKey: issueData.key,
      issueSummary: issueData.fields.summary,
      subtasks: enrichedSubtasks,
    };

    return {
      success: true,
      data: result,
    };
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
