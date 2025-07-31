import { Link } from "@/i18n/routing"
import { cookies } from 'next/headers'
import { apiClient } from '@/lib/integrations/amplify'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { FieldsPageDetails } from "@/components/fields/fields"

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
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href={`/domains/${params.domain}/settings`}>
              {projectData?.name || 'Proyecto'}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Lotes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <FieldsPageDetails userEmail={userEmail} />
    </div>
  )
}
