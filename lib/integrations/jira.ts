"use server"

import axios, {
  type AxiosError,
  type AxiosResponse
} from "axios"
import {
  JiraProjectRequest,
  JiraProjectResponse,
  QueueIssueResponse,
  ListTasksResult,
  JiraDescriptionFields,
  JiraResponse,
  JiraSubtaskResponse,
  JiraCustomerData,
  JiraIssue,
  JiraSubtask
} from "@/lib/interfaces/jira"

// Define the Field interface for lot/field data
interface Field {
  fieldName?: string
  hectares?: number
  crop?: string
  hybrid?: string
  workspaceName?: string
  campaignName?: string
  farmName?: string
}

const JIRA_API_URL = process.env.NEXT_PUBLIC_JIRA_API_URL
const JIRA_API_TOKEN = process.env.NEXT_PUBLIC_JIRA_API_TOKEN

// Validate environment variables
if (!JIRA_API_URL || !JIRA_API_TOKEN) {
  console.error("Missing Jira API configuration:", {
    JIRA_API_URL: !!JIRA_API_URL,
    JIRA_API_TOKEN: !!JIRA_API_TOKEN
  });
}

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

    return {
      success: false,
      error: errorMessage,
    }
  }
}

export async function getCustomer(email: string): Promise<string | null> {
  // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-users/#api-rest-api-3-users-search-get
  // FG Note 2025-06-30: I couldn't use the 'Get User' and 'Get Customer' methods. 
  // I had to use 'Get Users' instead.
  // The 'Get User' method only accept AccountId (i don´t have it) and the 'Get Customer' 
  // method is in experimental mode.

  try {
    const response = await fetch(
      `${JIRA_API_URL}/rest/api/3/user/search?query=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${JIRA_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`Error buscando usuario Jira: ${response.status} ${response.statusText}`);
      return null;
    }

    const users = await response.json();
    if (Array.isArray(users) && users.length > 0) {
      return users[0].accountId;
    }

    console.error(`No se encontró el usuario con email: ${email}`);
    return null;

  } catch (error) {
    console.error('Error en lookupAccountId:', error);
    return null;
  }
}

export async function createCustomer(customerData: JiraCustomerData): Promise<JiraResponse> {
  // https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-customer/#api-rest-servicedeskapi-customer-post

  try {
    //const endpoint = `/rest/servicedeskapi/servicedesk/${serviceDeskId}/customer`
    const endpoint = "/rest/servicedeskapi/customer"
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

// export async function getAllRequestTypes(serviceDeskId: number): Promise<any> {
//   try {

//     const response = await fetch(
//       `${JIRA_API_URL}/rest/servicedeskapi/requesttype?serviceDeskId=${serviceDeskId}`,
//       {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//           Authorization: `Basic ${JIRA_API_TOKEN}`,
//           'X-ExperimentalApi': 'opt-in'
//         },
//       }
//     );

//     response.json().then(
//       (rq) => { rq.values }
//     )
//   } catch (error) {
//     let errorMessage: string;

//     if (axios.isAxiosError(error)) {
//       const errorData = error.response?.data;
//       errorMessage = `Jira API error: ${error.response?.status} ${error.response?.statusText} - ${errorData?.errorMessages?.join(', ') || errorData?.message || error.message}`;
//     } else {
//       errorMessage = "Unknown error occurred while creating Jira service";
//     }

//     return {
//       success: false,
//       error: errorMessage,
//     };
//   }
// }

export const generateDescriptionField = async (fields: Field[]): Promise<JiraDescriptionFields> => {
  const totalArea: number | string = fields.reduce((sum: number, lot: any) => sum + (lot.hectares || 0), 0) || '0';

  const fieldsTable: string = `
  ||Lote||Hectáreas||Cultivo||Híbrido||
  ${fields.map((lot: any) => `| ${lot.fieldName || '-'} | ${lot.hectares || '-'} | ${lot.crop || '-'} | ${lot.hybrid || '-'} |
  `).join('')}
  `;

  const description: string = `
  *Espacio de trabajo:* ${fields[0]?.workspaceName || 'No especificado'}
  *Campaña:* ${fields[0]?.campaignName || 'No especificado'} 
  *Establecimiento:* ${fields[0]?.farmName || 'No especificado'}
  *Hectáreas totales:* ${totalArea} h
  *Lotes:*
  ${fieldsTable}
  `;

  // Formato de lista vertical (más legible para muchos lotes)
  const descriptionPlain: string = `
  • Espacio de trabajo: ${fields[0]?.workspaceName || 'No especificado'}
  • Campaña: ${fields[0]?.campaignName || 'No especificado'}
  • Establecimiento: ${fields[0]?.farmName || 'No especificado'}
  • Hectáreas totales: ${totalArea} h
  • Lotes:
  ${fields.map((lot: any, index: number) =>
    `Lote ${index + 1}:
     - Nombre: ${lot.fieldName || '-'}
     - Hectáreas: ${lot.hectares || '-'}
     - Cultivo: ${lot.crop || '-'}
     - Híbrido: ${lot.hybrid || '-'}`
  ).join('\n\n')}
  `;

  return {
    description,
    descriptionPlain
  };
};

// interface JiraRequest {
//   serviceName: string
//   jiraDescription: string
//   userEmail: string
//   serviceDeskId: string
//   requestTypeId: string
// }

export async function createService(
  serviceName: string,
  jiraDescription: string,
  userEmail: string,
  serviceDeskId: string,
  requestTypeId: string
): Promise<JiraResponse> {
  // Service Desk Request (Protocol or Service)  
  // https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-post
  
  // console.log("createService data:", {
  //   serviceName,
  //   jiraDescription,
  //   userEmail,
  //   serviceDeskId,
  //   requestTypeId
  // })

  try {
    const endpoint = "/rest/servicedeskapi/request";    
    // const requestParticipants = await handleParticipants(["francogavegno@gmail.com", "gavegnofranco@gmail.com"])
    // console.log("requestParticipants: ", requestParticipants)

    const payload = {
      serviceDeskId: parseInt(serviceDeskId, 10),
      requestTypeId: parseInt(requestTypeId, 10),
      requestFieldValues: {
        summary: serviceName,
        description: jiraDescription,
      },
      raiseOnBehalfOf: userEmail,
      // requestParticipants: requestParticipants
    };

    const response = await jiraApi.post(endpoint, payload);
    //console.log('Jira service created successfully:', response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    let errorMessage: string;

    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      errorMessage = `Jira API error: ${error.response?.status} ${error.response?.statusText} - ${errorData?.errorMessages?.join(', ') || errorData?.message || error.message}`;
    } else {
      errorMessage = "Unknown error occurred while creating Jira service";
    }

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
  description: string,
  agtasksUrl: string,
  taskType: string,
  //serviceDeskId: string
): Promise<JiraSubtaskResponse | void> {
  // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-post

  try {
    // Reporter field 
    let accountId: string | null = null

    // Get Customer 
    accountId = await getCustomer(userEmail);

    // Create Customer If not Exist  
    if (!accountId) {
      const customerData: JiraCustomerData = {
        displayName: encodeURIComponent(userEmail),
        email: encodeURIComponent(userEmail),
      }

      const createCustomerResult = await createCustomer(customerData);
      if (createCustomerResult && createCustomerResult.success && createCustomerResult.data && createCustomerResult.data.accountId) {
        accountId = createCustomerResult.data.accountId;
      } else {
        // If customer creation failed, return or throw error
        throw new Error(
          `Failed to create Jira customer for ${userEmail}: ${createCustomerResult?.error || "Unknown error"}`
        );
      }
    }

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
        // customfield_10305: userEmail,
        customfield_10338: agtasksUrl,
        customfield_10371: taskType,
        // customfield_10437: 
        ...(accountId ? { reporter: { id: accountId } } : {})
      }
    }

    const endpoint = `${JIRA_API_URL}/rest/api/3/issue`
    const response = await jiraApi.post(endpoint, payload)
    return response.data
  } catch (err) {
    console.error("Error creating subtask:", err)
    throw err
  }
}

export async function createIssue(
  parentIssueKey: string,
  summary: string,
  userEmail: string,
  description: string,
  agtasksUrl?: string,
  taskType?: string,
  serviceDeskId?: string
): Promise<JiraSubtaskResponse | void> {
  try {
    // Validate required parameters
    if (!parentIssueKey || !summary || !userEmail || !description) {
      throw new Error("Missing required parameters for Jira issue creation");
    }

    // Reporter field 
    let accountId: string | null = null

    // Get Customer 
    accountId = await getCustomer(userEmail);

    // Create Customer If not Exist  
    if (!accountId) {
      const customerData: JiraCustomerData = {
        displayName: encodeURIComponent(userEmail),
        email: encodeURIComponent(userEmail),
      }

      const createCustomerResult = await createCustomer(customerData);
      if (createCustomerResult && createCustomerResult.success && createCustomerResult.data && createCustomerResult.data.accountId) {
        accountId = createCustomerResult.data.accountId;
      } else {
        // If customer creation failed, return or throw error
        throw new Error(
          `Failed to create Jira customer for ${userEmail}: ${createCustomerResult?.error || "Unknown error"}`
        );
      }
    }

    const payload = {
      fields: {
        project: {
          key: parentIssueKey
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
          name: "Task"
          //id: "10002"
        },
        customfield_10338: agtasksUrl,
        customfield_10371: taskType,
        ...(accountId ? { reporter: { id: accountId } } : {})
      }
    }

    const endpoint = `${JIRA_API_URL}/rest/api/3/issue`
    const response = await jiraApi.post(endpoint, payload)

    if (!response.data) {
      throw new Error("No response data from Jira API");
    }

    return response.data
  } catch (err) {
    console.error("Error creating Jira issue:", err)
    throw err
  }

}


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

// export async function getIssue(issueIdOrKey: string): Promise<JiraResponse> {
//   try {
//     const endpoint = `/rest/api/3/issue/${issueIdOrKey}`
//     const response = await jiraApi.get(endpoint)

//     return {
//       success: true,
//       data: response.data,
//     }
//   } catch (error) {
//     let errorMessage: string

//     if (axios.isAxiosError(error)) {
//       errorMessage = `Jira API error: ${error.response?.status} ${error.response?.statusText} - ${error.response?.data?.message || error.message}`
//     } else {
//       errorMessage = "Unknown error occurred while fetching Jira issue"
//     }

//     return {
//       success: false,
//       error: errorMessage,
//     }
//   }
// }
