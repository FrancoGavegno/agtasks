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
      project: a.belongsTo("Project", "projectId"),
      projectId: a.string().required(), // FK to Project
      serviceName: a.string().required(),
      externalTemplateId: a.string().required(), // FK to Task Manager Service Template ID 'TEM-57'
      externalServiceKey: a.string().required(),  
      workspaceId: a.string().required(), // FK to 360 Workspace
      workspaceName: a.string(),
      campaignId: a.string().required(), // FK to 360 Season
      campaignName: a.string(),
      farmId: a.string().required(), // FK to 360 Farm
      farmName: a.string(),
      totalArea: a.float().required(),
      startDate: a.string().required(),
      endDate: a.string(),
      fields: a.hasMany("ServiceField", "serviceId"), // ServiceField[]
      tasks: a.hasMany("ServiceTask", "serviceId"), // ServiceTask[]
    }),

    ServiceField: a.model({
      service: a.belongsTo("Service", "serviceId"),
      serviceId: a.string().required(), // FK to Service
      fieldId: a.string().required(), // FK to 360 Field
      fieldName: a.string().required(),
      hectares: a.integer(),
      crop: a.string(),
      hybrid: a.string(),
    }),

    ServiceTask: a.model({
      service: a.belongsTo("Service", "serviceId"),
      serviceId: a.string().required(), // FK to Service
      externalTemplateId: a.string().required(), // FK to Task Manager Task Template ID 'TEM-58'
      taskType: a.string(), // ex.: tillage, fieldvisit, administrative 
      taskName: a.string().required(), 
      formData: a.json(),  // form data submitted
      userEmail: a.string().required(), // FK to 360 User, ex.: fgavegno@geoagro.com
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