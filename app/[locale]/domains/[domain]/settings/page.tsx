import { getDomain } from '@/lib/integrations/360'
import TabsNavigation from "@/components/settings/tabs-navigation"
import { BreadcrumbWithTranslations } from "@/components/ui/breadcrumb-with-translations"

export default async function SettingsPage({
  params,
}: {
  params: { domain: string };
}) {
  const domainName = params.domain ? await getDomain(Number(params.domain)).then(data => data?.name || "") : "";

  return (
    <div className="container w-full pt-4 pb-4">
      <BreadcrumbWithTranslations
        items={[
          {
            label: domainName,
            href: `/domains/${params.domain}/settings`
          },
          {
            label: "Settings",
            translationKey: "SettingsPage.BreadcrumbPage",
            isCurrent: true
          }
        ]}
      />

      <TabsNavigation />
    </div>
  )
}