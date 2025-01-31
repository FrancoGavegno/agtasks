// export type Folder = "DS_Bossio" | "DS_Local" | "DS_local_KMZ" | "DS_local_shp" | "DS_MyJD_360Dev"

export type Visibility = "COMMUNITY" | "PRIVATE"

export type Scope = "NONE" | "INHERITED" | "DOMAIN" | "AREA" | "WORKSPACE" | "FARM" | "FIELD"

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
  scope: Scope
}

export type FormValues = Omit<Template, 'id'>

export type FormData = {
  name: string;
  description?: string;
  [key: string]: string | undefined; 
};
