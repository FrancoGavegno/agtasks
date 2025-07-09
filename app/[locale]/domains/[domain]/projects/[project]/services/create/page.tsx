import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import CreateService from "@/components/projects/create-service"
import { Link } from "@/i18n/routing"
import { cookies } from 'next/headers'

export default function Page({
    params,
}: {
    params: { domain: string; project: string };
}) {
    const cookiesList = cookies();
    const userEmail = cookiesList.get('user-email')?.value || "";

    return (
        <div className="container w-full pt-4 pb-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link href="/">Home</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Link href={`/domains/${params.domain}/projects/${params.project}/services`}>Services</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Create Service</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <CreateService userEmail={userEmail} />
        </div>
    )
}
