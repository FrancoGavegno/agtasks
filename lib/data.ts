import type { Account, Domain, TaskManagerType } from "@/types/account"

// Mock data for demonstration purposes
export const accounts: Account[] = [
  {
    id: "1",
    domain: "GeoAgro",
    taskManagerType: "Jira",
    taskManagerApiKey: "jira_api_key_123",
    koboToolboxApiKey: "kobo_api_key_123",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-06-20"),
  },
  {
    id: "2",
    domain: "Rigran",
    taskManagerType: "Jira",
    taskManagerApiKey: "trello_api_key_456",
    koboToolboxApiKey: "kobo_api_key_456",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-07-05"),
  },
  {
    id: "3",
    domain: "Cerestolvas",
    taskManagerType: "Jira",
    taskManagerApiKey: "clickup_api_key_789",
    koboToolboxApiKey: "kobo_api_key_789",
    createdAt: new Date("2023-03-22"),
    updatedAt: new Date("2023-08-15"),
  },
  {
    id: "4",
    domain: "Prodas Advanced",
    taskManagerType: "Jira",
    taskManagerApiKey: "asana_api_key_101",
    koboToolboxApiKey: "kobo_api_key_101",
    createdAt: new Date("2023-04-05"),
    updatedAt: new Date("2023-09-10"),
  },
]

export const domains: Domain[] = ["Agrotecnología", "Lange Conecta", "Agroyunta Tech", "Conci", "Chiara Tech", "Gaviglio + Fertil", "GeoAgro", "Rigran", "Cerestolvas", "Prodas Advanced"]
export const taskManagerTypes: TaskManagerType[] = ["Jira", "Trello", "Clickup", "Asana"]

// Mock function to get accounts with optional filtering
export function getAccounts(filter?: string): Account[] {
  if (!filter) return accounts

  const lowercaseFilter = filter.toLowerCase()
  return accounts.filter(
    (account) =>
      account.domain.toLowerCase().includes(lowercaseFilter) ||
      account.taskManagerType.toLowerCase().includes(lowercaseFilter),
  )
}

// Mock function to get an account by ID
export function getAccountById(id: string): Account | undefined {
  return accounts.find((account) => account.id === id)
}

