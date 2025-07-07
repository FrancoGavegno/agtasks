import { client } from "@/lib/amplify-client"
import { ServicesClient } from "./services-client"
import { serializeModelData } from "@/lib/serialization-utils"

export default async function ServicesPage() {
  const { data: services } = await client.models.Service.list({
    filter: {
      deleted: {
        ne: true,
      },
    },
  })

  const { data: projects } = await client.models.Project.list({
    filter: {
      deleted: {
        ne: true,
      },
    },
  })

  // Serialize the data to remove function properties
  const serializedServices = services?.map((service) => serializeModelData(service)) || []
  const serializedProjects = projects?.map((project) => serializeModelData(project)) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Services</h1>
        <p className="text-muted-foreground">Manage services associated with projects.</p>
      </div>
      <ServicesClient services={serializedServices} projects={serializedProjects} />
    </div>
  )
}
