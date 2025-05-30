"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, MapPin, Layers } from "lucide-react"
import { capitalizeFirstLetter } from "@/lib/utils"

interface ServiceDetailProps {
  serviceId: string
}

interface ServiceTask {
  id: string
  externalTemplateId: string
  sourceSystem: string
  role: {
    id: string
    name: string
  }
  user: {
    id: string
    name: string
    email: string
  }
}

interface ServiceField {
  id: string
  serviceId: string
  fieldId: string
  name?: string
  hectares?: number
  crop?: string
}

interface ServiceDetailData {
  id: string
  projectId: string
  serviceName: string
  externalServiceKey: string
  sourceSystem: string
  externalTemplateId: string
  workspaceId: string
  campaignId: string
  farmId: string
  totalArea: number
  startDate: string
  endDate?: string
  status?: string
  progress?: number
  fields?: ServiceField[]
  tasks?: ServiceTask[]
  workspace?: {
    name: string
  }
  campaign?: {
    name: string
  }
  farm?: {
    name: string
  }
}

export function ServiceDetail({ serviceId }: ServiceDetailProps) {
  const params = useParams()
  const { domain, project } = params

  const [service, setService] = useState<ServiceDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/v1/agtasks/domains/${domain}/projects/${project}/services/${serviceId}`)

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setService(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch service details:", err)
        setError("Failed to load service details. Please try again later.")
        setService(null)
      } finally {
        setLoading(false)
      }
    }

    if (serviceId) {
      fetchServiceDetail()
    }
  }, [serviceId, domain, project])

  if (loading) {
    return <ServiceDetailSkeleton />
  }

  if (error || !service) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-red-500 text-xl mb-4">{error || "Service not found"}</div>
        <p className="text-muted-foreground">
          Unable to load service details. Please try again later or contact support.
        </p>
      </div>
    )
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  // Get status color
  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-200"

    switch (status.toLowerCase()) {
      case "finalizado":
        return "bg-green-500"
      case "en progreso":
        return "bg-blue-500"
      case "planificado":
        return "bg-yellow-500"
      default:
        return "bg-gray-200"
    }
  }

  // Get status badge variant
  const getStatusVariant = (status?: string) => {
    if (!status) return "secondary"

    switch (status.toLowerCase()) {
      case "finalizado":
        return "default" // Map "success" to "default"
      case "en progreso":
        return "default"
      case "planificado":
        return "outline" // Map "warning" to "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Service Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{service.serviceName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">ID: {service.id}</p>
            </div>
            <Badge variant={getStatusVariant(service.status)}>{service.status || "Unknown Status"}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Start Date</p>
                <p className="text-sm text-muted-foreground">{formatDate(service.startDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">End Date</p>
                <p className="text-sm text-muted-foreground">{formatDate(service.endDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Farm</p>
                <p className="text-sm text-muted-foreground">{service.farm?.name || service.farmId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Area</p>
                <p className="text-sm text-muted-foreground">{service.totalArea} ha</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {service.progress !== undefined && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Progress</p>
                <p className="text-sm font-medium">{service.progress}%</p>
              </div>
              <Progress value={service.progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Details, Fields, and Tasks */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Basic Information</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Service Name</dt>
                      <dd className="text-sm font-medium">{service.serviceName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">External Key</dt>
                      <dd className="text-sm font-medium">{service.externalServiceKey || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Source System</dt>
                      <dd className="text-sm font-medium">{/* capitalizeFirstLetter(service.sourceSystem) */}
                        {service.sourceSystem}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Template ID</dt>
                      <dd className="text-sm font-medium">{service.externalTemplateId}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Location Information</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Workspace</dt>
                      <dd className="text-sm font-medium">{service.workspace?.name || service.workspaceId}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Campaign</dt>
                      <dd className="text-sm font-medium">{service.campaign?.name || service.campaignId}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Farm</dt>
                      <dd className="text-sm font-medium">{service.farm?.name || service.farmId}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Total Area</dt>
                      <dd className="text-sm font-medium">{service.totalArea} ha</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fields Tab */}
        <TabsContent value="fields">
          <Card>
            <CardHeader>
              <CardTitle>Fields</CardTitle>
            </CardHeader>
            <CardContent>
              {service.fields && service.fields.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Crop
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hectares
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {service.fields.map((field) => (
                        <tr key={field.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {field.fieldId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{field.name || "N/A"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{field.crop || "N/A"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {field.hectares ? `${field.hectares} ha` : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No fields associated with this service</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {service.tasks && service.tasks.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Task
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned To
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {service.tasks.map((task) => (
                        <tr key={task.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {task.externalTemplateId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.role.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex flex-col">
                              <span>{task.user.name}</span>
                              <span className="text-xs text-muted-foreground">{task.user.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No tasks assigned to this service</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Skeleton loader for the service detail
function ServiceDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
