"use client"

import { Link } from "@/i18n/routing"
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { getDomain } from '@/lib/integrations/360'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import TabsNavigation from "@/components/settings/tabs-navigation"

export default function SettingsPage() {
  const { domain } = useParams<{ domain: string }>();
  const t = useTranslations("SettingsPage")
  const [domainName, setDomainName] = useState<string>("");
  const [loadingDomain, setLoadingDomain] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoadingDomain(true);
    if (!domain) {
      setDomainName("");
      setLoadingDomain(false);
      return;
    }
    getDomain(Number(domain)).then((data) => {
      if (mounted) setDomainName(data?.name || "");
    }).finally(() => { if (mounted) setLoadingDomain(false); });
    return () => { mounted = false; };
  }, [domain]);

  return (
    <div className="container w-full pt-4 pb-4">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href={`/domains/${domain}/settings`}>
              {loadingDomain ? <Skeleton className="inline-block h-4 w-24 align-middle" /> : domainName}
            </Link>
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

      <TabsNavigation />
    </div>
  )
}