"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Edit, Play, Search } from "lucide-react"

import { listServicesByProject } from "@/lib/agtasks"
import { Service } from "@/lib/interfaces"


export function Services() {
  const [searchQuery, setSearchQuery] = useState("")
  const [ services, setServices ] = useState<Service[]>([])

  useEffect(() => {
    const fetchServices = async () => {
      const data = await listServicesByProject(1)
      setServices(data)
    }
    fetchServices()
  }, [])

  // Filter services based on search query
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.establishment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.lots.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search services..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Servicio</TableHead>
              <TableHead>Establecimiento</TableHead>
              <TableHead>Lotes</TableHead>
              <TableHead>Tot. Has</TableHead>
              <TableHead>Progreso</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.establishment}</TableCell>
                <TableCell>{service.lots}</TableCell>
                <TableCell>{service.totalHectares}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={service.progress} className="h-2 w-[60px]" />
                    <span className="text-xs text-muted-foreground">{service.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>{service.startDate ? new Date(service.startDate).toLocaleDateString() : "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {service.status === "pending" && (
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  )
}
