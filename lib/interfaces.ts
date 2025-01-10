export interface Project {
    id: number;
    name: string;
    description: string;
    taskCount: number;
    space: string;
    tags: string[];
    progress: number;
    dueDate: string;
    status: string;
    team: { name: string, image: string }[];
    thumbnail?: string;
  }