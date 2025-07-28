import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import CreateTaskStepper from "@/components/tasks/create-task"
import { cookies } from 'next/headers'
import { apiClient } from '@/lib/integrations/amplify'
import { Link } from "@/i18n/routing"

export default async function Page({ 
  params 
}: { 
  params: { locale: string; domain: string; project: string } 
}) {
  const cookiesList = cookies();
  const thisUserEmail = cookiesList.get('user-email')?.value || "";
  const projectId = params.project;
  const domainId = params.domain;
  const projectData = await apiClient.getProject(projectId);
  
  // Limpiar projectData de funciones
  const cleanProjectData = projectData
    ? Object.fromEntries(Object.entries(projectData).filter(([_, v]) => typeof v !== 'function'))
    : null;
  const services = await apiClient.listServices({projectId, limit: 100});
  
  // Limpiar services de funciones
  const cleanServices = Array.isArray(services?.items)
    ? services.items.map(s => Object.fromEntries(Object.entries(s).filter(([_, v]) => typeof v !== 'function')))
    : [];
  const projectName = typeof cleanProjectData?.name === 'string' ? cleanProjectData.name : "";

  return (
    <div className="container w-full pt-4 pb-4">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href={`/domains/${domainId}/projects/${projectId}/tasks`}>
              {projectName || 'Proyecto'}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href={`/domains/${domainId}/projects/${projectId}/tasks`}>Tareas</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Crear Tarea</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CreateTaskStepper
        projectId={projectId}
        thisUserEmail={thisUserEmail}
        services={cleanServices}
        projectName={projectName}
      />
    </div>
  )
}
