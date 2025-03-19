import { Breadcrumb } from "@/components/services-2/breadcrumb"
import ServiceCreate from "@/components/services-2/service-create"
import { PORTAL_SERVICIO, PROYECTO_SERVICIO } from "@/lib/constants"

type Props = {
  params: {
    portalId: string
  }
}

export default function ServiceCreatePage({ params }: Props) {
  const { portalId } = params

  return (
    <main>
      <Breadcrumb portalName={PORTAL_SERVICIO} projectName={PROYECTO_SERVICIO} />
      <ServiceCreate portalId={portalId} />
    </main>
  )
}

// Opcional: fuerza renderizado dinámico
export const dynamic = "force-dynamic"

