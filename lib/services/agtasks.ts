
import { Amplify } from "aws-amplify"
import outputs from "@/amplify_outputs.json"
import { generateClient } from "aws-amplify/api"
import { Schema } from "@/amplify/data/resource"
// import { Project, Service, Role } from "@/lib/interfaces"
import { Project } from "@/lib/interfaces"

// Amplify 

let clientInstance: ReturnType<typeof generateClient<Schema>> | null = null
let configured = false
export function getClient() {
  if (!configured) {
    Amplify.configure(outputs)
    configured = true
  }

  if (!clientInstance) {
    clientInstance = generateClient<Schema>()
  }

  return clientInstance
}
const client = getClient()

// Domain DELETE
// export async function createDomain(data: { name: string }) {  
//   return await client.models.Domain.create({ name: data.name });
// }

// Domain Protocols (amplify/data/resource.ts)

export async function createDomainProtocol(domainId: string, data: { tmProtocolId: string, name: string, language: string }) {
  return await client.models.DomainProtocol.create({
    domainId,
    tmProtocolId: data.tmProtocolId,
    name: data.name,
    language: data.language
  });
}

export async function listDomainProtocols(domainId: string) {
  return await client.models.DomainProtocol.list({ filter: { domainId: { eq: domainId } } });
}

export async function deleteDomainProtocol(domainId: string, protocolId: string) {
  return await client.models.DomainProtocol.delete({ id: protocolId })
}

// Domain Roles (amplify/data/resource.ts)

export async function createDomainRole(domainId: string, data: { name: string, language: string }) {
  return await client.models.DomainRole.create({
    domainId,
    name: data.name,
    language: data.language
  });
}

export async function listDomainRoles(domainId: string) {
  return await client.models.DomainRole.list({ filter: { domainId: { eq: domainId } } });
}

export async function deleteDomainRole(domainId: string, roleId: string) {
  return await client.models.DomainRole.delete({ id: roleId })
}

// Domain Forms (amplify/data/resource.ts)

export async function createDomainForm(domainId: string, data: { name: string, language: string, ktFormId: string }) {
  return await client.models.DomainForm.create({
    domainId,
    name: data.name,
    language: data.language,
    ktFormId: data.ktFormId
  });
}

export async function listDomainForms(domainId: string) {
  return await client.models.DomainForm.list({ filter: { domainId: { eq: domainId } } });
}

export async function deleteDomainForm(domainId: string, formId: string) {
  return await client.models.DomainForm.delete({ id: formId })
}

// TO DO: implement 
export const listRoles = async (language?: string) => { 
  return [
    {
      "id": "1",
      "name": "Sponsor",
      "language": "ES"
    },
    {
      "id": "2",
      "name": "Referente interno",
      "language": "ES"
    },
    {
      "id": "3",
      "name": "Soporte Agricultura Digital",
      "language": "ES"
    },
    {
      "id": "4",
      "name": "Consultor Agronómico",
      "language": "ES"
    },
    {
      "id": "5",
      "name": "Equipo Agtech",
      "language": "ES"
    },
    {
      "id": "6",
      "name": "Productor Cliente",
      "language": "ES"
    },
    {
      "id": "7",
      "name": "Socio Regional",
      "language": "ES"
    },
    {
      "id": "8",
      "name": "Consultor AgTech",
      "language": "ES"
    },
    {
      "id": "9",
      "name": "Asesor Técnico Comercial",
      "language": "ES"
    },
    {
      "id": "10",
      "name": "Líder Proyecto",
      "language": "ES"
    },
    {
      "id": "11",
      "name": "Coordinadora General",
      "language": "ES"
    },  
  ]

}

// Projects

// TO DO: implement
export const listProjectsByDomain = async (domainId: number): Promise<Project[]> => {
  const projects = [
    {
      parentId: 1,
      id: "TEM",
      name: "PROTOCOLOS",
      language: "ES",
      queueId: 82,
      deleted: false,
    },
    {
      parentId: 1,
      id: "TEM2",
      name: "PROTOCOLOS 2",
      language: "ES",
      queueId: 83,
      deleted: false,
    },
    {
      parentId: 8644,
      id: "TAN",
      name: "01 - Tandil",
      language: "ES",
      queueId: 148,
      deleted: false,
    },
  ];

  // Filtrar proyectos cuyo parentId coincida con domainId
  const matchingProjects = projects.filter((project) => project.parentId === domainId);

  return matchingProjects;
};

// TO DO: implement 
export const getProject = async (projectId: number) => {
  return {
    "id": 1,
    "name": "01 - Tandil",
    "domain": {
      "id": 8644,
      "languageId": 2,
      "name": "Agrotecnología",
      "hasLogo": false,
      "domainUrl": "agrotecnologia.com",
      "deleted": false
    },
  }
}

