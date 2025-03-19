import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, ChevronLeft, Clock, Download, Edit, MapPin, MessageSquare, Plus } from "lucide-react"
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ServiceChat } from "@/components/portals/service-chat"
import { ServiceTasks } from "@/components/portals/service-tasks"
import { ServiceMap } from "@/components/portals/service-map"

interface ServicePageProps {
  params: {
    id: string
  }
}

export default function ServicePage({ params }: ServicePageProps) {
  // This would normally come from a database
  const service = {
    id: params.id,
    name: "Variable Seeding - North Field",
    technique: "Variable Seeding",
    description:
      "Implementation of variable seeding rates based on soil analysis and historical yield data to optimize seed placement and density across different zones of the North Field.",
    progress: 65,
    startDate: "2025-02-15",
    endDate: "2025-04-30",
    fieldName: "North Field",
    fieldSize: 42,
    location: "Fresno County, CA",
    cropType: "Corn",
    status: "active",
    team: [
      { id: "1", name: "Maria Rodriguez", role: "Technical Lead", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "2", name: "John Smith", role: "Project Owner", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "3", name: "Carlos Mendez", role: "Field Operator", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "4", name: "Sarah Johnson", role: "Data Analyst", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    documents: [
      { id: "1", name: "Soil Analysis Report.pdf", date: "2025-02-10", type: "PDF" },
      { id: "2", name: "Seeding Prescription Map.jpg", date: "2025-02-20", type: "Image" },
      { id: "3", name: "Field History Data.xlsx", date: "2025-02-05", type: "Excel" },
    ],
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/portals/1/services">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge>{service.technique}</Badge>
              <Badge variant={service.status === "active" ? "outline" : "secondary"}>
                {service.status === "active" ? "Active" : "Completed"}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{service.name}</h1>
            <p className="text-muted-foreground mt-1">{service.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Service
            </Button>
            {/* <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button> */}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold">{service.progress}%</span>
              <span className="text-sm text-muted-foreground">Target: 75% by {formatDate(service.endDate)}</span>
            </div>
            <Progress value={service.progress} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>Start Date</span>
                </div>
                <p className="text-sm px-2">{formatDate(service.startDate)}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>End Date</span>
                </div>
                <p className="text-sm px-2">{formatDate(service.endDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Field Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Location</span>
                </div>
                <p className="text-sm px-2">
                  <span>{service.fieldName} ({service.fieldSize} ha)</span> <span className="text-sm text-muted-foreground">{service.location}</span>
                </p>
                
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Crop Type</div>
                <p className="text-sm px-2">{service.cropType}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          {/* <TabsTrigger value="map">Field Map</TabsTrigger> */}
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>People assigned to this service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {service.team.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Files and resources for this service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {service.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">Added on {formatDate(doc.date)}</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes to this service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Maria Rodriguez</span> uploaded a new seeding prescription map
                    </p>
                    <p className="text-xs text-muted-foreground">Yesterday at 4:30 PM</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">John Smith</span> completed task "Review soil analysis report"
                    </p>
                    <p className="text-xs text-muted-foreground">2 days ago at 10:15 AM</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>CM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Carlos Mendez</span> added a comment to task "Calibrate seeding
                      equipment"
                    </p>
                    <p className="text-xs text-muted-foreground">3 days ago at 2:45 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <ServiceTasks />
        </TabsContent>

        <TabsContent value="map">
          <ServiceMap />
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage the team assigned to this service</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {service.team.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 rounded-md border">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Role
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <ServiceChat />
        </TabsContent>
      </Tabs>
    </div>
  )
}

