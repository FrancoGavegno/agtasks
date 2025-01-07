export type Folder = "DS_Bossio" | "DS_Local" | "DS_local_KMZ" | "DS_local_shp" | "DS_MyJD_360Dev"

// export type Template = {
//   id: string
//   name: string
// }

// export type FormValues = {
//   template: string
//   name: string
//   folder: Folder
// }

export type Visibility = "Community" | "Private"

export type Template = {
  id: string
  templateUrl: string
  name: string
  description: string
  visibility: Visibility
  tags: string[]
}

export type FormValues = Omit<Template, 'id'>
