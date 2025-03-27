import * as z from "zod"

export const jiraFormSchema = z.object({
  apiKey: z.string().min(1, {
    message: "La API Key es requerida",
  }),
})

export const koboFormSchema = z.object({
  apiKey: z.string().optional(),
})

export const portalFormSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre es requerido",
  }),
  domain: z.string().min(1, {
    message: "El dominio es requerido",
  }),
  area: z.string().min(1, {
    message: "El área es requerida",
  }),
  workspace: z.string().optional(),
  jiraProject: z.string().min(1, {
    message: "El proyecto es requerido",
  }),
})

export type JiraFormValues = z.infer<typeof jiraFormSchema>
export type KoboFormValues = z.infer<typeof koboFormSchema>
export type PortalFormValues = z.infer<typeof portalFormSchema>

