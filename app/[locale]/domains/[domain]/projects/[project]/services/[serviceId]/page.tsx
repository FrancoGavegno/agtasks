"use client"

import { useParams } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ServiceDetail } from "@/components/projects/service-detail"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export default function ServiceDetailPage() {
  const params = useParams()
  const { domain, project, serviceId } = params
  const t = useTranslations("ServiceDetailPage")

  return (
    <div className="container w-full pt-4 pb-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/">{t("BreadcrumbItem-1")}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {/* <BreadcrumbItem>
            <BreadcrumbLink href={`/domains/${domain}/projects`}>Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/domains/${domain}/projects/${project}`}>Project</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator /> */}
          <BreadcrumbItem>
            <Link href={`/domains/${domain}/projects/${project}/services`}>{t("BreadcrumbItem-2")}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("BreadcrumbPage")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-5 mb-5">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <ServiceDetail serviceId={serviceId as string} />
    </div>
  )
}
