export type Folder = "DS_Bossio" | "DS_Local" | "DS_local_KMZ" | "DS_local_shp" | "DS_MyJD_360Dev"

export type Visibility = "COMMUNITY" | "PRIVATE"

export type Template = {
  id: string
  templateUrl: string
  name: string
  description?: string
  taskCount?: number
  space?: string
  tags: string[]
  visibility: Visibility
  thumbnail?: string
}

export type FormValues = Omit<Template, 'id'>

export interface Artifact {
  id: string;
  name: string;
}

export interface CustomField {
  id: string;
  name: string;
}

export interface ClickUpProject {
  id: string;
  name: string;
  description: string;
}

export interface FormData {
  clickupProjectId: string;
  customFieldAssignments: Record<string, string>;
  artifactValues: Record<string, string>;
}