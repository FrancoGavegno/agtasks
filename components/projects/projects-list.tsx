"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  ChevronRight,
  ChevronDown,
  Search,
  FolderIcon,
  ListIcon,
  SquareArrowOutUpRight,
  UserCircle2,
  Trash2,
} from "lucide-react"
import type {
  Space,
  Folder,
  Project,
  TreeItem,
  FormData,
  User,
  Role,
  ProjectRole,
  Field,
  Task,
} from "@/lib/interfaces"
import {
  getSpaces,
  getFolders,
  getFolderlessLists,
  getWorkspaceCustomFields,
  getTasks
} from "@/lib/clickup"
import { listUsersByWs } from "@/lib/360"

import type { Schema } from "@/amplify/data/resource"
import { client } from "@/lib/amplify"


export default function ProjectsList() {
  const tmWorkspaceId = process.env.NEXT_PUBLIC_TEAM_ID || ""
  const fmsWorkspaceId = process.env.NEXT_PUBLIC_FMS_WK_ID || "5203"
  const [spaces, setSpaces] = useState<Space[]>([])
  const [treeData, setTreeData] = useState<TreeItem[]>([])
  const [filteredTreeData, setFilteredTreeData] = useState<TreeItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set())
  const [selectedItem, setSelectedItem] = useState<TreeItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)
  const [customFields, setCustomFields] = useState<{
    taskType?: Field
    taskRole?: Field
  }>({})
  const [projectRoles, setProjectRoles] = useState<Array<Schema["ProjectRole"]["type"]>>([])
  const { toast } = useToast()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm()


  const fetchSpacesData = async () => {
    try {
      const spacesData = await getSpaces(tmWorkspaceId)
      setSpaces(spacesData.spaces)

      const treeItems: TreeItem[] = await Promise.all(
        spacesData.spaces.map(async (space: Space) => {
          const [foldersData, folderlessLists] = await Promise.all([
            getFolders(space.id),
            getFolderlessLists(space.id),
          ])

          return {
            id: space.id,
            name: space.name,
            type: "space",
            children: [
              ...foldersData.folders.map((folder: Folder) => ({
                id: folder.id,
                name: folder.name,
                type: "folder",
                parentId: space.id,
                children:
                  folder.lists?.map((list: Project) => ({
                    id: list.id,
                    name: list.name,
                    type: "list",
                    parentId: folder.id,
                  })) || [],
              })),
              ...folderlessLists.lists.map((list: Project) => ({
                id: list.id,
                name: list.name,
                type: "list",
                parentId: space.id,
              })),
            ],
          }
        }),
      )
      setTreeData(treeItems)
    } catch (error) {
      console.error("Error fetching spaces data:", error)
    }
  }

  const fetchCustomFieldsAndRoles = async () => {
    try {
      const fields: Field[] = await getWorkspaceCustomFields(tmWorkspaceId);
      const taskTypeField = fields.find((field) => field.name === "Task_Type");
      const taskRoleField = fields.find((field) => field.name === "Task_Role");

      setCustomFields({
        taskType: taskTypeField,
        taskRole: taskRoleField,
      });

      // Procesando roles de tarea
      if (taskRoleField && taskRoleField.type_config?.options) {
        const rolesData: Role[] = taskRoleField.type_config.options.map((option) => ({
          id: option.id,
          name: option.name,
          color: option.color || undefined,
          orderindex: option.orderindex,
        }));
        setRoles(rolesData);
      }
    } catch (error) {
      console.error("Error fetching custom fields and roles:", error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      await fetchSpacesData();
      await fetchCustomFieldsAndRoles();

      try {
        const usersData: User[] = await listUsersByWs(Number.parseInt(fmsWorkspaceId));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching 360 Workspace Users data:", error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    setFilteredTreeData(filterTree(treeData, searchTerm));
  }, [treeData, searchTerm]);


  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }

  const handleItemClick = useCallback(async (item: TreeItem) => {
    //const handleItemClick = async (item: TreeItem) => {
    setSelectedItem(item)
    if (item.type === "list") {
      setSelectedLists(new Set([item.id]))
      setSelectAll(false)
      setIsLoadingTasks(true)
      try {
        const [tasksData, projectRolesData] = await Promise.all([
          getTasks(item.id),
          client.models.ProjectRole.list({
            filter: { projectId: { eq: item.id } },
          }),
        ])
        setTasks(tasksData)
        setProjectRoles(projectRolesData.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingTasks(false)
      }
    } else {
      setSelectedLists(new Set())
      setSelectAll(false)
      setTasks([])
      setProjectRoles([])
    }
  }, [client, setSelectedItem, setSelectedLists, setSelectAll, setIsLoadingTasks, setTasks, setProjectRoles, toast]);

  const handleListCheckbox = (listId: string) => {
    setSelectedLists((prev) => {
      const next = new Set(prev)
      if (next.has(listId)) {
        next.delete(listId)
      } else {
        next.add(listId)
      }

      const allListIds = new Set(
        (selectedItem?.type === "list" ? [selectedItem] : selectedItem?.children || [])
          .filter((item) => item.type === "list")
          .map((item) => item.id),
      )
      setSelectAll(next.size === allListIds.size)

      return next
    })
  }

  const handleSelectAll = () => {
    setSelectAll(!selectAll)
    if (!selectAll) {
      const allListIds = new Set(
        (selectedItem?.type === "list" ? [selectedItem] : selectedItem?.children || [])
          .filter((item) => item.type === "list")
          .map((item) => item.id),
      )
      setSelectedLists(allListIds)
    } else {
      setSelectedLists(new Set())
    }
  }

  const filterTree = (items: TreeItem[], term: string): TreeItem[] => {
    return items
      .filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(term.toLowerCase())
        const childMatches = item.children ? filterTree(item.children, term).length > 0 : false
        return matchesSearch || childMatches
      })
      .map((item) => ({
        ...item,
        children: item.children ? filterTree(item.children, term) : undefined,
      }))
  }

  const renderTreeItem = (item: TreeItem, level = 0) => {
    const isExpanded = expandedItems.has(item.id)
    const hasChildren = item.children && item.children.length > 0
    const filteredChildren = searchTerm && hasChildren ? item.children : item.children
    
    return (
      <div key={item.id} className="select-none">
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer ${selectedItem?.id === item.id ? "bg-gray-100" : ""
            }`}
          style={{ paddingLeft: `${level * 20}px` }}
          onClick={() => handleItemClick(item)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(item.id)
              }}
              className="w-6 h-6 flex items-center justify-center"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}
          {item.type === "folder" ? (
            <FolderIcon className="h-4 w-4 mr-2" />
          ) : item.type === "list" ? (
            <ListIcon className="h-4 w-4 mr-2" />
          ) : null}
          <span>{item.name}</span>
        </div>
        {isExpanded && filteredChildren && (
          <div>{filteredChildren.map((child) => renderTreeItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  const validateAtLeastOneRole = (values: Record<string, string>) => {
    return (
      Object.values(values).some((value) => value !== "none") ||
      "Please select a role other than 'none' for at least one user."
    )
  }

  const onSubmit = async (data: FormData) => {
    const validationResult = validateAtLeastOneRole(data)
    if (typeof validationResult === "string") {
      toast({
        title: "Validation Error",
        description: validationResult,
        variant: "destructive",
      })
      return { root: { message: validationResult } }
    }

    const rolesToCreate: ProjectRole[] = []
    Object.entries(data).forEach(([key, roleName]) => {
      if (key.startsWith("user_") && roleName !== "none") {
        const userId = key.split("_")[1]
        selectedLists.forEach((projectId) => {
          rolesToCreate.push({
            projectId,
            projectName: selectedItem?.name,
            userId,
            userName: users.find((user) => user.id === userId)?.name,
            userEmail: users.find((user) => user.id === userId)?.email,
            roleId: roles.find((role) => role.name === roleName)?.id,
            roleName: roleName,
            status: "ACTIVE",
          })
        })
      }
    })

    try {
      const promises = rolesToCreate.map((role) => client.models.ProjectRole.create(role))
      const results = await Promise.all(promises)

      console.log("Registros creados:", results)
      setIsModalOpen(false)

      setSearchTerm("")
      setSelectedLists(new Set())
      setSelectedItem(null)

      toast({
        title: "Success",
        description: `${results.length} project roles have been created successfully.`,
      })
    } catch (error) {
      console.error("Error al crear registros de ProjectRole:", error)
      toast({
        title: "Error",
        description: "An error occurred while creating project roles. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getCustomFieldOptionName = (task: Task, fieldName: string): string | null => {
    if (!task.custom_fields) return null

    const field = task.custom_fields.find((f) => f.name === fieldName)
    if (!field || typeof field.value !== "number") return null

    const option = field.type_config?.options?.[field.value]
    return option?.name || null
  }

  const findProjectRolesForTask = (task: Task): Schema["ProjectRole"]["type"][] => {
    if (!selectedItem?.id) return []

    const taskRole = getCustomFieldOptionName(task, "Task_Role")
    if (!taskRole) return []

    return projectRoles.filter(
      (role) => role.projectId === selectedItem.id && role.roleName === taskRole && role.status === "ACTIVE",
    )
  }

  const handleDelete = async (id: string) => {
    try {
      await client.models.ProjectRole.delete({ id: id })
      console.log("ProjectRole deleted: ", id)
      toast({
        title: "Success",
        description: "Project role has been deleted successfully.",
      })
      // Refresh the project roles
      if (selectedItem?.id) {
        const updatedProjectRoles = await client.models.ProjectRole.list({
          filter: { projectId: { eq: selectedItem.id } },
        })
        setProjectRoles(updatedProjectRoles.data)
      }
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
    <div className="flex h-[calc(100vh-4rem)] border rounded-lg overflow-hidden">
      {/* Left Column */}
      <div className="w-80 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="overflow-auto flex-1">
          {filteredTreeData.map((item) => renderTreeItem(item))}  
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">{selectedItem ? selectedItem.name : "Select an item"}</h2>
          <Button onClick={() => setIsModalOpen(true)} disabled={selectedLists.size === 0}>
            Assignee
          </Button>
        </div>
        <div className="overflow-auto flex-1 p-4">
          {(selectedItem?.type === "list" || selectedItem?.children) && (
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox id="select-all" checked={selectAll} onCheckedChange={handleSelectAll} />
              <label htmlFor="select-all" className="text-sm text-gray-700">
                Select All
              </label>
            </div>
          )}
          {selectedItem?.type === "list" ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={selectedItem.id}
                  checked={selectedLists.has(selectedItem.id)}
                  onCheckedChange={() => handleListCheckbox(selectedItem.id)}
                />
                <label htmlFor={selectedItem.id} className="flex items-center justify-between w-full pr-4">
                  <div>{selectedItem.name}</div>

                  <Link
                    href={`https://app.clickup.com/9011455509/v/li/${selectedItem.id}`}
                    target="_blank"
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    <SquareArrowOutUpRight size={18} />
                  </Link>
                </label>
              </div>

              {isLoadingTasks ? (
                <div className="text-center">Loading tasks...</div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-md font-semibold">Tasks</h3>
                  {tasks.length > 0 ? (
                    <div className="border rounded-lg">
                      <div className="grid grid-cols-4 gap-4 p-3 border-b bg-gray-50">
                        <div className="font-medium">Name</div>
                        <div className="font-medium">Task Type</div>
                        <div className="font-medium">Task Role</div>
                        <div className="font-medium">Assignee</div>
                      </div>
                      <div className="divide-y">
                        {tasks.map((task: Task) => {
                          const taskType = getCustomFieldOptionName(task, "Task_Type")
                          const taskRole = getCustomFieldOptionName(task, "Task_Role")
                          console.log("Task Role for task:", task.name, taskRole)
                          const assignees = findProjectRolesForTask(task)
                          console.log("Assignees found:", assignees)
                          return (
                            <div key={task.id} className="grid grid-cols-4 gap-4 p-3 items-center hover:bg-gray-50">
                              <div className="flex items-center space-x-2">
                                <div
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: task.status?.color }}
                                />
                                <span className="truncate">{task.name}</span>
                              </div>
                              <div className="truncate">{taskType || "-"}</div>
                              <div className="truncate">{taskRole || "-"}</div>
                              <div className="space-y-1">
                                {assignees.length > 0 ? (
                                  assignees.map((role) => (
                                    <div key={role.id} className="flex items-center justify-between">
                                      <div className="flex items-center space-x-1">
                                        <UserCircle2 className="h-4 w-4 text-gray-500" />
                                        <span className="truncate text-sm">{role.userName}</span>
                                      </div>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500 cursor-pointer" />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              This action cannot be undone. This will permanently delete the project
                                              role for {role.userName}.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(role.id)}>
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <p>No tasks found for this list.</p>
                  )}
                </div>
              )}

              {/* <ProjectRoleDetail projectId={selectedItem.id} /> */}
            </div>
          ) : selectedItem?.type === "folder" || selectedItem?.type === "space" ? (
            <div className="space-y-2">
              {(selectedItem.children || [])
                .filter((child) => child.type === "list")
                .map((list) => (
                  <div key={list.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={list.id}
                      checked={selectedLists.has(list.id)}
                      onCheckedChange={() => handleListCheckbox(list.id)}
                    />
                    <label htmlFor={list.id} className="flex items-center justify-between w-full pr-4">
                      <div>{list.name}</div>

                      <Link
                        href={`https://app.clickup.com/9011455509/v/li/${list.id}`}
                        target="_blank"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <SquareArrowOutUpRight size={18} />
                      </Link>
                    </label>
                  </div>
                ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Edit User Roles</DialogTitle>
            <DialogDescription>Asigne usuarios a roles de su/s proyecto/s</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              {/* Search Bar */}
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Scrollable Container */}
              <div className="max-h-[calc(100vh*0.6)] overflow-y-auto pl-2 pr-2">
                {users
                  .filter(
                    (user) =>
                      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Controller
                        name={`user_${user.id}`}
                        control={control}
                        defaultValue="none"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-[130px]">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">...</SelectItem>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.name}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  ))}
              </div>
            </div>
            {errors.root && <p className="text-red-500 text-xs italic">{errors.root.message}</p>}
            {/* Form for Submission */}
            <div className="flex justify-end mt-4">
              <Button type="submit">Confirm</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

