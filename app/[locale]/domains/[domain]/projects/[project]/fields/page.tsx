import { cookies } from 'next/headers'
import { apiClient } from '@/lib/integrations/amplify'
import { FieldsPageDetails } from "@/components/fields/fields"
import { BreadcrumbWithTranslations } from "@/components/ui/breadcrumb-with-translations"

// Forzar renderizado dinámico para evitar errores en build
export const dynamic = 'force-dynamic';

export default async function FieldsPage({
  params,
}: {
  params: { domain: string; project: string };
}) {
  const cookiesList = cookies();
  const userEmail = cookiesList.get('user-email')?.value || "";
  
  // Obtener datos del proyecto de forma segura
  let projectData = null;
  try {
    projectData = await apiClient.getProject(params.project);
  } catch (error) {
    console.error("Error fetching project data:", error);
  }

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
