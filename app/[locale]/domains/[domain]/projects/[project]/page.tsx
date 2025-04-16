import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ProjectDetails } from "@/components/projects/project-page"

export default function ProjectPage() {
  return (
    <div className="container w-full pt-4 pb-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/en/domains/8644/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>01 - Tandil</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-5 mb-5">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">Project Page</h1>
          <p className="text-muted-foreground">Manage your project</p>
        </div>
      </div>

      <ProjectDetails />
    </div>
  )
}
