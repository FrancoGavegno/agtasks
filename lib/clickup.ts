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


// Simulated ClickUp API response
// export const getTasks = async () => {
//   // Simulated delay to mimic API call
//   await new Promise(resolve => setTimeout(resolve, 500));

//   return [
//     {
//       id: "868bypp96",
//       name: "Generar prescripción",
//       custom_item_id: 0,
//       due_date: "2023-06-15",
//       status: { status: "En progreso", color: "#4A90E2" },
//       priority: { priority: "Alta", color: "#D64045" }
//     },
//     {
//       id: "868byppa4",
//       name: "Generar reporte de prescripción",
//       custom_item_id: 0,
//       due_date: "2023-06-20",
//       status: { status: "Por hacer", color: "#A1A1A1" },
//       priority: { priority: "Media", color: "#F9C22E" }
//     },
//     {
//       id: "868byppa8",
//       name: "Plantear ensayos",
//       custom_item_id: 1001,
//       due_date: "2023-06-25",
//       status: { status: "En revisión", color: "#7B68EE" },
//       priority: { priority: "Baja", color: "#3CB371" }
//     },
//     {
//       id: "868bypp9a",
//       name: "Exportar prescripción",
//       custom_item_id: 0,
//       due_date: "2023-06-30",
//       status: { status: "Completado", color: "#61BD4F" },
//       priority: { priority: "Alta", color: "#D64045" }
//     },
//     {
//       id: "868bypp8t",
//       name: "Adaptar el mapa de prescripción al monitor de la maquina",
//       custom_item_id: 0,
//       due_date: "2023-07-05",
//       status: { status: "En progreso", color: "#4A90E2" },
//       priority: { priority: "Media", color: "#F9C22E" }
//     },
//     {
//       id: "868bypp8m",
//       name: "Realizar aplicación",
//       custom_item_id: 1002,
//       due_date: "2023-07-10",
//       status: { status: "Por hacer", color: "#A1A1A1" },
//       priority: { priority: "Alta", color: "#D64045" }
//     },
//     {
//       id: "868bypp9x",
//       name: "Procesar mapa de aplicación",
//       custom_item_id: 0,
//       due_date: "2023-07-15",
//       status: { status: "En revisión", color: "#7B68EE" },
//       priority: { priority: "Baja", color: "#3CB371" }
//     },
//     {
//       id: "868bypp9r",
//       name: "Generar reporte de labores y de calidad de aplicación",
//       due_date: "2023-07-20",
//       status: { status: "Por hacer", color: "#A1A1A1" },
//       priority: { priority: "Media", color: "#F9C22E" }
//     },
//   ];
// }


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


export const getTask = async (taskId: string) => {
  // https://developer.clickup.com/reference/gettask

  return {

  }
}


export const getCustomTaskTypes = async (teamId: string) => {
  // https://developer.clickup.com/reference/getcustomitems

  return {
    "custom_items": [
      {
        "id": 1,
        "name": "milestone",
        "name_plural": null,
        "description": null,
        "avatar": {
          "source": null,
          "value": null
        }
      },
      {
        "id": 3,
        "name": "form_response",
        "name_plural": null,
        "description": null,
        "avatar": {
          "source": null,
          "value": null
        }
      },
      {
        "id": 1001,
        "name": "FieldVisit",
        "name_plural": "FieldVisits",
        "description": null,
        "avatar": {
          "source": "fas",
          "value": "location-dot"
        }
      },
      {
        "id": 1002,
        "name": "Tillage",
        "name_plural": "Tillages",
        "description": null,
        "avatar": {
          "source": "fas",
          "value": "truck-fast"
        }
      }
    ]
  }
}

export const setCustomFieldValue = async (taskId: string, fieldId: string) => {
  // https://developer.clickup.com/reference/setcustomfieldvalue

  return {

  }
}