import { 
  type ClientSchema, 
  a, 
  defineData 
} from "@aws-amplify/backend";


const schema = a
  .schema({
    DomainProtocol: a.model({
      domainId: a.string().required(),
      tmProtocolId: a.string().required(),
      name: a.string().required(),
      language: a.string().required(),
    }),

    DomainForm: a.model({
      domainId: a.string().required(),
      ktFormId: a.string().required(),
      name: a.string().required(),
      language: a.string().required(),
    }),
    
    Project: a.model({
      domainId: a.string().required(), 
      areaId: a.string().required(), 
      tmpSourceSystem: a.string().default("jira"),
	    tmpServiceDeskId: a.string().default("TEM"), 
	    tmpRequestTypeId: a.string().default("87"),
      tmpQueueId: a.string().default("82"),
      serviceDeskId: a.string().required(),  
      requestTypeId: a.string().required(),
      queueId: a.string(),
      name: a.string().required(),
      language: a.string(),  
      services: a.hasMany("Service", "projectId"),
      tasks: a.hasMany("Task", "projectId"),
      deleted: a.boolean().default(false),
    }),

    Service: a.model({
      project: a.belongsTo("Project", "projectId"),
      projectId: a.string().required(), 
      tmpRequestId: a.string().required(), // template
			requestId: a.string().required(), // client
      name: a.string().required(),
      protocolId: a.string().required(),
      tasks: a.hasMany("Task", "serviceId"),
			deleted: a.boolean().default(false),
    }),

    Task: a.model({
      project: a.belongsTo("Project", "projectId"),
      projectId: a.string(),
      service: a.belongsTo("Service", "serviceId"),
      serviceId: a.string(),       
      tmpSubtaskId: a.string(), // template
      subtaskId: a.string(), // client 
      taskName: a.string().required(), 
      taskType: a.string().required(), 
      taskData: a.string(), // JSON string data for submitted form
      userEmail: a.string().required(), 
      formId: a.string(),
      workspaceId: a.integer().required(), 
      workspaceName: a.string(),
      seasonId: a.integer().required(), 
      seasonName: a.string(),
      farmId: a.integer().required(), 
      farmName: a.string(),   
      fieldIdsOnlyIncluded: a.integer().array(), // si existen lotes aquí, se excluye el resto de lotes
      deleted: a.boolean().default(false),      
    }),

  })
  .authorization((allow) => [allow.publicApiKey()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});