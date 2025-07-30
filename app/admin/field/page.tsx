import { apiClient } from "@/lib/integrations/amplify"
import { Schema } from "@/amplify/data/resource"
type Field = Schema["Field"]["type"]
type Task = Schema["Task"]["type"]
import { FieldsClient } from "./fields-client"

export default async function FieldsPage() {
  try {
    // Load only fields for now
    const { items: fields } = await apiClient.listFields({
      limit: 100
    })

    // Commented out for now - will be used later
    // const { items: tasks } = await apiClient.listTasks({
    //   limit: 100
    // })

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Fields</h1>
          <p className="text-muted-foreground">Manage field data with workspace and campaign information.</p>
        </div>
        <FieldsClient fields={fields as Field[]} tasks={[]} />
      </div>
    )
  } catch (error) {
    console.error('Error loading fields:', error)
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Fields</h1>
          <p className="text-muted-foreground">Manage field data with workspace and campaign information.</p>
        </div>
        <div className="text-red-500">
          Error loading fields. Please try again.
          <br />
          <small className="text-gray-500">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </small>
        </div>
      </div>
    )
  }
}
