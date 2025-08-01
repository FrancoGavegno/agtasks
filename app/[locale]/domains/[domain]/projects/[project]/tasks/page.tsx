import { apiClient } from '@/lib/integrations/amplify'
import { TasksPageDetails } from "@/components/tasks/tasks"
import { BreadcrumbWithTranslations } from "@/components/ui/breadcrumb-with-translations"

export default async function TasksPage({
  params,
}: {
  params: { domain: string; project: string };
}) {
  const projectName = await apiClient.getProject(params.project).then(data => data?.name || "");

  return (
    <div className="container w-full pt-4 pb-4">
      <BreadcrumbWithTranslations
        items={[
          {
            label: projectName,
            href: `/domains/${params.domain}/settings`
          },
          {
            label: "Tasks",
            translationKey: "TasksPage.BreadcrumbPage",
            isCurrent: true
          }
        ]}
      />

      <TasksPageDetails />
    </div>
  )
}
