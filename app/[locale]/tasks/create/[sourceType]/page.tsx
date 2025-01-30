// http://localhost:3000/en/tasks/create/field_visit

import { TaskCreate } from "@/components/tasks/tasks-create/task-create"

export default function CreateTaskPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
      <TaskCreate />
    </main>
  )
}

