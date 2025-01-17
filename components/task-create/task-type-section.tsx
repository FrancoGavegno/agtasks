import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Sprout, SproutIcon as Seedling, Shield, Droplets, Eye, ShowerHeadIcon as Shower, Wheat, Wrench, Recycle, BarChart3 } from 'lucide-react'

const taskTypes = [
  {
    title: "Planificación de cultivos",
    description: "Utiliza la capa de Lotes para asignar cultivos a cada campo.",
    icon: Sprout
  },
  {
    title: "Siembra",
    description: "Utiliza la capa de Prescripciones para realizar la siembra según el mapa de siembra.",
    icon: Seedling
  },
  {
    title: "Protección del cultivo",
    description: "Utiliza la capa de Recorridas para aplicar herbicidas y pesticidas de manera precisa.",
    icon: Shield
  },
  {
    title: "Fertilización",
    description: "Utiliza la capa de Prescripciones para aplicar fertilizantes de manera precisa.",
    icon: Droplets
  },
  {
    title: "Monitoreo",
    description: "Utiliza la capa de Recorridas para realizar un seguimiento constante de los cultivos.",
    icon: Eye
  },
  {
    title: "Riego",
    description: "Utiliza la capa de Recorridas para asegurar que los cultivos reciban la cantidad adecuada de agua.",
    icon: Shower
  },
  {
    title: "Cosecha",
    description: "Utiliza la capa de Lotes para planificar y ejecutar la cosecha en el momento óptimo.",
    icon: Wheat
  },
  {
    title: "Mantenimiento de maquinaria",
    description: "No se requiere una capa específica para esta tarea.",
    icon: Wrench
  },
  {
    title: "Gestión de residuos",
    description: "Utiliza la capa de Lotes para manejar adecuadamente los residuos agrícolas.",
    icon: Recycle
  },
  {
    title: "Análisis de datos",
    description: "Utiliza las capas de Lotes, Recorridas y Prescripciones para analizar los datos.",
    icon: BarChart3
  }
]

interface TaskTypeSectionProps {
  value: string
  onChange: (value: string) => void
}

export function TaskTypeSection({ value, onChange }: TaskTypeSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Task Type</h2>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select task type" />
        </SelectTrigger>
        <SelectContent>
          {taskTypes.map((task) => {
            const Icon = task.icon
            return (
              <SelectItem key={task.title} value={task.title} className="w-full">
                <div className="flex items-start gap-3 w-full">
                  <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground">{task.description}</div>
                  </div>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

