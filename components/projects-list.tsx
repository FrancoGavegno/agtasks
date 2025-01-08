"use client"

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useState, useEffect } from 'react'
import { getLists } from '@/lib/clickup';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import {
  CalendarDays,
  MoreHorizontal,
  Users2,
  FolderKanban
} from 'lucide-react'

// Ref.: https://developer.clickup.com/reference/getlists
// {
//     "lists": [
//       {
//         "id": "901106185206",
//         "name": "Ambientación con Mapa de Productividad",
//         "orderindex": 1,
//         "content": "",
//         "status": null,
//         "priority": null,
//         "assignee": null,
//         "task_count": 4,
//         "due_date": "1733554800000",
//         "start_date": null,
//         "folder": {
//           "id": "90113518509",
//           "name": "Siembra Variable",
//           "hidden": false,
//           "access": true
//         },
//         "space": {
//           "id": "90111991192",
//           "name": "Ambientación",
//           "access": true
//         },
//         "archived": false,
//         "override_statuses": false,
//         "permission_level": "create"
//       },
//       { ... },
//     ]
//   }

interface Project {
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

// const projects: Project[] = [
//   {
//     id: 1,
//     name: "Website Redesign",
//     description: "Redesign and implement the new company website",
//     progress: 68,
//     dueDate: "2024-02-15",
//     team: [
//       { name: "Alex Kim", image: "/placeholder.svg" },
//       { name: "Sarah Chen", image: "/placeholder.svg" },
//       { name: "Mike Jones", image: "/placeholder.svg" },
//     ],
//     status: "In Progress",
//   },
//   {
//     id: 2,
//     name: "Mobile App Development",
//     description: "Create a new mobile app for customer engagement",
//     progress: 23,
//     dueDate: "2024-03-30",
//     team: [
//       { name: "Lisa Wong", image: "/placeholder.svg" },
//       { name: "Tom Smith", image: "/placeholder.svg" },
//     ],
//     status: "Planning",
//   },
//   {
//     id: 3,
//     name: "Marketing Campaign",
//     description: "Q1 2024 digital marketing campaign",
//     progress: 92,
//     dueDate: "2024-01-31",
//     team: [
//       { name: "John Doe", image: "/placeholder.svg" },
//       { name: "Emma Wilson", image: "/placeholder.svg" },
//       { name: "James Brown", image: "/placeholder.svg" },
//       { name: "Maria Garcia", image: "/placeholder.svg" },
//     ],
//     status: "Review",
//   },
// ]

//const projects: any = []

export function ProjectsList() {
  const t = useTranslations('ProjectsPage');
  // parentId = Folder ID From GeoAgro Clickup Official Account
  const parentId = process.env.NEXT_PUBLIC_PROJECTS || "123";
  const [projects, setProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    getLists(parentId)
      .then((data) => {
        const lists = data.lists || data;
        if (Array.isArray(lists)) {
          const fetchedProjects: Project[] = lists.map((list: any) => ({
            id: list.id,
            name: list.name,
            description: list.content || '',
            taskCount: list.task_count,
            space: list.space?.name || 'Unknown Space',
            tags: ['Project', 'Agriculture', 'GeoAgro'],
            progress: 0,
            dueDate: new Date(parseInt(list.due_date)).toLocaleDateString(),
            status: 'In Progress',
            team: [
              { name: "Alex Kim", image: "/placeholder.svg" },
              { name: "Sarah Chen", image: "/placeholder.svg" },
              { name: "Mike Jones", image: "/placeholder.svg" },
            ],
            thumbnail: undefined
          }));
          setProjects(fetchedProjects);
        } else {
          console.error('Unexpected data format:', lists);
        }
      })
      .catch((error) => {
        console.error('Error fetching lists:', error);
      });
  }, [])
  
  return (
    <div className="container px-1 py-10 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">{t('title')}</h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        {/* <div className='flex items-center space-x-2'>
          <Button className="gap-2">
            <Link href="/projects/create">
              <span>
                {t('createButton')}
              </span>
            </Link>
          </Button>
        </div> */} 
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <FolderKanban className="h-8 w-8 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">{t('noProjectsTitle')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('noProjectsSubtitle')}
              </p>
            </CardContent>
          </Card>
        )}

        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">{project.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t('dropdownLabel')}</DropdownMenuLabel>
                  <DropdownMenuItem><Link href={`/projects/${project.id}/tasks`}>{t('dropdownViewDetails')}</Link></DropdownMenuItem>
                  <DropdownMenuItem><Link href={`/projects/${project.id}/tasks`}>{t('dropdownViewTasks')}</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem><Link href={`/projects/${project.id}/edit`}>{t('dropdownEdit')}</Link></DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">{t('dropdownDelete')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">{project.description}</CardDescription>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, i) => (
                      <Avatar key={i} className="border-2 border-background">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    ))}
                    {project.team.length > 3 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-sm">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users2 className="mr-1 h-4 w-4" />
                    {project.team.length} members
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <CalendarDays className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                    </div>
                    <span className="text-muted-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                <div className="flex justify-end">
                  <div className={`text-sm px-2.5 py-0.5 rounded-full font-medium
                  ${project.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : project.status === "Review"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                    {project.status}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


