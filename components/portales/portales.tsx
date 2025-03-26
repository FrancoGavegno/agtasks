"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { NuevoPortalServicioModal } from "./nuevo-portal-servicio-modal"
import { DetallePortalServicio } from "./detalle-portal-servicio"
import { Link } from '@/i18n/routing';

// Tipo para los portales de servicio
export type PortalServicio = {
  id: string
  nombre: string
  dominio: string
  area: string
  espacioTrabajo: string
  portalServicio: string
  protocolos: string[]
  roles: string[]
  formularios: string[] // Añadir esta propiedad
}

// Tipo para los roles
export interface Rol {
  id: string
  nombre: string
}

const portales = [
  { id: "1", nombre: "Portal 1", dominio: "Dominio 1", area: "Area 1", espacioTrabajo: "Espacio de trabajo 1", portalServicio: "Portal de servicio 1", protocolos: ["Protocolo 1", "Protocolo 2"], roles: ["Rol 1", "Rol 2"], formularios: ["Formulario 1", "Formulario 2"] },
  { id: "2", nombre: "Portal 2", dominio: "Dominio 2", area: "Area 2", espacioTrabajo: "Espacio de trabajo 2", portalServicio: "Portal de servicio 2", protocolos: ["Protocolo 3", "Protocolo 4"], roles: ["Rol 3", "Rol 4"], formularios: ["Formulario 3", "Formulario 4"] },
  { id: "3", nombre: "Portal 3", dominio: "Dominio 3", area: "Area 3", espacioTrabajo: "Espacio de trabajo 3", portalServicio: "Portal de servicio 3", protocolos: ["Protocolo 5", "Protocolo 6"], roles: ["Rol 5", "Rol 6"], formularios: ["Formulario 5", "Formulario 6"] },
]

export function ServicePortals() {
  // Estado para los portales de servicio
  const [portalesServicio, setPortalesServicio] = useState<PortalServicio[]>(portales)
  const [filtro, setFiltro] = useState("")
  const [modalAbierto, setModalAbierto] = useState(false)
  const [portalServicioSeleccionado, setPortalServicioSeleccionado] = useState<PortalServicio | null>(null)

  // Estado global para los roles
  const [roles, setRoles] = useState<Rol[]>([
    { id: "1", nombre: "Rol 1" },
    { id: "2", nombre: "Rol 2" },
    { id: "3", nombre: "Rol 3" },
    { id: "4", nombre: "Rol 4" },
    { id: "5", nombre: "Rol 5" },
  ])

  // Filtrar portales de servicio por nombre
  const portalesServicioFiltrados = portalesServicio.filter((portalServicio) =>
    portalServicio.nombre.toLowerCase().includes(filtro.toLowerCase()),
  )

  // Función para agregar un nuevo portal de servicio
  const agregarPortalServicio = (
    portalServicio: Omit<PortalServicio, "id" | "protocolos" | "roles" | "formularios">,
  ) => {
    const nuevoPortalServicio = {
      ...portalServicio,
      id: Date.now().toString(),
      protocolos: [],
      roles: [],
      formularios: [], // Inicializar formularios como array vacío
    }
    setPortalesServicio([...portalesServicio, nuevoPortalServicio])
    setModalAbierto(false)
  }

  // Función para actualizar un portal de servicio existente
  const actualizarPortalServicio = (portalServicioActualizado: PortalServicio) => {
    setPortalesServicio(
      portalesServicio.map((p) => (p.id === portalServicioActualizado.id ? portalServicioActualizado : p)),
    )
    setPortalServicioSeleccionado(portalServicioActualizado)
  }

  // Función para actualizar los roles globales
  const actualizarRoles = (nuevosRoles: Rol[]) => {
    setRoles(nuevosRoles)
  }

  // Si hay un portal de servicio seleccionado, mostrar la vista de detalle
  {/* 
    if (portalServicioSeleccionado) {
    return (
      <DetallePortalServicio
        portalServicio={portalServicioSeleccionado}
        roles={roles}
        onVolver={() => setPortalServicioSeleccionado(null)}
        onUpdatePortalServicio={actualizarPortalServicio}
        onUpdateRoles={actualizarRoles}
      />
    )
  }
    */}

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Portales de servicio</h1>
        <Button onClick={() => setModalAbierto(true)}>Nuevo portal de servicio</Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Filtrar portales de servicio por nombre..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="pl-10"
        />
      </div>

      {portalesServicioFiltrados.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {portalesServicioFiltrados.map((portalServicio) => (
            <div
              key={portalServicio.id}
              onClick={() => setPortalServicioSeleccionado(portalServicio)}
              className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md cursor-pointer"
            >
              <h3 className="text-lg font-semibold">{portalServicio.nombre}</h3>
              <p className="text-sm text-muted-foreground">
                {portalServicio.dominio}
                - {portalServicio.area}
                - {portalServicio.espacioTrabajo}</p>
              <Link href={`/portals/${portalServicio.id}`}
                className="text-sm" target="_blank">
                Ver
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">
            {portalesServicio.length === 0
              ? "No hay portales de servicio. Crea uno nuevo."
              : "No se encontraron portales de servicio con ese filtro."}
          </p>
        </div>
      )}

      <NuevoPortalServicioModal
        abierto={modalAbierto}
        onOpenChange={setModalAbierto}
        onGuardar={agregarPortalServicio}
      />
    </div>
  )
}

