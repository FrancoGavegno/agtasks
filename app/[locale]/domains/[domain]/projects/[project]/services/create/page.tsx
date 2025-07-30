import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import ServiceStepper from "@/components/services/stepper"
import { Link } from "@/i18n/routing"
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
            <Breadcrumb className="mb-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link href={`/domains/${params.domain}/projects/${params.project}/services`}>
                            {projectData?.name || 'Proyecto'}
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Link href={`/domains/${params.domain}/projects/${params.project}/services`}>Services</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Crear Servicio</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <ServiceStepper 
                userEmail={userEmail} 
            />
        </div>
    )
}
