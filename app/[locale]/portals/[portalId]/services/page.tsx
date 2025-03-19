"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, ChevronDown, Filter, Grid, Layers, List, Plus, Search, Users } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ServicesListView } from "@/components/portals/services-list-view"
import { ServicesGridView } from "@/components/portals/services-grid-view"
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function ServicesPage() {
  const [viewType, setViewType] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Sample metrics data
  const metrics = {
    activeServices: 5,
    completedServices: 3,
    upcomingDeadlines: 2,
    teamMembers: 12,
  }

  // Sample data for active services
  const activeServices = [
    {
      id: "1",
      name: "Variable Seeding - North Field",
      technique: "Variable Seeding",
      progress: 65,
      startDate: "2025-02-15",
      endDate: "2025-04-30",
      teamCount: 4,
      status: "active",
      location: "Fresno County, CA",
      fieldSize: 42,
      cropType: "Corn",
    },
    {
      id: "2",
      name: "Precision Irrigation - East Field",
      technique: "Precision Irrigation",
      progress: 30,
      startDate: "2025-03-01",
      endDate: "2025-05-15",
      teamCount: 3,
      status: "active",
      location: "Yolo County, CA",
      fieldSize: 38,
      cropType: "Soybeans",
    },
    {
      id: "3",
      name: "Variable Fertilization - South Field",
      technique: "Variable Fertilization",
      progress: 80,
      startDate: "2025-01-10",
      endDate: "2025-03-25",
      teamCount: 5,
      status: "active",
      location: "Kern County, CA",
      fieldSize: 55,
      cropType: "Cotton",
    },
    {
      id: "6",
      name: "Drone Mapping - West Ridge",
      technique: "Drone Mapping",
      progress: 45,
      startDate: "2025-02-20",
      endDate: "2025-04-10",
      teamCount: 2,
      status: "active",
      location: "Monterey County, CA",
      fieldSize: 30,
      cropType: "Lettuce",
    },
    {
      id: "7",
      name: "Precision Pest Management - Vineyard",
      technique: "Precision Pest Management",
      progress: 25,
      startDate: "2025-03-05",
      endDate: "2025-06-15",
      teamCount: 4,
      status: "active",
      location: "Napa County, CA",
      fieldSize: 28,
      cropType: "Grapes",
    },
  ]

  // Sample data for completed services
  const completedServices = [
    {
      id: "4",
      name: "Soil Analysis - West Field",
      technique: "Soil Analysis",
      progress: 100,
      startDate: "2024-11-15",
      endDate: "2025-01-10",
      teamCount: 3,
      status: "completed",
      location: "Tulare County, CA",
      fieldSize: 35,
      cropType: "Wheat",
    },
    {
      id: "5",
      name: "Harvest Monitoring - Central Field",
      technique: "Harvest Monitoring",
      progress: 100,
      startDate: "2024-10-01",
      endDate: "2024-12-15",
      teamCount: 4,
      status: "completed",
      location: "San Joaquin County, CA",
      fieldSize: 48,
      cropType: "Rice",
    },
    {
      id: "8",
      name: "Yield Mapping - North Ranch",
      technique: "Yield Mapping",
      progress: 100,
      startDate: "2024-09-15",
      endDate: "2024-11-30",
      teamCount: 3,
      status: "completed",
      location: "Merced County, CA",
      fieldSize: 60,
      cropType: "Alfalfa",
    },
  ]

  // Combine services based on active tab
  const getServicesToDisplay = () => {
    switch (activeTab) {
      case "active":
        return activeServices
      case "completed":
        return completedServices
      case "all":
      default:
        return [...activeServices, ...completedServices]
    }
  }

  // Filter services by search query
  const filteredServices = getServicesToDisplay().filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.technique.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.cropType.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-1">Manage your agriculture services</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/portals/1/services/create">
              <Plus className="mr-2 h-4 w-4" /> Create Service
            </Link>
          </Button>
          
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeServices}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedServices}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.teamMembers}</div>
            <p className="text-xs text-muted-foreground">Across all services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground">Within the next 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Technique</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-seeding" defaultChecked />
                      <Label htmlFor="filter-seeding">Variable Seeding</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-irrigation" defaultChecked />
                      <Label htmlFor="filter-irrigation">Precision Irrigation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-fertilization" defaultChecked />
                      <Label htmlFor="filter-fertilization">Variable Fertilization</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-soil" defaultChecked />
                      <Label htmlFor="filter-soil">Soil Analysis</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-other" defaultChecked />
                      <Label htmlFor="filter-other">Other Techniques</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Crop Type</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-corn" defaultChecked />
                      <Label htmlFor="filter-corn">Corn</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-soybeans" defaultChecked />
                      <Label htmlFor="filter-soybeans">Soybeans</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-wheat" defaultChecked />
                      <Label htmlFor="filter-wheat">Wheat</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filter-other-crops" defaultChecked />
                      <Label htmlFor="filter-other-crops">Other Crops</Label>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-between">
                  <Button variant="outline" size="sm">
                    Reset
                  </Button>
                  <Button size="sm">Apply</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="fresno">Fresno County</SelectItem>
              <SelectItem value="yolo">Yolo County</SelectItem>
              <SelectItem value="kern">Kern County</SelectItem>
              <SelectItem value="tulare">Tulare County</SelectItem>
              <SelectItem value="san-joaquin">San Joaquin County</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 w-full md:w-auto justify-between md:justify-start">
          <div className="flex border rounded-md p-1">
            <Button
              variant={viewType === "grid" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setViewType("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewType === "list" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setViewType("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Select defaultValue="date">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Start Date</SelectItem>
              <SelectItem value="name">Service Name</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Service Projects</h2>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          {viewType === "grid" && <ServicesGridView services={filteredServices} />}
          {viewType === "list" && <ServicesListView services={filteredServices} />}
        </TabsContent>

        <TabsContent value="active" className="mt-0">
          {viewType === "grid" && <ServicesGridView services={filteredServices} />}
          {viewType === "list" && <ServicesListView services={filteredServices} />}
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          {viewType === "grid" && <ServicesGridView services={filteredServices} />}
          {viewType === "list" && <ServicesListView services={filteredServices} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}