// Services

// TO DO: implement 
export const listServicesByProject = async (projectId?: number) => {
  return [
    {
      "id": "srv-001",
      "name": "Monitoreo satelital lote norte",
      "establishment": "Estancia La Esperanza",
      "lots": "Lote Norte",
      "totalHectares": 120,
      "progress": 100,
      "startDate": "2025-03-01",
      "status": "Finalizado"
    },
    {
      "id": "srv-002",
      "name": "Control de malezas con imágenes NDVI",
      "establishment": "Campo El Sol",
      "lots": "Lote A",
      "totalHectares": 85,
      "progress": 90,
      "startDate": "2025-03-10",
      "status": "En progreso"
    },
    {
      "id": "srv-003",
      "name": "Siembra variable por ambiente",
      "establishment": "Agropecuaria Don Julio",
      "lots": "Sector 3",
      "totalHectares": 65,
      "progress": 100,
      "startDate": "2025-02-20",
      "status": "Finalizado"
    },
    {
      "id": "srv-004",
      "name": "Fertilización nitrogenada por prescripción",
      "establishment": "Estancia El Molino",
      "lots": "Lote 5",
      "totalHectares": 100,
      "progress": 70,
      "startDate": "2025-04-01",
      "status": "En progreso"
    },
    {
      "id": "srv-005",
      "name": "Monitoreo de malezas post-siembra",
      "establishment": "Finca Santa Clara",
      "lots": "Parcela B",
      "totalHectares": 40,
      "progress": 30,
      "startDate": "2025-04-05",
      "status": "Planificado"
    },
    {
      "id": "srv-006",
      "name": "Aplicación dirigida por zonas",
      "establishment": "Estancia Los Álamos",
      "lots": "Lote Central",
      "totalHectares": 150,
      "progress": 100,
      "startDate": "2025-01-15",
      "status": "Finalizado"
    },
    {
      "id": "srv-007",
      "name": "Monitoreo satelital semanal",
      "establishment": "Granja El Trébol",
      "lots": "Sector Oeste",
      "totalHectares": 75,
      "progress": 80,
      "startDate": "2025-03-18",
      "status": "En progreso"
    },
    {
      "id": "srv-008",
      "name": "Siembra variable de maíz",
      "establishment": "Campo La Unión",
      "lots": "Lote 2",
      "totalHectares": 90,
      "progress": 50,
      "startDate": "2025-04-10",
      "status": "En progreso"
    },
    {
      "id": "srv-009",
      "name": "Fertilización fosfórica zonificada",
      "establishment": "Finca Don Pedro",
      "lots": "Lote 4",
      "totalHectares": 60,
      "progress": 100,
      "startDate": "2025-02-28",
      "status": "Finalizado"
    },
    {
      "id": "srv-010",
      "name": "Monitoreo de malezas con drone",
      "establishment": "Agro S.A.",
      "lots": "Campo Norte",
      "totalHectares": 130,
      "progress": 60,
      "startDate": "2025-03-25",
      "status": "En progreso"
    },
    {
      "id": "srv-011",
      "name": "Control selectivo de malezas",
      "establishment": "Establecimiento La Ribera",
      "lots": "Zona A",
      "totalHectares": 55,
      "progress": 100,
      "startDate": "2025-02-05",
      "status": "Finalizado"
    },
    {
      "id": "srv-012",
      "name": "Siembra de soja por ambientes",
      "establishment": "Finca La Patria",
      "lots": "Lote Sur",
      "totalHectares": 70,
      "progress": 20,
      "startDate": "2025-04-15",
      "status": "Planificado"
    },
    {
      "id": "srv-013",
      "name": "Fertilización potásica según NDVI",
      "establishment": "Campo El Ceibo",
      "lots": "Franja Oeste",
      "totalHectares": 95,
      "progress": 75,
      "startDate": "2025-03-05",
      "status": "En progreso"
    },
    {
      "id": "srv-014",
      "name": "Seguimiento satelital de crecimiento",
      "establishment": "Estancia Tierra Fértil",
      "lots": "Sector Noreste",
      "totalHectares": 110,
      "progress": 100,
      "startDate": "2025-01-22",
      "status": "Finalizado"
    },
    {
      "id": "srv-015",
      "name": "Prescripción automática de fertilización",
      "establishment": "Finca El Horizonte",
      "lots": "Lote Principal",
      "totalHectares": 140,
      "progress": 40,
      "startDate": "2025-04-12",
      "status": "En progreso"
    }
  ]

}



