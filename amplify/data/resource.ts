import { 
  type ClientSchema, 
  a, 
  defineData 
} from "@aws-amplify/backend";

const schema = a.schema({

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

  Project: a.model({
    domainId: a.string().required(), 
    id: a.string().required(), // "TEM"
    name: a.string().required(), // "PROTOCOLOS"
    language: a.string().required(), // "ES"
    queueId: a.integer(), // 82   
    deleted: a.boolean().default(false), 
  }),

  Service: a.model({
    serviceName: a.string().required(), // Nombre interno en Agtasks
    externalServiceKey: a.string(), // ID en el task manager (ej. issueKey de Jira)
    sourceSystem: a.string().required(), // Ej.: "jira", "clickup", etc.
    externalTemplateId: a.string().required(), // ID del template usado en el task manager

    // Referencias externas a 360 
    workspaceId: a.string().required(),
    campaignId: a.string().required(),
    farmId: a.string().required(),

    totalArea: a.float(),
    startDate: a.date(),
    endDate: a.date(),
  }),

  ServiceField: a.model({
    serviceId: a.string().required(), // FK local
    fieldId: a.string().required(),   // ID del Field en 360 (referencia externa)
  }),

  ServiceTask: a.model({
    serviceId: a.string().required(),       // FK local
    externalTemplateId: a.string().required(), // Referencia al sub-template del task manager (opcional, si existen)
    sourceSystem: a.string().required(),    // Ej.: "jira"
    roleId: a.string().required(),          // FK local a Role (asignado manualmente)
    userId: a.string().required(),          // FK local a 360 User (asignado manualmente)
  }),

  Role: a.model({
    name: a.string().required(),
    language: a.string(),
  }),

}).authorization((allow) => [allow.publicApiKey()]);


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
