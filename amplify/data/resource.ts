import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a
  .schema({
    DomainProtocol: a.model({
      domainId: a.string().required(),
      tmProtocolId: a.string().required(),
      name: a.string().required(),
      language: a.string().required(),
    }),

    DomainRole: a.model({
      domainId: a.string().required(),
      name: a.string().required(),
      language: a.string().required(),
    }),

    DomainForm: a.model({
      domainId: a.string().required(),
      ktFormId: a.string().required(),
      name: a.string().required(),
      language: a.string().required(),
    }),

    Role: a.model({
      name: a.string().required(),
      language: a.string().required(),
      // tasks: a.hasMany("ServiceTask", "roleId"),
    }),

    // User: a.model({
    //   name: a.string().required(),
    //   email: a.string().required(),
    //   tmInvitationStatus: a.enum(["notsent", "sent", "accepted", "rejected"]), // A date time scalar type that is represented server-side as an extended ISO 8601 date and time string in the format YYYY-MM-DDThh:mm:ss.sssZ
    //   tmInvitationSent: a.datetime(),
    //   tmInvitationAnswered: a.datetime(),
    //   tmAccountId: a.string().required(),
    //   tmAccountType: a.enum(["customer", "agent", "admin"])
    // }),

    Project: a.model({
      domainId: a.string().required(), // FK to 360 Domain
      areaId: a.string().required(), // FK to 360 Area
      sourceSystem: a.string().required(), // Task Manager, ex.: 'jira'
      projectId: a.string().required(), // FK to Task Manager // serviceDeskId  
      requestTypeId: a.string().required(),
      queueId: a.integer().required(), // FK to Task Manager Default Queue
      name: a.string().required(),
      language: a.string().required(),  
      deleted: a.boolean().default(false).required(),
      services: a.hasMany("Service", "projectId"),
    }),

    Service: a.model({
      // FK to Project
      project: a.belongsTo("Project", "projectId"),
      projectId: a.string().required(), 
      
      // FK to Task Manager 
      externalTemplateId: a.string().required(), // Request Template ID 
      externalServiceKey: a.string().required(),  // Request ID 
      
      // FK to 360 
      workspaceId: a.string().required(), 
      workspaceName: a.string(),
      campaignId: a.string().required(), 
      campaignName: a.string(),
      farmId: a.string().required(), 
      farmName: a.string(),
      
      totalArea: a.float().required(),
      serviceName: a.string().required(),
      startDate: a.string().required(),
      endDate: a.string(),

      // ServiceField[]
      fields: a.hasMany("ServiceField", "serviceId"),

      // ServiceTask[]
      tasks: a.hasMany("ServiceTask", "serviceId"), 
    }),

    ServiceTask: a.model({
      // FK to Project
      project: a.belongsTo("Project", "projectId"),
      projectId: a.string(), 
      
      // FK to Service
      service: a.belongsTo("Service", "serviceId"),
      serviceId: a.string(), 
      
      // FK to Task Manager 
      externalTemplateId: a.string().required(), // SubTask Template ID 
      
      // FK to 360 
      workspaceId: a.string(), 
      workspaceName: a.string(),
      campaignId: a.string(), 
      campaignName: a.string(),
      farmId: a.string(), 
      farmName: a.string(),

      totalArea: a.float(),
      taskName: a.string().required(), 
      taskType: a.string(), // ex.: tillage, fieldvisit, administrative 
      userEmail: a.string().required(), 
      
      // Submitted Form Data
      formData: a.json(),  
    }),

    ServiceField: a.model({
      // FK to Service
      service: a.belongsTo("Service", "serviceId"),
      serviceId: a.string(), 
      
      // FK To ServiceTask
      task: a.belongsTo("ServiceTask", "taskId"),      
      taskId: a.string(), 
      
      // FK to 360 Field
      fieldId: a.string().required(), 
      fieldName: a.string().required(),
      hectares: a.integer(),
      crop: a.string(),
      hybrid: a.string(),
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