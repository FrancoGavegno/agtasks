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
  JiraRequest,
} from "@/lib/interfaces"

const JIRA_API_URL = process.env.NEXT_PUBLIC_JIRA_API_URL
const JIRA_API_TOKEN = process.env.NEXT_PUBLIC_JIRA_API_TOKEN

// Jira Service Desk ID  
// const JIRA_SD_ID = process.env.NEXT_PUBLIC_JIRA_SD_ID || "your_jira_sd_id"

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


// Función para formatear datos que se usaba en createService 
// (Eliminar luego de confirmar la creación del servicio en Jira)
// function formatDataToJiraPost(data: JiraRequestData, lang: string): string {
//   return JSON.stringify({ data, lang })
// }


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

interface CreateSubtaskParams {
  parentIssueKey: string;
  summary: string;
  description?: string;
}

interface JiraSubtaskResponse {
  id: string;
  key: string;
  self: string;
  [key: string]: any; // Allow additional Jira fields
}

export async function createSubtask(
  parentIssueKey: string,
  summary: string,
  userEmail: string,
  description: string = ""
): Promise<JiraSubtaskResponse | void> {
  const bodyData = JSON.stringify({
    fields: {
      project: {
        key: parentIssueKey.split('-')[0] // extrae el prefijo del issue, ej: "PROY"
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
    }
  });

  try {
    const response: Response = await fetch(`${JIRA_API_URL}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${JIRA_API_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: bodyData
    });

    console.log(`Response: ${response.status} ${response.statusText}`);
    const data: JiraSubtaskResponse = await response.json();
    console.log("Created subtask:", data);
    return data;
  } catch (err) {
    console.error("Error creating subtask:", err);
  }
}


// export async function createTask({
//   summary,
//   description,
//   projectKey,
//   issueType = 'Task',
// }: {
//   summary: string;
//   description: string;
//   projectKey: string;
//   issueType?: string;
// }) {
//   const bodyData = JSON.stringify({
//     fields: {
//       project: {
//         key: projectKey
//       },
//       summary,
//       description: {
//         type: 'doc',
//         version: 1,
//         content: [
//           {
//             type: 'paragraph',
//             content: [
//               {
//                 type: 'text',
//                 text: description
//               }
//             ]
//           }
//         ]
//       },
//       issuetype: {
//         name: issueType
//       }
//     }
//   });

//   try {
//     const response = await fetch(`${JIRA_API_URL}/rest/api/107/issue`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Basic ${JIRA_API_TOKEN}`,
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: bodyData
//     });

//     const text = await response.text();

//     console.log(`Response: ${response.status} ${response.statusText}`);
//     console.log(text);
//     return JSON.parse(text);
//   } catch (err) {
//     console.error('Error creando tarea en Jira:', err);
//     return null;
//   }
// }


// export async function createServiceOld(requestData: JiraServiceRequest) {
//   const bodyData = `{
//   "requestFieldValues": {
//     "description": "I need a new mouse for my Mac",
//     "summary": "Request JSD help via REST"
//   },
//   "requestParticipants": [],
//   "requestTypeId": "153",
//   "serviceDeskId": "107",
//   "raiseOnBehalfOf": "fgavegno@geoagro.com"
// }`;

//   fetch(`${JIRA_API_URL}/rest/servicedeskapi/request`, {
//     method: 'POST',
//     headers: {
//       'Authorization': `Basic ${JIRA_API_TOKEN}`,
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: bodyData
//   })
//     .then(response => {
//       console.log(
//         `Response: ${response.status} ${response.statusText}`
//       );
//       return response.text();
//     })
//     .then(text => console.log(text))
//     .catch(err => console.error(err));
// }

// Tasks 

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



