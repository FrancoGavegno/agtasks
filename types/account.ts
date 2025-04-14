export type Domain = "Agrotecnología" | "Lange Conecta" | "Agroyunta Tech" | "Conci" | "Chiara Tech" | "Gaviglio + Fertil" | "GeoAgro" | "Rigran" | "Cerestolvas" | "Prodas Advanced"
export type TaskManagerType = "Jira" | "Trello" | "Clickup" | "Asana"

export interface Account {
  id: string
  domain: Domain
  taskManagerType: TaskManagerType
  taskManagerApiKey: string
  koboToolboxApiKey: string
  createdAt: Date
  updatedAt: Date
}

