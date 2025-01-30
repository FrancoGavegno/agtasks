import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FolderIcon } from 'lucide-react'

interface Project {
  id: string
  name: string
  taskCount: number
  color?: "green" | "yellow" | "purple" | "default"
}

const PROJECTS: Project[] = [
  {
    id: "campo-romero",
    name: "Campo Romero Ambientación con Mapa",
    taskCount: 0,
    color: "default"
  },
  {
    id: "new-template",
    name: "NewFromTemplate",
    taskCount: 4,
    color: "default"
  },
  {
    id: "ambientacion-prod",
    name: "Ambientación con mapa de productividad",
    taskCount: 4,
    color: "default"
  },
  {
    id: "prescripcion-cliente",
    name: "Prescripción y Aplicación variable Cliente",
    taskCount: 8,
    color: "default"
  },
  {
    id: "project-starter",
    name: "Project Starter Template Guide (DEMO)",
    taskCount: 0,
    color: "green"
  },
  {
    id: "ambientacion-mapa",
    name: "Ambientación con Mapa de Productividad",
    taskCount: 4,
    color: "default"
  },
  {
    id: "prescripcion-demo",
    name: "Prescripción Variable DEMO ED/TONY",
    taskCount: 8,
    color: "default"
  },
  {
    id: "event-project",
    name: "Event Project Planning DEMO TONY",
    taskCount: 25,
    color: "yellow"
  },
  {
    id: "prescripcion-14",
    name: "Prescripción Variable 14-01",
    taskCount: 8,
    color: "purple"
  }
]

interface ProjectSectionProps {
  selectedProject: string
  onProjectChange: (projectId: string) => void
}

export function ProjectSection({ selectedProject, onProjectChange }: ProjectSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Assign to Project</h2>
      <ScrollArea className="h-[300px] border rounded-lg">
        <RadioGroup value={selectedProject} onValueChange={onProjectChange}>
          <div className="p-4 space-y-2">
            {PROJECTS.map((project) => (
              <Label
                key={project.id}
                htmlFor={project.id}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-accent
                  ${project.color === "green" && "border-l-4 border-l-green-500"}
                  ${project.color === "yellow" && "border-l-4 border-l-yellow-500"}
                  ${project.color === "purple" && "border-l-4 border-l-purple-500"}
                `}
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem value={project.id} id={project.id} />
                  <div className="flex items-center gap-2">
                    <FolderIcon className={`w-4 h-4
                      ${project.color === "green" && "text-green-500"}
                      ${project.color === "yellow" && "text-yellow-500"}
                      ${project.color === "purple" && "text-purple-500"}
                    `} />
                    {project.name}
                  </div>
                </div>
                {project.taskCount > 0 && (
                  <Badge variant="secondary">{project.taskCount}</Badge>
                )}
              </Label>
            ))}
          </div>
        </RadioGroup>
      </ScrollArea>
    </div>
  )
}

