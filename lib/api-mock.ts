import { Artifact, CustomField, ClickUpProject } from '@/lib/types';

export const fetchArtifacts = async (): Promise<Artifact[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    { id: 'scope', name: 'Scope' },
    { id: 'area', name: 'Area' },
    { id: 'workspace', name: 'Workspace' },
    { id: 'farm', name: 'Farm' },
    { id: 'field', name: 'Field' },
    { id: 'layer', name: 'Layer' },
    { id: 'collect_form', name: 'Collect Form' },
    { id: 'inputs', name: 'Inputs' },
    { id: 'reports', name: 'Reports' },
  ];
};

export const fetchCustomFields = async (): Promise<CustomField[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    { id: 'custom_field_1', name: 'Custom Field 1' },
    { id: 'custom_field_2', name: 'Custom Field 2' },
    { id: 'custom_field_3', name: 'Custom Field 3' },
    { id: 'custom_field_4', name: 'Custom Field 4' },
    { id: 'custom_field_5', name: 'Custom Field 5' },
  ];
};

export const fetchArtifactOptions = async (artifactId: string): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const options: Record<string, string[]> = {
    scope: ['Scope 1', 'Scope 2', 'Scope 3'],
    area: ['Area A', 'Area B', 'Area C'],
    workspace: ['Workspace 1', 'Workspace 2'],
    farm: ['Farm X', 'Farm Y', 'Farm Z'],
    field: ['Field 1', 'Field 2', 'Field 3'],
    layer: ['Layer Alpha', 'Layer Beta', 'Layer Gamma'],
    collect_form: ['Form A', 'Form B', 'Form C'],
    inputs: ['Input 1', 'Input 2', 'Input 3'],
    reports: ['Report X', 'Report Y', 'Report Z'],
  };
  
  return options[artifactId as keyof typeof options] || [];
};

export const fetchClickUpProject = async (projectId: string): Promise<ClickUpProject> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulated API response
  return {
    id: projectId,
    name: "Ambientacion",
    description: "una prueba"
  };
};

