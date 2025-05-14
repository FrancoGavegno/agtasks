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

export default function SettingsPage(
  // {
  //   params,
  // }: {
  //   params: { domain: string; };
  // }
) {
  const { domain } = useParams<{ domain: string }>();
  // const { domain } = params
  const t = useTranslations("SettingsPage")

  return (
    <div className="container w-full pt-4 pb-4">
      <Breadcrumb>
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

      <div className="flex justify-between items-center mt-5 mb-5">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <TabsNavigation />
    </div>
  )
}
