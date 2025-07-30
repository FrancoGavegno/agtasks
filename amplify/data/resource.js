"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
const backend_1 = require("@aws-amplify/backend");
const schema = backend_1.a
    .schema({
    DomainProtocol: backend_1.a.model({
        domainId: backend_1.a.string().required(),
        tmProtocolId: backend_1.a.string().required(),
        name: backend_1.a.string().required(),
        language: backend_1.a.string().required(),
    }),
    DomainForm: backend_1.a.model({
        domainId: backend_1.a.string().required(),
        ktFormId: backend_1.a.string().required(),
        name: backend_1.a.string().required(),
        language: backend_1.a.string().required(),
    }),
    Project: backend_1.a.model({
        domainId: backend_1.a.string().required(),
        areaId: backend_1.a.string().required(),
        tmpSourceSystem: backend_1.a.string().default("jira"),
        tmpServiceDeskId: backend_1.a.string().default("TEM"),
        tmpRequestTypeId: backend_1.a.string().default("87"),
        tmpQueueId: backend_1.a.string().default("82"),
        serviceDeskId: backend_1.a.string().required(),
        requestTypeId: backend_1.a.string().required(),
        queueId: backend_1.a.string(),
        name: backend_1.a.string().required(),
        language: backend_1.a.string(),
        deleted: backend_1.a.boolean().default(false),
        services: backend_1.a.hasMany("Service", "projectId"),
        tasks: backend_1.a.hasMany("Task", "projectId"),
    }),
    Service: backend_1.a.model({
        project: backend_1.a.belongsTo("Project", "projectId"),
        projectId: backend_1.a.string().required(),
        tmpRequestId: backend_1.a.string(),
        requestId: backend_1.a.string(),
        name: backend_1.a.string().required(),
        deleted: backend_1.a.boolean().default(false),
        protocolId: backend_1.a.string(),
        tasks: backend_1.a.hasMany("Task", "serviceId"),
    }),
    Task: backend_1.a.model({
        project: backend_1.a.belongsTo("Project", "projectId"),
        projectId: backend_1.a.string(),
        service: backend_1.a.belongsTo("Service", "serviceId"),
        serviceId: backend_1.a.string(),
        tmpSubtaskId: backend_1.a.string(),
        subtaskId: backend_1.a.string(),
        taskName: backend_1.a.string().required(),
        taskType: backend_1.a.string().required(),
        taskData: backend_1.a.string(),
        userEmail: backend_1.a.string().required(),
        deleted: backend_1.a.boolean().default(false),
        formId: backend_1.a.string(),
        taskFields: backend_1.a.hasMany("TaskField", "taskId"),
    }),
    Field: backend_1.a.model({
        workspaceId: backend_1.a.string().required(),
        workspaceName: backend_1.a.string(),
        campaignId: backend_1.a.string().required(),
        campaignName: backend_1.a.string(),
        farmId: backend_1.a.string().required(),
        farmName: backend_1.a.string(),
        fieldId: backend_1.a.string().required(),
        fieldName: backend_1.a.string().required(),
        hectares: backend_1.a.float(),
        crop: backend_1.a.string(),
        hybrid: backend_1.a.string(),
        deleted: backend_1.a.boolean().default(false),
        taskFields: backend_1.a.hasMany("TaskField", "fieldId"),
    }),
    TaskField: backend_1.a.model({
        taskId: backend_1.a.string().required(),
        fieldId: backend_1.a.string().required(),
        task: backend_1.a.belongsTo("Task", "taskId"),
        field: backend_1.a.belongsTo("Field", "fieldId"),
    })
})
    .authorization((allow) => [allow.publicApiKey()]);
exports.data = (0, backend_1.defineData)({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "apiKey",
        apiKeyAuthorizationMode: {
            expiresInDays: 30,
        },
    },
});
//# sourceMappingURL=resource.js.map