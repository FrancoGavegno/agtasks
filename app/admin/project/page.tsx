import { apiClient } from "@/lib/integrations/amplify"
import { ProjectsClient } from "./projects-client"
import type { Project } from "@/lib/schemas"

export default async function ProjectsPage() {
  try {
    const { items: projects } = await apiClient.listProjects({
      deleted: false,
      limit: 100
    })

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects with domains, areas, and service desk configurations.
          </p>
        </div>
        <ProjectsClient projects={projects} />
      </div>
    )
  } catch (error) {
    console.error('Error loading projects:', error)
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects with domains, areas, and service desk configurations.
          </p>
        </div>
        <div className="text-red-500">Error loading projects. Please try again.</div>
      </div>
    )
  }
}
