"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { getLists, getSpaces, getFolderlessLists } from "@/lib/clickup"
import type { Project, Space } from "@/lib/interfaces"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, MoreHorizontal, FolderKanban, FileText, Search } from "lucide-react"

export function ProjectsList() {
  const t = useTranslations("ProjectsPage")

  // from GeoAgro Clickup Official Account
  const teamId = process.env.NEXT_PUBLIC_TEAM_ID || ""
  //const parentId = process.env.NEXT_PUBLIC_FOLDER_ID_PROJECTS || ""
  const [projects, setProjects] = useState<Project[]>([])
  const [spaces, setSpaces] = useState<Space[]>([])
  const [selectedSpace, setSelectedSpace] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")

  useEffect(() => {
    getSpaces(teamId)
      .then((data) => {
        const mappedSpaces: Space[] = data.spaces.map((space: any) => ({
          id: space.id,
          name: space.name,
          color: space.color,
          private: space.private,
          avatar: space.avatar,
          admin_can_manage: space.admin_can_manage,
          statuses: space.statuses,
          multiple_assignees: space.multiple_assignees,
          features: {
            due_dates: space.features.due_dates,
            sprints: space.features.sprints,
            time_tracking: space.features.time_tracking,
            tags: space.features.tags,
            time_estimates: space.features.time_estimates,
            checklists: space.features.checklists,
            custom_fields: space.features.custom_fields,
            remap_dependencies: space.features.remap_dependencies,
            dependency_warning: space.features.dependency_warning,
            portfolios: space.features.portfolios,
          },
          archived: space.archived,
        }))
        setSpaces(mappedSpaces)
      })
      .catch((error) => {
        console.error("Error fetching spaces:", error)
      })
  }, [])

  useEffect(() => {
    if (selectedSpace) {
      getFolderlessLists(selectedSpace)
        .then((data) => {
          const lists = data.lists
          if (Array.isArray(lists)) {
            const fetchedProjects: Project[] = lists.map((list: any) => ({
              id: list.id,
              name: list.name,
              description: list.content || "",
              taskCount: list.task_count,
              space: list.space?.name || "",
              progress: 0,
              due_date: list.due_date ? new Date(Number.parseInt(list.due_date)).toLocaleDateString() : "",
              status: list.status?.status,
            }))
            setProjects(fetchedProjects)
          } else {
            console.error("Unexpected data format:", lists)
          }
        })
        .catch((error) => {
          console.error("Error fetching folderless lists:", error)
        })
    }
  }, [selectedSpace])

  return (
    <div className="container px-1 py-10 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Select value={selectedSpace} onValueChange={(value) => setSelectedSpace(value)}>
            <SelectTrigger className="w-[380px]">
              <SelectValue placeholder="Select space" />
            </SelectTrigger>
            <SelectContent>
              {spaces.map((space) => (
                <SelectItem key={space.id} value={space.id}>
                  {space.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search projects...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <FolderKanban className="h-8 w-8 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">{t("noProjectsTitle")}</h3>
                <p className="text-sm text-muted-foreground">{t("noProjectsSubtitle")}</p>
              </CardContent>
            </Card>
          )}

          {projects
            .filter(
              (project) =>
                project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .map((project) => (
              <Card key={project.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold min-h-12">{project.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t("ddLabel")}</DropdownMenuLabel>
                      {/* <DropdownMenuItem>
                      <Link href={`/projects/${project.id}/edit`}>
                        {t('ddEdit')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/projects/${project.id}/edit-v2`}>
                        {t('ddEdit')+" v2"}
                      </Link>
                    </DropdownMenuItem> 
                    <DropdownMenuItem>
                      <Link
                        href={`https://app.clickup.com/${teamId}/v/li/${project.id}`}
                        target='_blank'>
                        {t('ddGoTo')}
                      </Link>
                    </DropdownMenuItem> */}
                      <DropdownMenuItem>
                        <Link href={`/projects/${project.id}/tasks`}>{t("ddTasks")}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">{t("ddDelete")}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">{project.description}</CardDescription>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-sm">
                        <FileText className="mr-1 h-4 w-4" />
                        {project.taskCount} tasks
                        {/* <div className="flex -space-x-2"> */}
                        {/* project.team.slice(0, 3).map((member, i) => (
                        <Avatar key={i} className="border-2 border-background">
                          <AvatarImage src={member.image} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      ))}
                      {project.team.length > 3 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-sm">
                          +{project.team.length - 3}
                        </div>
                      )*/}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {/* <Users2 className="mr-1 h-4 w-4" />
                      {project.team.length} members*/}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <CalendarDays className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>Due {new Date(project.due_date).toLocaleDateString()}</span>
                        </div>
                        <span className="text-muted-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="flex justify-end">
                      <div className={`text-sm px-2.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700`}>
                        {project.status?.status}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}

