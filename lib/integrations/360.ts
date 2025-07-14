import axios, { AxiosInstance, AxiosError } from 'axios';
import { Domain, Workspace, Season, Farm, LotField, User } from "@/lib/interfaces";

// Validar variables de entorno al inicio
const apiUrl = process.env.NEXT_PUBLIC_FMS_API_URL;
const apiKey = process.env.NEXT_PUBLIC_FMS_API_KEY;

if (!apiUrl || !apiKey) {
  throw new Error('Missing environment variables: NEXT_PUBLIC_FMS_API_URL and NEXT_PUBLIC_FMS_API_KEY must be defined');
}

// Crear un cliente axios reutilizable
const graphqlClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
  },
  timeout: 300000, // Aumentamos el timeout a 300 segundos
});

// Interfaz genérica para las respuestas de GraphQL
interface GraphQLResponse<T> {
  data?: { [key: string]: T };
  errors?: { message: string }[];
}

// Función auxiliar para realizar solicitudes GraphQL
const graphqlRequest = async <T>(
  query: string,
  variables: Record<string, any>,
  dataKey: string,
): Promise<T> => {
  try {
    const response = await graphqlClient.post<GraphQLResponse<T>>('', {
      query,
      variables,
    });

    if (response.data.errors) {
      throw new Error(JSON.stringify(response.data.errors));
    }
    return response.data.data?.[dataKey] ?? ([] as unknown as T);
  } catch (error) {
    if (error instanceof AxiosError) {
      let errorMessage: string;
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        errorMessage = `Request timed out after 30 seconds while fetching ${dataKey}`;
      } else {
        errorMessage = error.response?.data?.errors
          ? `GraphQL Errors: ${JSON.stringify(error.response.data.errors)}`
          : `Network Error: ${error.message} (Status: ${error.response?.status})`;
      }
      console.error(`Error fetching ${dataKey}:`, errorMessage);
      throw new Error(errorMessage);
    }
    console.error(`Error fetching ${dataKey}:`, error);
    throw error;
  }
};

// Listar dominios por email de usuario
export const listDomainsByUserEmail = async (user: string): Promise<Domain[]> => {
  const query = `
    query ($email: String!) {
      domains_areas_by_user(email: $email) {
        deleted
        id
        name
        languageId
      }
    }
  `;

  return graphqlRequest<Domain[]>(
    query,
    { email: user },
    'domains_areas_by_user',
  );
};

// Listar espacios de trabajo 
export const listWorkspaces = async (email: string, domainId: number, parentId: number): Promise<Workspace[]> => {
  const query = `query ($email: String!, $domainId: Int, $parentId: Int) {
      list_workspaces(email: $email, domainId: $domainId, parentId: $parentId) {
        deleted
        hasLogo
        id
        languageId
        name
        note
        parentId
        permission
      }
    }
  `;

  return graphqlRequest<Workspace[]>(
    query,
    { email, domainId: domainId, parentId: parentId },
    'list_workspaces',
  );
};

// Listar campañas 
export const listSeasons = async (workspaceId: string): Promise<Season[]> => {
  const query = `
    query ($workspaceId: Int!) {
      list_seasons(workspaceId: $workspaceId) {
        deleted
        id
        name
        startDate
        endDate
        workspaceId
      }
    }
  `;

  return graphqlRequest<Season[]>(
    query,
    { workspaceId: parseInt(workspaceId) },
    'list_seasons',
  );
};

// Listar establecimientos 
export const listFarms = async (workspaceId: string, seasonId: string): Promise<Farm[]> => {
  const query = `
    query ($workspaceId: Int!, $seasonId: Int) {
      list_farms(workspaceId: $workspaceId, seasonId: $seasonId) {
        id
        name
        permission
        seasonId
        workspaceId
        deleted
      }
    }
  `;

  return graphqlRequest<Farm[]>(
    query,
    {
      workspaceId: parseInt(workspaceId),
      seasonId: seasonId ? parseInt(seasonId) : undefined,
    },
    'list_farms',
  );
};

// Listar campos 
export const listFields = async (workspaceId: string, seasonId: string, farmId: string): Promise<LotField[]> => {
  const query = `
    query ($farmId: Int!, $seasonId: Int!, $workspaceId: Int!) {
      list_fields(farmId: $farmId, seasonId: $seasonId, workspaceId: $workspaceId) {
        cropDate
        cropId
        cropName
        farmId
        hectares
        hybridId
        hybridName
        id
        layerId
        name
        seasonId
        workspaceId
      }
    }
  `;

  return graphqlRequest<LotField[]>(
    query,
    {
      workspaceId: parseInt(workspaceId),
      seasonId: parseInt(seasonId),
      farmId: parseInt(farmId),
    },
    'list_fields',
  );
};

// Listar usuarios
export const listUsersByDomain = async (domainId: number): Promise<User[]> => {
  const query = `
    query ($domainId: Int) {
      list_users(domainId: $domainId) {
        created
        email
        firstName
        isoLanguages
        lastLogin
        lastName
      }
    }`;

  const users = await graphqlRequest<User[]>(
    query,
    { domainId },
    'list_users',
  );

  // Convertir lastLogin null a string vacío para mantener compatibilidad
  return users.map(user => ({
    ...user,
    lastLogin: user.lastLogin ?? '',
  }));
};