import { cookies } from 'next/headers'
import CreateTaskStepper from "@/components/tasks/create-task"
import { apiClient, Service } from '@/lib/integrations/amplify'
import { BreadcrumbWithTranslations } from "@/components/ui/breadcrumb-with-translations"

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
  
  // const services = await apiClient.listServices({projectId, limit: 100});
  // const cleanServices = Array.isArray(services?.items)
  //   ? services.items.map(s => Object.fromEntries(Object.entries(s).filter(([_, v]) => typeof v !== 'function')))
  //   : [];  

  const projectName = typeof cleanProjectData?.name === 'string' ? cleanProjectData.name : "";
  const cleanServices: Service[] = [];

  return (
    <div className="container w-full pt-4 pb-4">
      <BreadcrumbWithTranslations
        items={[
          {
            label: projectName || 'Proyecto',
            href: `/domains/${domainId}/projects/${projectId}/tasks`
          },
          {
            label: "Tareas",
            href: `/domains/${domainId}/projects/${projectId}/tasks`,
            translationKey: "CreateTaskBreadcrumb.tasks"
          },
          {
            label: "Crear Tarea",
            isCurrent: true,
            translationKey: "CreateTaskBreadcrumb.createTask"
          }
        ]}
      />

      <CreateTaskStepper
        projectId={projectId}
        thisUserEmail={thisUserEmail}
        services={cleanServices}
        projectName={projectName}
      />
    </div>
  )
}
