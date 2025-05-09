import { z } from "zod";

// Domain Protocols (amplify/data/resource.ts)

export const domainProtocolSchema = z.object({
    tmProtocolId: z.string().min(1, "tmProtocolId is required"),
    name: z.string().min(1, "name is required"),
    language: z.string().min(1, "language is required"),
});

export const domainProtocolQuerySchema = z.object({
    domainId: z.string().min(1, "domainId is required"),
});

export const deleteDomainProtocolSchema = z.object({
    domainId: z.string().min(1, "domainId is required"),
    protocolId: z.string().min(1, "protocolId is required"),
});

export type DomainProtocolInput = z.infer<typeof domainProtocolSchema>;

// Domain Roles (amplify/data/resource.ts)

export const domainRoleSchema = z.object({
    name: z.string().min(1, "name is required"),
    language: z.string().min(1, "language is required"),
});

export const domainRoleQuerySchema = z.object({
    domainId: z.string().min(1, "domainId is required"),
});

export const deleteDomainRoleSchema = z.object({
    domainId: z.string().min(1, "domainId is required"),
    roleId: z.string().min(1, "roleId is required"),
});

export type DomainRoleInput = z.infer<typeof domainRoleSchema>;

// Domain Forms (amplify/data/resource.ts)

export const domainFormSchema = z.object({
    ktFormId: z.string().min(1, "ktFormId is required"),
    name: z.string().min(1, "name is required"),
    language: z.string().min(1, "language is required"),
});

export const domainFormQuerySchema = z.object({
    domainId: z.string().min(1, "domainId is required"),
});

export const deleteDomainFormSchema = z.object({
    domainId: z.string().min(1, "domainId is required"),
    formId: z.string().min(1, "formId is required"),
});

export type DomainFormInput = z.infer<typeof domainFormSchema>;

// Jira > Services 

export const serviceQuerySchema = z.object({
    domainId: z.string().min(1, "domainId is required"),
    projectId: z.string().min(1, "projectId is required"),
    queueId: z.string().min(1, "queueId is required"),
});