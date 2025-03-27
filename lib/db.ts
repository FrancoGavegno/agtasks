import type { ServicePortal, Role } from "./types"

// Base de datos en memoria
let servicePortals: ServicePortal[] = [
  // {
  //   id: "2",
  //   name: "Client Portal - Agriculture",
  //   domain: "GeoAgro",
  //   area: "Area 1",
  //   workspace: "Workspace 1",
  //   servicePortal: "CLIENT 1",
  //   protocols: ["Satellite monitoring and weed control", "Variable rate recommendations & applications"],
  //   roles: ["1", "3"],
  //   forms: ["form1", "form3", "form5"],
  // },
  {
    id: "1",
    name: "Rigran Tech",
    domain: "Rigran",
    area: "Area 1",
    workspace: "Workspace 1",
    servicePortal: "Project 1",
    protocols: ["Weed Control", "Satellite monitoring and weed control"],
    roles: ["2", "4"],
    forms: ["form2", "form7", "form9"],
  },
]

let roles: Role[] = [
  { id: "1", name: "Administrator" },
  { id: "2", name: "Manager" },
  { id: "3", name: "User" },
  { id: "4", name: "Guest" },
  { id: "5", name: "Auditor" },
]

// Funciones para ServicePortal
export async function getAllServicePortals(): Promise<ServicePortal[]> {
  return servicePortals
}

export async function getServicePortalById(id: string): Promise<ServicePortal | null> {
  return servicePortals.find((portal) => portal.id === id) || null
}

export async function createServicePortal(
  data: Omit<ServicePortal, "id" | "protocols" | "roles" | "forms">,
): Promise<ServicePortal> {
  const newPortal: ServicePortal = {
    ...data,
    id: (servicePortals.length + 1).toString(),
    protocols: [],
    roles: [],
    forms: [],
  }

  servicePortals.push(newPortal)
  return newPortal
}

export async function updateServicePortal(id: string, data: Partial<ServicePortal>): Promise<ServicePortal | null> {
  const index = servicePortals.findIndex((portal) => portal.id === id)

  if (index === -1) {
    return null
  }

  servicePortals[index] = {
    ...servicePortals[index],
    ...data,
  }

  return servicePortals[index]
}

export async function deleteServicePortal(id: string): Promise<boolean> {
  const initialLength = servicePortals.length
  servicePortals = servicePortals.filter((portal) => portal.id !== id)

  return servicePortals.length < initialLength
}

export async function searchServicePortals(query: string): Promise<ServicePortal[]> {
  return servicePortals.filter((portal) => portal.name.toLowerCase().includes(query.toLowerCase()))
}

// Funciones para Role
export async function getAllRoles(): Promise<Role[]> {
  return roles
}

export async function getRoleById(id: string): Promise<Role | null> {
  return roles.find((role) => role.id === id) || null
}

export async function createRole(name: string): Promise<Role> {
  const newRole: Role = {
    id: (roles.length + 1).toString(),
    name,
  }

  roles.push(newRole)
  return newRole
}

export async function updateRole(id: string, name: string): Promise<Role | null> {
  const index = roles.findIndex((role) => role.id === id)

  if (index === -1) {
    return null
  }

  roles[index] = {
    ...roles[index],
    name,
  }

  return roles[index]
}

export async function deleteRole(id: string): Promise<boolean> {
  const initialLength = roles.length
  roles = roles.filter((role) => role.id !== id)

  return roles.length < initialLength
}

