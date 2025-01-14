// export interface Project {
//   id: number;
//   name: string;
//   description: string;
//   taskCount: number;
//   space: string;
//   tags: string[];
//   progress: number;
//   dueDate: string;
//   status: string;
//   team: { name: string, image: string }[];
//   thumbnail?: string;
// }


export interface Project {
  id: string;
  name: string;
  description: string;
  taskCount?: number;
  deleted?: boolean;
  orderindex?: number;
  status?: PurpleStatus;
  priority?: null;
  assignee?: null;
  due_date: string;
  start_date?: string;
  folder?: Folder;
  space?: Folder;
  inbound_address?: string;
  archived?: boolean;
  override_statuses?: boolean;
  statuses?: StatusElement[];
  permission_level?: string;
  tags?: string[];
  progress?: number;
  team?: { name: string, image: string }[];
  thumbnail?: string;
}

export interface Folder {
  id: string;
  name: string;
  hidden?: boolean;
  access: boolean;
}

export interface PurpleStatus {
  status: string;
  color: string;
  hide_label: boolean;
}

export interface StatusElement {
  id: string;
  status: string;
  orderindex: number;
  color: string;
  type: string;
  status_group: string;
}

// export interface CustomFieldList {
//   fields: Field[];
// }

export interface Field {
  id:               string;
  name:             string;
  type:             string;
  type_config:      TypeConfig;
  date_created:     string;
  hide_from_guests: boolean;
  required:         boolean;
}

export interface TypeConfig {
  sorting:        string;
  new_drop_down?: boolean;
  options:        Option[];
}

export interface Option {
  id:         string;
  name:       string;
  color:      null;
  orderindex: number;
}
