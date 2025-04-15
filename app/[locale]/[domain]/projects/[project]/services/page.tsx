'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Services } from "@/components/projects/services"
import { Plus } from "lucide-react"
import { Link } from "@/i18n/routing"

export default function ServicesPage() {
  return (
    <div className="container w-full pt-4 pb-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/en/8644/projects/1">01 - Tandil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Services</BreadcrumbPage>
          </BreadcrumbItem>
          
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-5 mb-5">
      <div>
          <h2 className="text-2xl font-semibold tracking-tight">Services</h2>
          <p className="text-muted-foreground">Manage your project services</p>
        </div>
        <Link href={`/8644/projects/1/services/create`} >
            <Button>
            <Plus className="mr-2 h-4 w-4" /> Crear Servicio
            </Button>
          </Link>
        
      </div>

      <Services />
    </div>
      
    
  )
}
