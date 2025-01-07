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
    const response = await axios.get(`${API_URL}/list/${listId}/task`, {
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


// export const createList = async (data: any, folderId: string = `${FOLDER_ID}`) => {
//   const response = await fetch(`${API_URL}/folder/${folderId}/list`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `${API_KEY}`
//     },
//     body: JSON.stringify(data)
//   });
//   if (!response.ok) {
//     throw new Error('Error creating list');
//   }
//   return response.json();
// };


export const getTasks = async (listId: string) => {
  try {
    const response = await axios.get(`${API_URL}/list/${listId}/task`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Error fetching tasks'); 
  }
};

export const updateTask = async (taskId: string, data: any) => {
  const response = await fetch(`${API_URL}/task/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${API_KEY}`
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Error updating task');
  }
  return response.json();
};