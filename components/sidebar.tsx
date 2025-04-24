"use client"

import { useEffect, useState } from "react"
import { Link } from "@/i18n/routing"
// import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { User, Project } from "@/lib/interfaces"
import { listProjectsByDomain } from "@/lib/services/agtasks"

import DomainSelector from "@/components/navbar/domain-selector"
import ProjectSelector from "@/components/navbar/project-selector"
import { Settings, FolderCheck, ClipboardCheck, Folder, LayoutList } from "lucide-react"


// const sidebarAdminNavItems = [
//   {
//     title: "Apps",
//     href: "/apps",
//   },
//   {
//     title: "Protocols",
//     href: "/protocols",
//   },
//   {
//     title: "Teams",
//     href: "/teams",
//   },
//   {
//     title: "Forms",
//     href: "/forms",
//   },
//   {
//     title: "Projects",
//     href: "/projects",
//   }
// ]

const sidebarNavItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Manage your domain settings"
  }
]

const projectNavItems = [
  {
    title: "Project page",
    href: "",
    icon: Folder,
    description: "Manage your project page"
  },
  {
    title: "Services",
    href: "/services",
    icon: LayoutList,
    description: "Manage your services"
  },
  // {
  //   title: "Tasks",
  //   href: "/tasks",
  //   icon: ClipboardCheck,
  //   description: "Manage your tasks"
  // },
]

// Navigation data
// const sidebarNavItems = [
//   {
//     title: "Accounts",
//     href: "/accounts",
//   },
//   {
//     title: "Dashboard",
//     href: "/dashboard",
//   },
//   {
//     title: "Tasks",
//     href: "/tasks",
//   },
//   {
//     title: "Calendar",
//     href: "/calendar",
//   },
//   {
//     title: "Reports",
//     href: "/reports",
//   },
//   {
//     title: "Settings",
//     href: "/settings",
//   },
// ]

interface Props {
  user: User
}

export function AppSidebar({ user }: Props) {
  //const pathname = usePathname()

  const [selectedDomain, setSelectedDomain] = useState<number | null>(null)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    if (selectedDomain) {
      listProjectsByDomain(selectedDomain).then(setProjects)
    }
  }, [selectedDomain])

  return (
    <Sidebar className="pt-12">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <DomainSelector user={user} onDomainSelect={setSelectedDomain} />
            <SidebarMenu>
              {sidebarNavItems.map((item) => {
                const Icon = item.icon 
                return (
                  <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={`/domains/${selectedDomain}${item.href}`}>
                      <Icon className="h-4 w-4" />
                     {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                ) 
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <ProjectSelector projects={projects} onProjectSelect={setSelectedProject} />
            <SidebarMenu>
              {projectNavItems.map((item) => {
                const Icon = item.icon 
                return (
                  <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={`/domains/${selectedDomain}/projects/${selectedProject}${item.href}`}>
                      <Icon className="h-4 w-4" />
                     {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                ) 
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

