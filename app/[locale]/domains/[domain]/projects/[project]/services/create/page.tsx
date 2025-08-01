import { BreadcrumbWithTranslations } from "@/components/ui/breadcrumb-with-translations"
import ServiceStepper from "@/components/services/stepper"
import { cookies } from 'next/headers'
import { apiClient } from '@/lib/integrations/amplify'

export default async function Page({
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
                        href: `/domains/${params.domain}/projects/${params.project}/services`
                    },
                    {
                        label: "Services",
                        href: `/domains/${params.domain}/projects/${params.project}/services`,
                        translationKey: "CreateServiceBreadcrumb.services"
                    },
                    {
                        label: "Crear Servicio",
                        isCurrent: true,
                        translationKey: "CreateServiceBreadcrumb.createService"
                    }
                ]}
            />

            <ServiceStepper 
                userEmail={userEmail} 
            />
        </div>
    )
}
