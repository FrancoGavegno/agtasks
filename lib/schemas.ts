import { z } from "zod";

// amplify/data/resource.ts DomainProtocol 

export const domainProtocolSchema = z.object({
    name: z.string().min(1, "name is required"),
    language: z.string().min(1, "language is required"),
    tmProtocolId: z.string().min(1, "tmProtocolId is required"),
    domainId: z.string().min(1, "domainId is required")
});

export type DomainProtocolInput = z.infer<typeof domainProtocolSchema>;

export const domainProtocolQuerySchema = z.object({
    domainId: z.string().min(1, "domainId is required"),
});

export const deleteDomainProtocolSchema = z.object({
    protocolId: z.string().min(1, "protocolId is required"),
});

// amplify/data/resource.ts DomainRole

export const domainRoleSchema = z.object({
    name: z.string().min(1, "name is required"),
    language: z.string().min(1, "language is required"),
    domainId: z.string().min(1, "domainId is required"),
});

export type DomainRoleInput = z.infer<typeof domainRoleSchema>;

export const domainRoleQuerySchema = z.object({
    domainId: z.string().min(1, "domainId is required"),
});

export const deleteDomainRoleSchema = z.object({
    roleId: z.string().min(1, "roleId is required"),
});

// amplify/data/resource.ts DomainForm

export const domainFormSchema = z.object({
    name: z.string().min(1, "name is required"),
    language: z.string().min(1, "language is required"),
    ktFormId: z.string().min(1, "ktFormId is required"),
    domainId: z.string().min(1, "domainId is required"),
});

export type DomainFormInput = z.infer<typeof domainFormSchema>;

export const domainFormQuerySchema = z.object({
    domainId: z.string().min(1, "domainId is required"),
});

export const deleteDomainFormSchema = z.object({
    formId: z.string().min(1, "formId is required"),
});

// Task Manager Protocol (GeoAgro Project)

export const taskManagerProtocolQuerySchema = z.object({
    projectId: z.string().min(1, "projectId is required"),
    queueId: z.string().min(1, "queueId is required"),
});

// Task Manager Service (Client Project)

export const serviceQuerySchema = z.object({
    projectId: z.string().min(1, "projectId is required"),
    queueId: z.string().min(1, "queueId is required"),
});