import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_FMS_API_URL || '';
const apiKey = process.env.NEXT_PUBLIC_FMS_API_KEY || '';


export const listUsersByWs = async (workspaceId: number) => {
  const query = `query ($workspaceId: Int!) {
    list_users_by_ws(workspaceId: $workspaceId) {
      email
      firstName
      id
      lastName
      permission
    }
  }`;

  try {
    const response = await axios.post(apiUrl, {
        query,
        variables: {
          workspaceId
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        }
      }
    );

    return response.data.data.list_users_by_ws.map((user: any) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    }));

  } catch (error) {
    console.error('Error fetching list_users_by_ws from API:', error);
    return [];
  }
}
