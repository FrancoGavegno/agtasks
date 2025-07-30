'use client'

import { Link } from "@/i18n/routing"
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/integrations/amplify'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { TasksPageDetails } from "@/components/tasks/tasks"

export default function TasksPage() {
  const { domain, project } = useParams<{ domain: string, project: string }>();
  const t = useTranslations("TasksPage")
  const [projectName, setProjectName] = useState<string>("");
  const [loadingProject, setLoadingProject] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoadingProject(true);
    apiClient.getProject(project as string).then((data) => {
      if (mounted) setProjectName(data?.name || "");
    }).finally(() => { if (mounted) setLoadingProject(false); });
    return () => { mounted = false; };
  }, [project]);

  return (
    <div className="container w-full pt-4 pb-4">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href={`/domains/${domain}/settings`}>
              {loadingProject ? <Skeleton className="inline-block h-4 w-24 align-middle" /> : projectName}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("BreadcrumbPage")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <TasksPageDetails />
    </div>
  )
}
