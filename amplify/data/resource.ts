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
    //   tasks: a.hasMany("ServiceTask", "userId"),
    // }),

    Project: a.model({
      domainId: a.string().required(), 
      areaId: a.string().required(), // FK to 360 Area
      language: a.string().required(),  
      sourceSystem: a.string().required(), // Task Manager 'jira'
      projectId: a.string().required(), // FK to Task Manager Project 
      queueId: a.integer().required(),  // FK to Task Manager Default Queue
      // id: a.string().required(), 
      name: a.string().required(),
      deleted: a.boolean().default(false).required(),
      services: a.hasMany("Service", "projectId"),
    }),

    Service: a.model({
      projectId: a.string().required(), // FK to Project
      serviceName: a.string().required(),
      // sourceSystem: a.string().required(), // 'jira'
      externalTemplateId: a.string().required(), // FK to Task Manager Service Template ID 'TEM-57'
      externalServiceKey: a.string().required(), // TO DO: Completar cuando cree el Request en Jira 
      workspaceId: a.string().required(), // FK to 360 Workspace
      workspaceName: a.string(),
      campaignId: a.string().required(), // FK to 360 Season
      campaignName: a.string(),
      farmId: a.string().required(), // FK to 360 Farm
      farmName: a.string(),
      totalArea: a.float().required(),
      startDate: a.string().required(),
      endDate: a.string(),
      project: a.belongsTo("Project", "projectId"),
      fields: a.hasMany("ServiceField", "serviceId"),
      tasks: a.hasMany("ServiceTask", "serviceId"),
    }),

    ServiceField: a.model({
      serviceId: a.string().required(), // FK to Service
      fieldId: a.string().required(), // FK to 360 Field
      fieldName: a.string().required(),
      hectares: a.integer(),
      crop: a.string(),
      hybrid: a.string(),
      service: a.belongsTo("Service", "serviceId"),
    }),

    ServiceTask: a.model({
      serviceId: a.string().required(), // FK to Service
      externalTemplateId: a.string().required(), // FK to Task Manager Task Template ID 'TEM-58'
      taskName: a.string().required(), 
      userEmail: a.string().required(), // FK to 360 User 'fgavegno@geoagro.com'
      service: a.belongsTo("Service", "serviceId"),
      // sourceSystem: a.string().required(),
      // roleId: a.string().required(),
      // role: a.belongsTo("Role", "roleId"),
      // userId: a.string().required(),
      // user: a.belongsTo("User", "userId"),
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