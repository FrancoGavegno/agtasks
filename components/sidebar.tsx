"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from 'next-intl'
// import { useParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import {
  // Settings,
  LayoutList
} from "lucide-react"
import { Domain } from "@/lib/interfaces/360"
import { type Project } from "@/lib/schemas"

interface Props {
  user: string
  selectedDomain: Domain | undefined
  selectedProject: Project | undefined
  domains: Domain[]
  projects: Project[]
}

export function AppSidebar({ user, selectedDomain, selectedProject, domains, projects }: Props) {
  const t = useTranslations("AppSidebar")
  const pathname = usePathname();

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
    {
      title: t("projectNavItems-4-title"),
      href: "/fields",
      icon: LayoutList,
      description: t("projectNavItems-4-description")
    },
  ]

  return (
    <aside className="w-56 min-h-screen bg-gray-50 border-r border-gray-100 py-4 px-2">
      {/* Grupo: Proyectos */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-400 font-semibold tracking-wide px-2 mb-1">
          <span>{selectedProject?.name}</span>
        </div>
        {selectedProject && (
          <nav className="flex flex-col gap-1">
            {projectNavItems.map((item) => {
              const itemHref = `/domains/${selectedDomain?.id}/projects/${selectedProject?.id}${item.href}`;
              const selected = pathname.startsWith(itemHref);
              return (
                <Link
                  key={item.title}
                  href={itemHref}
                  className={
                    `flex items-center gap-3 px-2 py-2 rounded-md transition-colors group text-sm ` +
                    (selected
                      ? 'bg-gray-100 text-gray-900 font-semibold'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900')
                  }
                >
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>
        )}
      </div>
    </aside>
  )
}

