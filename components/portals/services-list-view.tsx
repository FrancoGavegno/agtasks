"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CalendarDays, Clock, MoreHorizontal, Users } from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  name: string
  technique: string
  progress: number
  startDate: string
  endDate: string
  teamCount: number
  status: "active" | "completed"
  location: string
  fieldSize: number
  cropType: string
}

interface ServicesListViewProps {
  services: Service[]
}

export function ServicesListView({ services }: ServicesListViewProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const getBadgeVariant = (technique: string) => {
    const techniques: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      "Variable Seeding": "default",
      "Precision Irrigation": "secondary",
      "Variable Fertilization": "outline",
      "Soil Analysis": "destructive",
      "Harvest Monitoring": "outline",
      "Drone Mapping": "secondary",
      "Precision Pest Management": "default",
      "Yield Mapping": "destructive",
    }

    return techniques[technique] || "default"
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service Name</TableHead>
            <TableHead>Technique</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Timeline</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">
                <Link href={`/services/${service.id}`} className="hover:underline">
                  {service.name}
                </Link>
                <div className="text-xs text-muted-foreground mt-1">
                  {service.cropType} • {service.fieldSize} ha
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(service.technique)}>{service.technique}</Badge>
              </TableCell>
              <TableCell>
                <div className="w-[100px]">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{service.progress}%</span>
                  </div>
                  <Progress value={service.progress} className="h-2" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{formatDate(service.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDate(service.endDate)}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{service.location}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{service.teamCount}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={service.status === "active" ? "default" : "secondary"}>
                  {service.status === "active" ? "Active" : "Completed"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/services/${service.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Service</DropdownMenuItem>
                    <DropdownMenuItem>Add Task</DropdownMenuItem>
                    <DropdownMenuItem>Generate Report</DropdownMenuItem>
                    {service.status === "active" ? (
                      <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>Reactivate</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

