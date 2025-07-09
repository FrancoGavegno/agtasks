import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import CreateService from "@/components/services/create-service"
import { Link } from "@/i18n/routing"
import { cookies } from 'next/headers'
import { getProject } from '@/lib/services/agtasks'

export default async function Page({
    params,
}: {
    params: { domain: string; project: string };
}) {
    const cookiesList = cookies();
    const userEmail = cookiesList.get('user-email')?.value || "";
    const projectData = await getProject(params.project);

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

            <CreateService userEmail={userEmail} />
        </div>
    )
}
