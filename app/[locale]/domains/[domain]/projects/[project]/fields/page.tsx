import { cookies } from 'next/headers'
import { apiClient } from '@/lib/integrations/amplify'
import { FieldsPageDetails } from "@/components/fields/fields"
import { BreadcrumbWithTranslations } from "@/components/ui/breadcrumb-with-translations"

export default async function FieldsPage({
  params,
}: {
  params: { domain: string; project: string };
}) {
  const cookiesList = cookies();
  const userEmail = cookiesList.get('user-email')?.value || "";
  const projectData = await apiClient.getProject(params.project);

  return (
    <div className="container w-full pt-4 pb-4">
      <BreadcrumbWithTranslations
        items={[
          {
            label: projectData?.name || 'Proyecto',
            href: `/domains/${params.domain}/settings`
          },
          {
            label: "Lotes",
            isCurrent: true
          }
        ]}
      />

      <FieldsPageDetails userEmail={userEmail} />
    </div>
  )
}
