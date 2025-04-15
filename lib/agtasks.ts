import { Project, Service } from "@/lib/interfaces"


// TO DO: implement 
export const listProjectsByDomain = async (domainId: number) => {
  return [
    {
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
  ]
}


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


// TO DO: implement 
export const listServicesByProject = async (projectId: number) => {
  return [
    {
      id: "1",
      name: "Siembra de Maíz",
      establishment: "La Primavera",
      lots: "A1, A2, B3",
      totalHectares: 120,
      progress: 75,
      startDate: "2023-10-15",
      status: "active",
    },
    {
      id: "2",
      name: "Fertilización",
      establishment: "El Amanecer",
      lots: "C1, C2",
      totalHectares: 85,
      progress: 100,
      startDate: "2023-09-20",
      status: "completed",
    },
    {
      id: "3",
      name: "Fumigación",
      establishment: "La Primavera",
      lots: "D1",
      totalHectares: 50,
      progress: 30,
      startDate: "2023-11-05",
      status: "active",
    },
    {
      id: "4",
      name: "Cosecha de Trigo",
      establishment: "San José",
      lots: "E1, E2, E3",
      totalHectares: 200,
      progress: 0,
      startDate: "",
      status: "pending",
    },
    {
      id: "5",
      name: "Análisis de Suelo",
      establishment: "El Amanecer",
      lots: "F1, F2",
      totalHectares: 90,
      progress: 50,
      startDate: "2023-10-30",
      status: "active",
    },
  ]
}