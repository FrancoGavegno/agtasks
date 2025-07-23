import { client } from "@/lib/amplify-client"
import { ProjectsClient } from "./projects-client"
import { serializeModelData } from "@/lib/serialization-utils"

export default async function ProjectsPage() {
  const { data: projects } = await client.models.Project.list({
    filter: {
      deleted: {
        ne: true,
      },
    },
  })

  // Serialize the projects data to remove function properties
  const serializedProjects = projects?.map((project) => serializeModelData(project)) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground">
          Manage your projects with domains, areas, and service desk configurations.
        </p>
      </div>
      <ProjectsClient projects={serializedProjects} />
    </div>
  )
}
