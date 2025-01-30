"use client"

import { useState, useEffect } from "react"
import { Amplify } from "aws-amplify"
import outputs from "@/amplify_outputs.json"
Amplify.configure(outputs)
import { generateClient } from "aws-amplify/data"
import type { Schema } from "@/amplify/data/resource"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

const client = generateClient<Schema>()

interface ProjectRoleProps {
  projectId: string
}

export default function ProjectRoleDetail({ projectId }: ProjectRoleProps) {
  const [projectRoles, setProjectRoles] = useState<Array<Schema["ProjectRole"]["type"]>>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchProjectRoles = async () => {
      const response = await client.models.ProjectRole.list({
        filter: { projectId: { eq: projectId } },
      })
      setProjectRoles(response.data)
    }

    fetchProjectRoles()

    const subscription = client.models.ProjectRole.observeQuery({
      filter: { projectId: { eq: projectId } },
    }).subscribe({
      next: (data) => {
        if (JSON.stringify(data.items) !== JSON.stringify(projectRoles)) {
          setProjectRoles([...data.items])
        }
      },
    })

    return () => subscription.unsubscribe()
  }, [projectId, projectRoles])

  const handleDelete = async (id: string) => {
    try {
      await client.models.ProjectRole.delete({ id: id })
      console.log("ProjectRole deleted: ", id)
      toast({
        title: "Success",
        description: "Project role has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting ProjectRole:", error)
      toast({
        title: "Error",
        description: "An error occurred while deleting the project role. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mt-4">
      <h2 className="text-md font-semibold mb-2">Roles</h2>
      <ul className="space-y-2">
        {projectRoles.length === 0 && <p>Not found user assigned to roles.</p>}
        {projectRoles.map((role) => (
          <li key={role.id} className="bg-gray-100 p-2 rounded relative">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Trash2 className="absolute top-2 right-2 h-4 w-4 text-gray-500 hover:text-red-500 cursor-pointer" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the project role for {role.userName} (
                    {role.userEmail}).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(role.id)}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p>
              <strong>User:</strong> {role.userName} ({role.userEmail})
            </p>
            <p>
              <strong>Role:</strong> {role.roleName}
            </p>
            {/* <p>
              <strong>Created at:</strong> {new Date(role.createdAt).toLocaleString()}
            </p> */}
          </li>
        ))}
      </ul>
    </div>
  )
}

