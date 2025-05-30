'use client'
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
// import { Button } from "@/components/ui/button"
// import { Plus } from "lucide-react"
import { ServicesPageDetails } from "@/components/projects/services"

export default function ServicesPage() {
  const { domain, project } = useParams<{ domain: string, project: string }>();
  const t = useTranslations("ServicesPage")

  return (
    <div className="container w-full pt-4 pb-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href={`/domains/${domain}/settings`}>{t("BreadcrumbItem-1")}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {/* <BreadcrumbItem>
            <Link href={`/domains/${domain}/projects/${project}`}>{t("BreadcrumbItem-2")}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator /> */}
          <BreadcrumbItem>
            <BreadcrumbPage>{t("BreadcrumbPage")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-5 mb-5">
      <div>
          <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        {/* <Link href={`/domains/${domain}/projects/${project}/services/create`} >
            <Button>
            <Plus className="mr-2 h-4 w-4" /> {t("buttonCreateService")}
            </Button>
          </Link> */}
      </div>

      <ServicesPageDetails />
    </div>
    
  )
}
