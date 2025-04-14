import { Project } from "@/lib/interfaces"


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
