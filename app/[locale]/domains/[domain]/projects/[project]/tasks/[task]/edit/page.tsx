import { Suspense } from "react"
import { notFound } from "next/navigation"
import { apiClient } from "@/lib/integrations/amplify"
import TaskStepper from "@/components/tasks/stepper"
import { Loading } from "@/components/loading"
import { cookies } from 'next/headers'
import { BreadcrumbWithTranslations } from "@/components/ui/breadcrumb-with-translations"

interface EditTaskPageProps {
  params: {
    locale: string
    domain: string
    project: string
    task: string
  }
}

async function getTaskData(taskId: string) {
  try {    
    const task = await apiClient.getTask(taskId)
    if (!task) {
      return null
    }

    return { task }
  } catch (error) {
    console.error("Error fetching task data:", error)
    return null
  }
}

async function getProjectData(projectId: string) {
  try {
    const project = await apiClient.getProject(projectId)
    return project
  } catch (error) {
    console.error("Error fetching project data:", error)
    return null
  }
}

async function getServices(projectId: string) {
  try {
    const services = await apiClient.listServices({ projectId, limit: 100 })
    return services.items || []
  } catch (error) {
    console.error("Error fetching services:", error)
    return []
  }
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const cookiesList = cookies();
  const thisUserEmail = cookiesList.get('user-email')?.value || "";
  const { task: taskId, project: projectId } = params

  // Fetch all required data
  const [taskData, projectData, services] = await Promise.all([
    getTaskData(taskId),
    getProjectData(projectId),
    getServices(projectId)
  ])

  if (!taskData || !projectData) {
    notFound()
  }

  const { task } = taskData

  return (
    <div className="container w-full pt-4 pb-4">
      <BreadcrumbWithTranslations
        items={[
          {
            label: projectData.name || 'Proyecto',
            href: `/domains/${params.domain}/projects/${projectId}/tasks`
          },
          {
            label: "Tareas",
            href: `/domains/${params.domain}/projects/${projectId}/tasks`,
            translationKey: "CreateTaskBreadcrumb.tasks"
          },
          {
            label: "Editar Tarea",
            isCurrent: true,
            translationKey: "CreateTaskBreadcrumb.editTask"
          }
        ]}
      />

      <Suspense fallback={<Loading />}>
        <TaskStepper
          projectId={projectId}
          thisUserEmail={thisUserEmail}
          services={services}
          projectName={projectData.name}
          mode="edit"
          taskId={taskId}
          initialData={{ task }}
        />
      </Suspense>
    </div>
  )
}
