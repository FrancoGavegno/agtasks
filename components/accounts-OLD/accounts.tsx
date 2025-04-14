"use client"

import { useState } from "react"
import { Link, MoreVertical, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

type ConnectionType = "farm" | "task" | "kobo"

interface Connection {
  id: string
  name: string
  type: ConnectionType
  apiKey: string
  apiUrl: string
  lastSynced: string
  isConnected: boolean
  isEditable: boolean
}

export default function Accounts() {
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "9011455509",
      name: "Farm Management System - 360",
      type: "farm",
      apiKey: "***",
      apiUrl: "https://360.example.com/api",
      lastSynced: "3/10/2025, 10:53:14 AM",
      isConnected: true,
      isEditable: false,
    },
    {
      id: "",
      name: "Task Manager",
      type: "task",
      apiKey: "",
      apiUrl: "",
      lastSynced: "",
      isConnected: false,
      isEditable: true,
    },
    {
      id: "",
      name: "Kobo Toolbox",
      type: "kobo",
      apiKey: "",
      apiUrl: "",
      lastSynced: "",
      isConnected: false,
      isEditable: true,
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentConnection, setCurrentConnection] = useState<Connection | null>(null)
  const [formData, setFormData] = useState({
    apiUrl: "",
    apiKey: "",
    taskType: "",
  })

  const handleOpenDialog = (connection: Connection, isEdit: boolean) => {
    setCurrentConnection(connection)
    setFormData({
      apiUrl: isEdit ? connection.apiUrl : "",
      apiKey: isEdit ? "" : "", // Always empty for security
      taskType: connection.type === "task" ? connection.name.replace("Task Manager - ", "") : "",
    })
    setIsDialogOpen(true)
  }

  const handleSaveConnection = () => {
    if (!currentConnection) return

    if (!formData.apiUrl || !formData.apiKey) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (currentConnection.type === "task" && !formData.taskType) {
      toast({
        title: "Error",
        description: "Please select a task manager type",
        variant: "destructive",
      })
      return
    }

    const updatedConnections = connections.map((conn) => {
      if (conn.type === currentConnection.type) {
        const now = new Date()
        const formattedDate = now.toLocaleString()

        return {
          ...conn,
          id: currentConnection.type === "task" ? "9011455509" : "8011455510",
          apiUrl: formData.apiUrl,
          apiKey: "***",
          lastSynced: formattedDate,
          isConnected: true,
          name: currentConnection.type === "task" ? `Task Manager - ${formData.taskType}` : conn.name,
        }
      }
      return conn
    })

    setConnections(updatedConnections)
    setIsDialogOpen(false)

    toast({
      title: "Success",
      description: `Connected to ${currentConnection.name}`,
    })
  }

  const handleDisconnect = (connectionType: ConnectionType) => {
    const updatedConnections = connections.map((conn) => {
      if (conn.type === connectionType) {
        return {
          ...conn,
          id: "",
          apiUrl: "",
          apiKey: "",
          lastSynced: "",
          isConnected: false,
          name: connectionType === "task" ? "Task Manager" : conn.name,
        }
      }
      return conn
    })

    setConnections(updatedConnections)

    toast({
      title: "Disconnected",
      description: `Disconnected from ${connections.find((c) => c.type === connectionType)?.name}`,
    })
  }

  return (

    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Cuentas</h1>
          <p className="text-muted-foreground">Administra la conexión a tus cuentas</p>
        </div>
      </div>

      <div className="space-y-4">
        {connections.map((connection) => (
          <Card key={connection.type} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 rounded-full p-3">
                    <Link className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="space-y-1">
                      {connection.isConnected && (
                        <>
                          <div className="font-medium">{connection.name}</div>
                          {/* <div className="text-sm text-muted-foreground">Team ID: {connection.id}</div> */}
                          {/* <div className="text-sm text-muted-foreground">API Key: {connection.apiKey}</div> */}
                        </>
                      )}
                      {!connection.isConnected && <div className="font-medium">{connection.name}</div>}
                    </div>

                    {connection.isConnected && (
                      <div className="mt-4 flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">Last synced: {connection.lastSynced}</div>
                        <div className="text-sm font-medium text-green-600">Connected</div>
                      </div>
                    )}

                    {!connection.isConnected && (
                      <div className="mt-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(connection, false)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Connectar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {connection.isConnected && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {connection.isEditable && (
                        <DropdownMenuItem onClick={() => handleOpenDialog(connection, true)}>Edit</DropdownMenuItem>
                      )}
                      {connection.isEditable && (
                        <DropdownMenuItem onClick={() => handleDisconnect(connection.type)}>
                          Disconnect
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentConnection?.isConnected ? "Edit" : "Connect"} {currentConnection?.name}
            </DialogTitle>
            <DialogDescription>Enter the API details to connect to this service</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {currentConnection?.type === "task" && (
              <div className="space-y-2">
                <Label htmlFor="task-type">Task Manager Type</Label>
                <Select
                  value={formData.taskType}
                  onValueChange={(value) => setFormData({ ...formData, taskType: value })}
                >
                  <SelectTrigger id="task-type">
                    <SelectValue placeholder="Select task manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jira">Jira</SelectItem>
                    <SelectItem value="Clickup">Clickup</SelectItem>
                    <SelectItem value="Asana">Asana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="api-url">API URL</Label>
              <Input
                id="api-url"
                value={formData.apiUrl}
                onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
                placeholder="https://api.example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="Enter your API key"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConnection}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

