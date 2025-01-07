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
