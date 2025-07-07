import { client } from "@/lib/amplify-client"
import { FieldsClient } from "./fields-client"
import { serializeModelData } from "@/lib/serialization-utils"

export default async function FieldsPage() {
  const { data: fields } = await client.models.Field.list({
    filter: {
      deleted: {
        ne: true,
      },
    },
  })

  const { data: tasks } = await client.models.Task.list({
    filter: {
      deleted: {
        ne: true,
      },
    },
  })

  const serializedFields = fields?.map((field) => serializeModelData(field)) || []
  const serializedTasks = tasks?.map((task) => serializeModelData(task)) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fields</h1>
        <p className="text-muted-foreground">Manage field data with workspace and campaign information.</p>
      </div>
      <FieldsClient fields={serializedFields} tasks={serializedTasks} />
    </div>
  )
}
