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


export const getListCustomFields = async (projectId: string) => {

  // 'https://api.clickup.com/api/v2/list/901108557658/field'


  return {
    "fields": [
      {
        "id": "1b0d03cd-18e6-4654-b771-9f74ec424083",
        "name": "Collect_Form",
        "type": "short_text",
        "type_config": {},
        "date_created": "1735824801424",
        "hide_from_guests": false,
        "required": false
      },
      {
        "id": "36e547bf-5d11-413e-89fa-6e236b5a850a",
        "name": "Scope",
        "type": "drop_down",
        "type_config": {
          "sorting": "manual",
          "new_drop_down": true,
          "options": [
            {
              "id": "8d29df39-d142-4eca-af73-d837e061841d",
              "name": "scope-none",
              "color": null,
              "orderindex": 0
            },
            {
              "id": "89379233-ac61-4780-922d-580ad4b2006d",
              "name": "scope-360Domain",
              "color": null,
              "orderindex": 1
            },
            {
              "id": "9a6413a5-3058-4deb-a8e0-3d27f9fd0847",
              "name": "scope-360Area",
              "color": null,
              "orderindex": 2
            },
            {
              "id": "a3a27626-a4c7-42c1-94d7-66a3b8d866dd",
              "name": "scope-360Workspace",
              "color": null,
              "orderindex": 3
            },
            {
              "id": "58f2e58a-f069-42d2-b142-3ac25fcbd12e",
              "name": "scope-360Farm",
              "color": null,
              "orderindex": 4
            },
            {
              "id": "fa3bf815-8adf-40fc-a492-2d17089abbd5",
              "name": "scope-360FieldList",
              "color": null,
              "orderindex": 5
            },
            {
              "id": "35130dc1-2f09-457a-9775-e9a200572ff8",
              "name": "scope-360Field",
              "color": null,
              "orderindex": 6
            }
          ]
        },
        "date_created": "1729778621022",
        "hide_from_guests": false,
        "required": false
      },
      {
        "id": "8d0c9c7d-3223-4e75-977e-688eb060103e",
        "name": "Task_Type",
        "type": "drop_down",
        "type_config": {
          "sorting": "manual",
          "options": [
            {
              "id": "b08908e1-6357-4279-875b-d2272f2f4b55",
              "name": "Tillage",
              "color": null,
              "orderindex": 0
            },
            {
              "id": "9fd25349-f84b-4ea6-a607-49f85af09db2",
              "name": "Field Visit",
              "color": null,
              "orderindex": 1
            },
            {
              "id": "51bfdba1-65ef-4142-ac27-ffffb60a5724",
              "name": "Task",
              "color": null,
              "orderindex": 2
            }
          ]
        },
        "date_created": "1735824510022",
        "hide_from_guests": false,
        "required": false
      },
      {
        "id": "ef0f1a6b-c8ec-4cfd-8e4c-28de76b99eda",
        "name": "Field_List",
        "type": "short_text",
        "type_config": {},
        "date_created": "1735825675130",
        "hide_from_guests": false,
        "required": false
      },
      {
        "id": "f91af4a2-cd39-45d1-b63d-ff8b6e7767a0",
        "name": "Farm",
        "type": "short_text",
        "type_config": {},
        "date_created": "1735825644769",
        "hide_from_guests": false,
        "required": false
      }
    ]
  }
}