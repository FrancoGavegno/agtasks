import { ServiceCard } from "@/components/portals/service-card"

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

interface ServicesGridViewProps {
  services: Service[]
}

export function ServicesGridView({ services }: ServicesGridViewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}

