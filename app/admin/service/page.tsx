import { apiClient } from "@/lib/integrations/amplify"
import { ServicesClient } from "./services-client"
import type { Schema } from "@/amplify/data/resource"

type Service = Schema["Service"]["type"]
type Project = Schema["Project"]["type"]

export default async function ServicesPage() {
  try {
    const [{ items: services }, { items: projects }] = await Promise.all([
      apiClient.listServices({
        deleted: false,
        limit: 100
      }),
      apiClient.listProjects({
        deleted: false,
        limit: 100
      })
    ])

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">Manage services associated with projects.</p>
        </div>
        <ServicesClient
          services={services as Service[]}
          projects={projects as Project[]}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading services:', error)
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">Manage services associated with projects.</p>
        </div>
        <div className="text-red-500">Error loading services. Please try again.</div>
      </div>
    )
  }
}
