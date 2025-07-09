"use client"

import {
  useEffect,
  useState
} from "react"
import { Link } from "@/i18n/routing"
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
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
  selectedDomain: Domain | undefined
  selectedProject: Project | undefined
  domains: Domain[]
  projects: Project[]
}

export function AppSidebar({ user, selectedDomain, selectedProject, domains, projects }: Props) {
  const { domain } = useParams<{ domain: string }>();
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
      title: t("projectNavItems-2-title"),
      href: "/services",
      icon: LayoutList,
      description: t("projectNavItems-2-description")
    },
    {
      title: t("projectNavItems-3-title"),
      href: "/tasks",
      icon: LayoutList,
      description: t("projectNavItems-3-description")
    },
  ]

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 py-4 px-2">
      {/* Grupo: Proyectos */}
      <div className="mb-6">
        {/* <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide px-2 mb-1">{t("SidebarGroupLabel-2")}</div>
        <div className="text-sm text-gray-700 font-bold px-2 mb-2 truncate" title={selectedProject?.name}>{selectedProject?.name ?? "-"}</div> */}
        {selectedProject && (
          <nav className="flex flex-col gap-1">
            {projectNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.title}
                  href={`/domains/${selectedDomain?.id}/projects/${selectedProject?.id}${item.href}`}
                  className="flex items-center gap-3 px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors group"
                >
                  <Icon className="h-5 w-5 text-gray-400 group-hover:text-gray-700" />
                  <span className="text-base">{item.title}</span>
                </Link>
              )
            })}
          </nav>
        )}
      </div>
    </aside>
  )
}

