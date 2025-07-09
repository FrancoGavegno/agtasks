"use client"

import { Link } from "@/i18n/routing"
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import TabsNavigation from "@/components/settings/tabs-navigation"
import { useState, useEffect } from 'react'
import { listProjectsByDomain } from '@/lib/services/agtasks'
import type { Project } from '@/lib/interfaces'

export default function SettingsPage() {
  const { domain, project } = useParams<{ domain: string, project?: string }>();
  const t = useTranslations("SettingsPage")
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined)

  useEffect(() => {
    async function fetchProject() {
      if (domain && project) {
        const projectsRaw = await listProjectsByDomain(domain)
        // Map to Project interface
        const projects: Project[] = projectsRaw.map((p: any) => ({
          id: p.id ?? p.projectId,
          projectId: p.projectId ?? p.id,
          name: p.name,
          domainId: p.domainId,
          areaId: p.areaId,
          serviceDeskId: p.serviceDeskId,
          requestTypeId: p.requestTypeId,
          sourceSystem: p.sourceSystem ?? "unknown", // default if missing
          language: p.language ?? "en", // default language
          queueId: p.queueId ?? p.serviceDeskId ?? "",
          deleted: p.deleted ?? false,
          // ...add any other required fields, with defaults if missing
        }))
        const found: Project | undefined = projects.find((p) => p.id?.toString() === project.toString())
        setSelectedProject(found)
      } else {
        setSelectedProject(undefined)
      }
    }
    fetchProject()
  }, [domain, project])

  return (
    <div className="container w-full pt-4 pb-4">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href={`/domains/${domain}/settings`}>{t("BreadcrumbLink")}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("BreadcrumbPage")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* <div className="flex justify-between items-center mt-5 mb-5">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div> */}

      <TabsNavigation selectedProject={selectedProject} />
    </div>
  )
}
