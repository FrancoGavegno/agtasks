import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;


export const getLists = async (folderId: string) => {
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
  // https://developer.clickup.com/reference/gettasks

  return {

  }
}


export const setCustomFieldValue = async (taskId: string, fieldId: string) => {
  // https://developer.clickup.com/reference/setcustomfieldvalue

  return {

  }
}