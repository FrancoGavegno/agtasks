import { type ClientSchema } from "@aws-amplify/backend";
declare const schema: import("@aws-amplify/data-schema").ModelSchema<import("@aws-amplify/data-schema-types").SetTypeSubArg<{
    types: {
        DomainProtocol: import("@aws-amplify/data-schema").ModelType<{
            fields: {
                domainId: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                tmProtocolId: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                name: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                language: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
            };
            identifier: import("@aws-amplify/data-schema").ModelDefaultIdentifier;
            secondaryIndexes: [];
            authorization: [];
            disabledOperations: [];
        }, never>;
        DomainForm: import("@aws-amplify/data-schema").ModelType<{
            fields: {
                domainId: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                ktFormId: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                name: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                language: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
            };
            identifier: import("@aws-amplify/data-schema").ModelDefaultIdentifier;
            secondaryIndexes: [];
            authorization: [];
            disabledOperations: [];
        }, never>;
        Project: import("@aws-amplify/data-schema").ModelType<{
            fields: {
                domainId: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                areaId: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                tmpSourceSystem: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, "default", undefined>;
                tmpServiceDeskId: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, "default", undefined>;
                tmpRequestTypeId: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, "default", undefined>;
                tmpQueueId: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, "default", undefined>;
                serviceDeskId: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                requestTypeId: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                queueId: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined>;
                name: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                language: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined>;
                deleted: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<boolean>, "default", undefined>;
                services: import("@aws-amplify/data-schema").ModelRelationshipField<import("@aws-amplify/data-schema").ModelRelationshipTypeArgFactory<"Service", import("@aws-amplify/data-schema").ModelRelationshipTypes.hasMany, true>, "Service", "required", undefined>;
                tasks: import("@aws-amplify/data-schema").ModelRelationshipField<import("@aws-amplify/data-schema").ModelRelationshipTypeArgFactory<"Task", import("@aws-amplify/data-schema").ModelRelationshipTypes.hasMany, true>, "Task", "required", undefined>;
            };
            identifier: import("@aws-amplify/data-schema").ModelDefaultIdentifier;
            secondaryIndexes: [];
            authorization: [];
            disabledOperations: [];
        }, never>;
        Service: import("@aws-amplify/data-schema").ModelType<{
            fields: {
                project: import("@aws-amplify/data-schema").ModelRelationshipField<import("@aws-amplify/data-schema").ModelRelationshipTypeArgFactory<"Project", import("@aws-amplify/data-schema").ModelRelationshipTypes.belongsTo, false>, "Project", "required" | "valueRequired", undefined>;
                projectId: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                tmpRequestId: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined>;
                requestId: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined>;
                name: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                deleted: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<boolean>, "default", undefined>;
                protocolId: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined>;
                tasks: import("@aws-amplify/data-schema").ModelRelationshipField<import("@aws-amplify/data-schema").ModelRelationshipTypeArgFactory<"Task", import("@aws-amplify/data-schema").ModelRelationshipTypes.hasMany, true>, "Task", "required", undefined>;
            };
            identifier: import("@aws-amplify/data-schema").ModelDefaultIdentifier;
            secondaryIndexes: [];
            authorization: [];
            disabledOperations: [];
        }, never>;
        Task: import("@aws-amplify/data-schema").ModelType<{
            fields: {
                project: import("@aws-amplify/data-schema").ModelRelationshipField<import("@aws-amplify/data-schema").ModelRelationshipTypeArgFactory<"Project", import("@aws-amplify/data-schema").ModelRelationshipTypes.belongsTo, false>, "Project", "required" | "valueRequired", undefined>;
                projectId: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined>;
                service: import("@aws-amplify/data-schema").ModelRelationshipField<import("@aws-amplify/data-schema").ModelRelationshipTypeArgFactory<"Service", import("@aws-amplify/data-schema").ModelRelationshipTypes.belongsTo, false>, "Service", "required" | "valueRequired", undefined>;
                serviceId: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined>;
                tmpSubtaskId: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined>;
                subtaskId: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined>;
                taskName: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                taskType: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                taskData: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined>;
                userEmail: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                deleted: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<boolean>, "default", undefined>;
                formId: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined>;
                taskFields: import("@aws-amplify/data-schema").ModelRelationshipField<import("@aws-amplify/data-schema").ModelRelationshipTypeArgFactory<"TaskField", import("@aws-amplify/data-schema").ModelRelationshipTypes.hasMany, true>, "TaskField", "required", undefined>;
            };
            identifier: import("@aws-amplify/data-schema").ModelDefaultIdentifier;
            secondaryIndexes: [];
            authorization: [];
            disabledOperations: [];
        }, never>;
        Field: import("@aws-amplify/data-schema").ModelType<{
            fields: {
                workspaceId: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                workspaceName: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined>;
                campaignId: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                campaignName: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined>;
                farmId: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                farmName: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined>;
                fieldId: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                fieldName: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                hectares: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<number>, never, undefined>;
                crop: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined>;
                hybrid: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined>;
                deleted: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<boolean>, "default", undefined>;
                taskFields: import("@aws-amplify/data-schema").ModelRelationshipField<import("@aws-amplify/data-schema").ModelRelationshipTypeArgFactory<"TaskField", import("@aws-amplify/data-schema").ModelRelationshipTypes.hasMany, true>, "TaskField", "required", undefined>;
            };
            identifier: import("@aws-amplify/data-schema").ModelDefaultIdentifier;
            secondaryIndexes: [];
            authorization: [];
            disabledOperations: [];
        }, never>;
        TaskField: import("@aws-amplify/data-schema").ModelType<{
            fields: {
                taskId: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                fieldId: import("@aws-amplify/data-schema").ModelField<string, "required", undefined>;
                task: import("@aws-amplify/data-schema").ModelRelationshipField<import("@aws-amplify/data-schema").ModelRelationshipTypeArgFactory<"Task", import("@aws-amplify/data-schema").ModelRelationshipTypes.belongsTo, false>, "Task", "required" | "valueRequired", undefined>;
                field: import("@aws-amplify/data-schema").ModelRelationshipField<import("@aws-amplify/data-schema").ModelRelationshipTypeArgFactory<"Field", import("@aws-amplify/data-schema").ModelRelationshipTypes.belongsTo, false>, "Field", "required" | "valueRequired", undefined>;
            };
            identifier: import("@aws-amplify/data-schema").ModelDefaultIdentifier;
            secondaryIndexes: [];
            authorization: [];
            disabledOperations: [];
        }, never>;
    };
    authorization: [];
    configuration: any;
}, "authorization", (import("@aws-amplify/data-schema").Authorization<"public", undefined, false> & {
    to: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, operations: import("@aws-amplify/data-schema/dist/esm/Authorization").Operation[]) => Omit<SELF, "to">;
})[]>, "authorization">;
export type Schema = ClientSchema<typeof schema>;
export declare const data: import("@aws-amplify/plugin-types").ConstructFactory<import("@aws-amplify/graphql-api-construct").AmplifyGraphqlApi>;
export {};
//# sourceMappingURL=resource.d.ts.map