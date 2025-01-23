"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, ChevronDown, Search, FolderIcon, ListIcon, SquareArrowOutUpRight } from "lucide-react"
import type { Space, Folder, Project, TreeItem, User, ProjectRole } from "@/lib/interfaces"
import { getSpaces, getFolders, getFolderlessLists } from "@/lib/clickup"
import { useForm, Controller } from 'react-hook-form'
import { listUsersByWs } from "@/lib/360"

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs);
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>()


interface FormData {
  [key: string]: string;
}

export default function ClickUpManager() {
  const teamId = process.env.NEXT_PUBLIC_TEAM_ID || ""
  const [spaces, setSpaces] = useState<Space[]>([])
  const [treeData, setTreeData] = useState<TreeItem[]>([])
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set())
  const [selectedItem, setSelectedItem] = useState<TreeItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [users, setUsers] = useState<User[]>([]);
  const { control, handleSubmit, formState: { errors } } = useForm();

  // Mock users data - replace with actual users API
  // const users = [
  //   { id: "1", name: "Olivia Martin", email: "m@example.com" },
  //   { id: "2", name: "Isabella Nguyen", email: "b@example.com" },
  //   { id: "3", name: "Sofia Davis", email: "p@example.com" },
  //   { id: "4", name: "Ethan Smith", email: "ethan@example.com" },
  //   { id: "5", name: "Ava Johnson", email: "ava@example.com" },
  //   { id: "6", name: "Liam Brown", email: "liam@example.com" },
  //   { id: "7", name: "Emma Wilson", email: "emma@example.com" },
  //   { id: "8", name: "Noah Taylor", email: "noah@example.com" },
  //   { id: "9", name: "Sophia Lee", email: "sophia@example.com" },
  //   { id: "10", name: "James Anderson", email: "james@example.com" },
  // ]

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData: User[] = await listUsersByWs(5203);
        setUsers(usersData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchUsers();
  }, [])

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const spacesData = await getSpaces(teamId)
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
        console.error("Error fetching data:", error)
      }
    }

    fetchInitialData()
  }, [])

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

  const handleItemClick = (item: TreeItem) => {
    setSelectedItem(item)
    if (item.type !== "list") {
      setSelectedLists(new Set())
      setSelectAll(false)
    }
  }

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
    const filteredChildren = searchTerm && hasChildren ? filterTree(item.children || [], searchTerm) : item.children

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

  // Validación personalizada para asegurar que al menos un usuario 
  // tenga un rol diferente de 'none'
  const validateAtLeastOneRole = (values: Record<string, string>) => {
    return Object.values(values).some(value => value !== "none") || "Please select a role other than 'none' for at least one user.";
  };

  const onSubmit = async (data: FormData) => {
    const validationResult = validateAtLeastOneRole(data);
    if (typeof validationResult === 'string') {
      // Si la validación falla, se establece un error en el formulario
      return { root: { message: validationResult } };
    }

    // Si la validación pasa, se procede con el envío
    // console.log('Listas seleccionadas:', selectedLists);
    // console.log('Form submitted with data:', data);

    // Aquí procesamos los roles
    const rolesToCreate: ProjectRole[] = [];
    Object.entries(data).forEach(([key, roleName]) => {
      if (key.startsWith('user_') && roleName !== 'none') {
        const userId = key.split('_')[1];
        selectedLists.forEach(projectId => {
          rolesToCreate.push({
            projectId,
            userId,
            userRole: roleName,
            status: "ACTIVE"
          });
        });
      }
    });

    try {
      // Crear múltiples entradas en la tabla ProjectRole
      const promises = rolesToCreate.map(role => 
        client.models.ProjectRole.create(role)
      );
      const results = await Promise.all(promises);

      // await Promise.all(rolesToCreate.map(role =>
      //   client.models.ProjectRole.create(role)
      // ));
      
      console.log('Registros creados:', results);
      // console.log('Roles asignados con éxito:', rolesToCreate);
      setIsModalOpen(false); // Cierra el modal después de enviar

      // Reset states to their initial values
      setSearchTerm("");
      setSelectedLists(new Set());
      setSelectedItem(null);
      // setUsers([]);

    } catch (error) {
      console.error('Error al crear registros de ProjectRole:', error);
      // Manejar el error según sea necesario, quizás mostrando un mensaje al usuario
    }
  };

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
          {filterTree(treeData, searchTerm).map((item) => renderTreeItem(item))}
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">{selectedItem ? selectedItem.name : "Select an item"}</h2>
          <Button onClick={() => setIsModalOpen(true)} disabled={selectedLists.size === 0}>
            Edit
          </Button>
        </div>
        <div className="overflow-auto flex-1 p-4">
          {(selectedItem?.type === "list" || selectedItem?.children) && (
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox id="select-all" checked={selectAll} onCheckedChange={handleSelectAll} />
              <label htmlFor="select-all" className="text-sm text-gray-700">Select All</label>
            </div>
          )}
          {selectedItem?.type === "list" ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={selectedItem.id}
                  checked={selectedLists.has(selectedItem.id)}
                  onCheckedChange={() => handleListCheckbox(selectedItem.id)}
                />
                <label htmlFor={selectedItem.id}
                  className="flex items-center justify-between w-full pr-4">
                  <div>
                    {selectedItem.name}
                  </div>

                  <Link href={`https://app.clickup.com/9011455509/v/li/${selectedItem.id}`}
                    target="_blank"
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    <SquareArrowOutUpRight size={18} />
                  </Link>

                </label>
              </div>

            </div>
          ) : selectedItem?.children ? (
            <div className="space-y-2">
              {selectedItem.children
                .filter((child) => child.type === "list")
                .map((list) => (
                  <div key={list.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={list.id}
                      checked={selectedLists.has(list.id)}
                      onCheckedChange={() => handleListCheckbox(list.id)}
                    />
                    <label htmlFor={list.id}
                      className="flex items-center justify-between w-full pr-4">
                      <div>
                        {list.name}
                      </div>

                      <Link href={`https://app.clickup.com/9011455509/v/li/${list.id}`}
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
            <DialogDescription >
              Asigne usuarios a roles de su/s proyecto/s
            </DialogDescription>
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
                {users.filter(user =>
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((user) => (
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
                            <SelectItem value="Supervisor_recorrida">Supervisor_recorrida</SelectItem>
                            <SelectItem value="Operador_GIS">Operador_GIS</SelectItem>
                            <SelectItem value="Colector_recorrida">Colector_recorrida</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            {errors.root && (
              <p className="text-red-500 text-xs italic">{errors.root.message}</p>
            )}
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

