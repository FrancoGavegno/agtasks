import axios from 'axios';
import { User, Domain } from "@/lib/interfaces"


const apiUrl = process.env.NEXT_PUBLIC_FMS_API_URL || '';
const apiKey = process.env.NEXT_PUBLIC_FMS_API_KEY || '';


// TO DO: implement 
export const getUser = async (email: string): Promise<User> => {
  return {
    "email": "fmaggioni@geoagro.com",
    "firstName": "Franco",
    "id": "50072ad0-850b-4d17-9558-bd371dfbf853",
    "lastName": "Maggioni"
  }
}


// TO DO: implement 
// export const listDomains = async (userId: string, lang?: string): Promise<Domain[]> => {
export const listDomains = async (userId: string, lang?: string) => {
  return [
    {
      "id": 8644,
      "languageId": 2,
      "name": "Agrotecnología",
      "hasLogo": false,
      "domainUrl": "agrotecnologia.com",
      "deleted": false
    },
  ]
}


// TO DO: delete this function (Review)
// export const listUsersByWs = async (workspaceId: number) => {
//   const query = `query ($workspaceId: Int!) {
//     list_users_by_ws(workspaceId: $workspaceId) {
//       email
//       firstName
//       id
//       lastName
//       permission
//     }
//   }`;

//   try {
//     const response = await axios.post(apiUrl, {
//       query,
//       variables: {
//         workspaceId
//       }
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': apiKey,
//       }
//     }
//     );

//     return response.data.data.list_users_by_ws.map((user: any) => ({
//       id: user.id,
//       name: `${user.firstName} ${user.lastName}`,
//       email: user.email,
//     }));

//   } catch (error) {
//     console.error('Error fetching list_users_by_ws from API:', error);
//     return [];
//   }
// }
