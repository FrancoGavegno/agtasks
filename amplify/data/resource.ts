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
      language: a.string(),
      tasks: a.hasMany("ServiceTask", "roleId"),
    }),

    User: a.model({
      name: a.string().required(),
      email: a.string().required(),
      tasks: a.hasMany("ServiceTask", "userId"),
    }),

    Project: a.model({
      domainId: a.string().required(),
      id: a.string().required(),
      name: a.string().required(),
      language: a.string().required(),
      queueId: a.integer().required(),
      deleted: a.boolean().default(false).required(),
      services: a.hasMany("Service", "projectId"),
    }),

    Service: a.model({
      projectId: a.string().required(),
      project: a.belongsTo("Project", "projectId"),
      serviceName: a.string().required(),
      externalServiceKey: a.string().required(),
      sourceSystem: a.string().required(),
      externalTemplateId: a.string().required(),
      workspaceId: a.string().required(),
      workspaceName: a.string(),
      campaignId: a.string().required(),
      campaignName: a.string(),
      farmId: a.string().required(),
      farmName: a.string(),
      totalArea: a.float().required(),
      startDate: a.string().required(),
      endDate: a.string(),
      fields: a.hasMany("ServiceField", "serviceId"),
      tasks: a.hasMany("ServiceTask", "serviceId"),
    }),

    ServiceField: a.model({
      serviceId: a.string().required(),
      fieldId: a.string().required(),
      fieldName: a.string(),
      service: a.belongsTo("Service", "serviceId"),
    }),

    ServiceTask: a.model({
      serviceId: a.string().required(),
      externalTemplateId: a.string().required(),
      sourceSystem: a.string().required(),
      roleId: a.string().required(),
      userId: a.string().required(),
      taskName: a.string(),
      service: a.belongsTo("Service", "serviceId"),
      role: a.belongsTo("Role", "roleId"),
      user: a.belongsTo("User", "userId"),
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