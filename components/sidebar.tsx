"use client"

import {
  useEffect,
  useState
} from "react"
import { Link } from "@/i18n/routing"
import { useTranslations } from 'next-intl'
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
import {
  Settings,
  FolderCheck,
  ClipboardCheck,
  Folder,
  LayoutList
} from "lucide-react"
import DomainSelector from "@/components/navbar/domain-selector"
import ProjectSelector from "@/components/navbar/project-selector"
import {
  Domain,
  Project
} from "@/lib/interfaces"
import {
  listDomainsByUserEmail
} from "@/lib/integrations/360"
import {
  listProjectsByDomain
} from "@/lib/services/agtasks"

interface Props {
  user: string
}

export function AppSidebar({ user }: Props) {
  const t = useTranslations("AppSidebar")

  const sidebarNavItems = [
    {
      title: t("sidebarNavItems-1-title"),
      href: "/settings",
      icon: Settings,
      description: t("sidebarNavItems-1-description")
    }
  ]

  const projectNavItems = [
    {
      title: t("projectNavItems-1-title"),
      href: "",
      icon: Folder,
      description: t("projectNavItems-1-description")
    },
    {
      title: t("projectNavItems-2-title"),
      href: "/services",
      icon: LayoutList,
      description: t("projectNavItems-2-description")
    },
  ]

  const [domains, setDomains] = useState<Domain[]>([])
  const [selectedDomain, setSelectedDomain] = useState<Domain>()

  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project>()

  useEffect(() => {
    const fetchDomains = async () => {
      const domainsData = await listDomainsByUserEmail(user)
      setDomains(domainsData)
      setSelectedDomain(domainsData[0])
    }
    fetchDomains()
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      if (selectedDomain) {
        const projectsData = await listProjectsByDomain(selectedDomain.id)
        setProjects(projectsData)
        setSelectedProject(projectsData[0])
      }
    }
    setProjects([])
    fetchProjects()
  }, [selectedDomain])

  return (
    <Sidebar className="pt-12">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("SidebarGroupLabel-1")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <DomainSelector
              domains={domains}
              selectedDomain={selectedDomain || domains[0]}
              onDomainSelect={setSelectedDomain}
            />
            <SidebarMenu>
              {(selectedDomain) && sidebarNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={`/domains/${selectedDomain?.id}${item.href}`}>
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
          <SidebarGroupLabel>{t("SidebarGroupLabel-2")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <ProjectSelector
              projects={projects}
              selectedProject={selectedProject || projects[0]}
              onProjectSelect={setSelectedProject} />
            <SidebarMenu>
              {(selectedProject) && projectNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={`/domains/${selectedDomain?.id}/projects/${selectedProject?.id}${item.href}`}>
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

