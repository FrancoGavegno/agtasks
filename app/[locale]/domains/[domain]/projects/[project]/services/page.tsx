import { apiClient } from '@/lib/integrations/amplify'
import { ServicesPageDetails } from "@/components/services/services"
import { BreadcrumbWithTranslations } from "@/components/ui/breadcrumb-with-translations"

export default async function ServicesPage({
  params,
}: {
  params: { domain: string; project: string };
}) {
  const projectName = await apiClient.getProject(params.project).then(data => data?.name || "");

  return (
    <div className="container w-full pt-4 pb-4">
      <BreadcrumbWithTranslations
        items={[
          {
            label: projectName,
            href: `/domains/${params.domain}/settings`
          },
          {
            label: "Services",
            translationKey: "ServicesPage.BreadcrumbPage",
            isCurrent: true
          }
        ]}
      />

      <ServicesPageDetails />
    </div>
  )
}
