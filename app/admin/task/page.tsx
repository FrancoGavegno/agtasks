import { client } from "@/lib/amplify-client"
import { TasksClient } from "./tasks-client"
import { serializeModelData } from "@/lib/serialization-utils"

export default async function TasksPage() {
  const { data: tasks } = await client.models.Task.list({
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

  const { data: services } = await client.models.Service.list({
    filter: {
      deleted: {
        ne: true,
      },
    },
  })

  // Serialize the data to remove function properties
  const serializedTasks = tasks?.map((task) => serializeModelData(task)) || []
  const serializedProjects = projects?.map((project) => serializeModelData(project)) || []
  const serializedServices = services?.map((service) => serializeModelData(service)) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">Manage tasks with subtasks and user assignments.</p>
      </div>
      <TasksClient tasks={serializedTasks} projects={serializedProjects} services={serializedServices} />
    </div>
  )
}
