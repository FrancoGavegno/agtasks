import axios from 'axios';

// Función para hacer la llamada a la API y obtener las opciones
export const listFarms = async (apiCallName: string) => {
  const endpoint = process.env.NEXT_PUBLIC_360_API_URL; // Ejemplo de endpoint
  const query = `
    query ($workspaceId: Int!, $seasonId: Int, $userId: String, $lang: String, $includeGeoJson: Boolean) {
      list_farms(workspaceId: $workspaceId, seasonId: $seasonId, userId: $userId, lang: $lang, includeGeoJson: $includeGeoJson) {
        id
        name
      }
    }
  `;
  const variables = {
    workspaceId: 11452,
    seasonId: 1999,
    userId: null,
    lang: "es",
    includeGeoJson: false
  };

  try {
    if (!endpoint) {
      throw new Error('API endpoint is not defined');
    }
    const response = await axios.post(endpoint, {
      query,
      variables
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_360_API_KEY || ''
      }
    });

    // Procesar la respuesta de la API
    return response.data.data.list_farms.map((farm: any) => ({
      value: farm.id,
      label: farm.name
    }));
  } catch (error) {
    console.error('Error fetching options from API:', error);
    return [];
  }
};

