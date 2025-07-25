import { apiClient } from "@/lib/integrations/amplify"
import { TasksClient } from "./tasks-client"
import type { Task, Project, Service } from "@/lib/schemas"

export default async function TasksPage() {
  try {
    // Load only tasks for now
    const { items: tasks } = await apiClient.listTasks({       
      limit: 100
    })

    // Commented out for now - will be used later
    // const [{ items: projects }, { items: services }] = await Promise.all([
    //   apiClient.listProjects({        
    //     limit: 100
    //   }),
    //   apiClient.listServices({      
    //     limit: 100
    //   })
    // ])

    // Sort tasks by creation date descending
    const sortedTasks = tasks.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage tasks with subtasks and user assignments.</p>
        </div>
        <TasksClient tasks={sortedTasks} projects={[]} services={[]} />
      </div>
    )
  } catch (error) {
    console.error('Error loading tasks:', error)
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage tasks with subtasks and user assignments.</p>
        </div>
        <div className="text-red-500">
          Error loading tasks. Please try again.
          <br />
          <small className="text-gray-500">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </small>
        </div>
      </div>
    )
  }
}
