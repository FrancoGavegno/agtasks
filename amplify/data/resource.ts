import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a
  .schema({
    DomainProtocol: a.model({
      domainId: a.string().required(),
      tmProtocolId: a.string().required(),
      name: a.string().required(),
      language: a.string().required(),
    }),

    // DomainRole: a.model({
    //   domainId: a.string().required(),
    //   name: a.string().required(),
    //   language: a.string().required(),
    // }),

    DomainForm: a.model({
      domainId: a.string().required(),
      ktFormId: a.string().required(),
      name: a.string().required(),
      language: a.string().required(),
    }),

    // Role: a.model({
    //   name: a.string().required(),
    //   language: a.string().required(),
    //   // tasks: a.hasMany("ServiceTask", "roleId"),
    // }),
    
    Project: a.model({
      // 360 
      domainId: a.string().required(), 
      areaId: a.string().required(), 
      
      // Jira "Protocols Template" 
      tmpSourceSystem: a.string().default("jira"),
	    tmpServiceDeskId: a.string().default("TEM"), 
	    tmpRequestTypeId: a.string().default("87"),
      tmpQueueId: a.string().default("82"),

      // Task Manager Client Project
      serviceDeskId: a.string().required(),  
      requestTypeId: a.string().required(),
      queueId: a.string(),
      
      // Project
      name: a.string().required(),
      language: a.string(),  
      deleted: a.boolean().default(false),
      
      // Service[]
      services: a.hasMany("Service", "projectId"),
	    
      // Task[]
      tasks: a.hasMany("Task", "projectId"),
    }),

    Service: a.model({
      project: a.belongsTo("Project", "projectId"),
      projectId: a.string(), 
      
      tmpRequestId: a.string(), // template
			requestId: a.string(), // client

      // Service 
      name: a.string().required(),
			deleted: a.boolean().default(false),
            
      // Task[]
      tasks: a.hasMany("Task", "serviceId"),
    }),

    Task: a.model({
      project: a.belongsTo("Project", "projectId"),
      projectId: a.string(), 
    
      service: a.belongsTo("Service", "serviceId"),
      serviceId: a.string(), 
      
      tmpSubtaskId: a.string().required(), // template
      subtaskId: a.string(), // client 
      
      // Task
      taskName: a.string().required(), 
      taskType: a.string(), 
      taskData: a.json(), // Submitted Form Data  
      userEmail: a.string().required(), 
      deleted: a.boolean().default(false),
      
      taskFields: a.hasMany("TaskField", "taskId"),
    }),

    Field: a.model({
      // 360
      workspaceId: a.string().required(), 
      workspaceName: a.string(),
      campaignId: a.string().required(), 
      campaignName: a.string(),
      farmId: a.string().required(), 
      farmName: a.string(),
      fieldId: a.string().required(), 
      fieldName: a.string().required(),
      hectares: a.integer(),
      crop: a.string(),
      hybrid: a.string(),
      deleted: a.boolean().default(false),

      taskFields: a.hasMany("TaskField", "fieldId"),
    }),

    TaskField: a.model({
      taskId: a.string().required(),
      fieldId: a.string().required(),
      task: a.belongsTo("Task", "taskId"),
      field: a.belongsTo("Field", "fieldId"),
    })
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