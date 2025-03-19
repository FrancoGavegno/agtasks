import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, Clock, Users } from "lucide-react"
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface Service {
  id: string
  name: string
  technique: string
  progress: number
  startDate: string
  endDate: string
  teamCount: number
  status: "active" | "completed"
}

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
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
    }

    return techniques[technique] || "default"
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant={getBadgeVariant(service.technique)} className="mb-2">
            {service.technique}
          </Badge>
          <Badge variant={service.status === "active" ? "default" : "secondary"}>
            {service.status === "active" ? "Active" : "Completed"}
          </Badge>
        </div>
        <CardTitle className="line-clamp-1">{service.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{service.progress}%</span>
            </div>
            <Progress value={service.progress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{formatDate(service.startDate)}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDate(service.endDate)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{service.teamCount} team members</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/portals/1/services/${service.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

