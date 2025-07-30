import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;


export const getSpaces = async (teamId: string) => {
  // https://api.clickup.com/api/v2/team/9011455509/space
  try {
    const response = await axios.get(`${API_URL}/team/${teamId}/space`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${API_KEY}`,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(`Error fetching spaces: ${err}`);
  }
}


export const getFolders = async (spaceId: string) => {
  // https://developer.clickup.com/reference/getfolders
  try {
    const response = await axios.get(`${API_URL}/space/${spaceId}/folder`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${API_KEY}`,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(`Error fetching folders: ${err}`);
  }
}


export const getLists = async (folderId: string) => {
  // https://developer.clickup.com/reference/getlists
  try {
    const response = await axios.get(`${API_URL}/folder/${folderId}/list`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${API_KEY}`,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(`Error fetching lists: ${err}`);
  }
}


export const getFolderlessLists = async (spaceId: string) => {
  // https://api.clickup.com/api/v2/space/90113467542/list
  try {
    const response = await axios.get(`${API_URL}/space/${spaceId}/list`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${API_KEY}`,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(`Error fetching folderless lists: ${err}`);
  }
}


export const getList = async (listId: string) => {
  try {
    const response = await axios.get(`${API_URL}/list/${listId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching list:', error);
    throw new Error('Error fetching list');
  }
}


export const getWorkspaceCustomFields = async (teamId: string) => {
  try {
    const response = await axios.get(`${API_URL}/team/${teamId}/field`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${API_KEY}`,
      },
    });
    return response.data.fields;
  } catch (error) {
    console.error('Error fetching workspace custom fields:', error);
    throw new Error('Error fetching workspace custom fields');
  }
}


export const getListCustomFields = async (listId: string) => {
  try {
    const response = await axios.get(`${API_URL}/list/${listId}/field`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching custom fields:', error);
    throw new Error('Error fetching custom fields');
  }
}


export const getTasks = async (listId: string) => {
  try {
    const response = await axios.get(`${API_URL}/list/${listId}/task`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${API_KEY}`,
      },
    });
    return response.data.tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Error fetching tasks');
  }
}
