"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Plus, Trash2, ListPlus } from "lucide-react"
import type { PortalServicio, Rol } from "./portales"
import { ProtocolosModal } from "./protocolos-modal"
import { RolModal } from "./rol-modal"
import { FormulariosModal } from "./formularios-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Link } from "@/i18n/routing"

interface DetallePortalServicioProps {
  portalServicio: PortalServicio
  roles: Rol[]
  onVolver: () => void
  onUpdatePortalServicio: (portalServicioActualizado: PortalServicio) => void
  onUpdateRoles: (nuevosRoles: Rol[]) => void
}

export function DetallePortalServicio({
  portalServicio,
  roles,
  onVolver,
  onUpdatePortalServicio,
  onUpdateRoles,
}: DetallePortalServicioProps) {
  const [protocolosModalAbierto, setProtocolosModalAbierto] = useState(false)
  const [rolModalAbierto, setRolModalAbierto] = useState(false)
  const [formulariosModalAbierto, setFormulariosModalAbierto] = useState(false)
  const [portalServicioActual, setPortalServicioActual] = useState<PortalServicio>(portalServicio)
  const [rolesActuales, setRolesActuales] = useState<Rol[]>(roles)

  // Estado para el rol que se está editando/creando
  const [rolActual, setRolActual] = useState<Rol | null>(null)

  // Estado para el diálogo de confirmación de eliminación
  const [rolAEliminar, setRolAEliminar] = useState<Rol | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  // Actualizar el estado local cuando cambian las props
  useEffect(() => {
    setPortalServicioActual(portalServicio)
    setRolesActuales(roles)
  }, [portalServicio, roles])

  // Función para actualizar el portal de servicio en el componente padre
  const actualizarPortalServicio = (portalServicioActualizado: PortalServicio) => {
    setPortalServicioActual(portalServicioActualizado)
    onUpdatePortalServicio(portalServicioActualizado)
  }

  const handleGuardarProtocolos = (protocolosSeleccionados: string[]) => {
    const portalServicioActualizado = {
      ...portalServicioActual,
      protocolos: protocolosSeleccionados,
    }
    actualizarPortalServicio(portalServicioActualizado)
  }

  const handleGuardarFormularios = (formulariosSeleccionados: string[]) => {
    const portalServicioActualizado = {
      ...portalServicioActual,
      formularios: formulariosSeleccionados,
    }
    actualizarPortalServicio(portalServicioActualizado)
  }

  // Obtener los roles asociados al portal de servicio
  const rolesAsociados = rolesActuales.filter((rol) => portalServicioActual.roles.includes(rol.id))

  // Iniciar la creación de un nuevo rol
  const handleNuevoRol = () => {
    setRolActual(null)
    setRolModalAbierto(true)
  }

  // Iniciar la edición de un rol existente
  const handleEditarRol = (rol: Rol) => {
    setRolActual(rol)
    setRolModalAbierto(true)
  }

  // Confirmar la eliminación de un rol
  const handleConfirmarEliminar = (rol: Rol) => {
    setRolAEliminar(rol)
    setConfirmDeleteOpen(true)
  }

  // Eliminar un rol
  const handleEliminarRol = () => {
    if (rolAEliminar) {
      // Eliminar el rol de la lista global de roles
      const nuevosRoles = rolesActuales.filter((r) => r.id !== rolAEliminar.id)
      setRolesActuales(nuevosRoles)
      onUpdateRoles(nuevosRoles)

      // Eliminar el rol de la lista de roles asociados al portal de servicio
      const nuevosRolesSeleccionados = portalServicioActual.roles.filter((id) => id !== rolAEliminar.id)
      const portalServicioActualizado = {
        ...portalServicioActual,
        roles: nuevosRolesSeleccionados,
      }
      actualizarPortalServicio(portalServicioActualizado)

      // Cerrar el diálogo de confirmación
      setConfirmDeleteOpen(false)
      setRolAEliminar(null)
    }
  }

  // Guardar un rol (crear o editar)
  const handleGuardarRol = (nombre: string) => {
    if (!nombre.trim()) return

    if (!rolActual) {
      // Crear un nuevo rol
      const nuevoRol: Rol = {
        id: Date.now().toString(),
        nombre: nombre.trim(),
      }

      // Agregar el nuevo rol a la lista global de roles
      const nuevosRoles = [...rolesActuales, nuevoRol]
      setRolesActuales(nuevosRoles)
      onUpdateRoles(nuevosRoles)

      // Asociar el nuevo rol al portal de servicio
      const nuevosRolesSeleccionados = [...portalServicioActual.roles, nuevoRol.id]
      const portalServicioActualizado = {
        ...portalServicioActual,
        roles: nuevosRolesSeleccionados,
      }
      actualizarPortalServicio(portalServicioActualizado)
    } else {
      // Actualizar un rol existente
      const nuevosRoles = rolesActuales.map((r) => (r.id === rolActual.id ? { ...r, nombre: nombre.trim() } : r))
      setRolesActuales(nuevosRoles)
      onUpdateRoles(nuevosRoles)

      // No necesitamos modificar la lista de IDs, solo actualizar el estado global
      // Pero actualizamos el portal de servicio para asegurar que los cambios se propaguen
      actualizarPortalServicio({ ...portalServicioActual })
    }

    // Cerrar el modal
    setRolModalAbierto(false)
    setRolActual(null)
  }

  // Obtener los nombres de los formularios seleccionados
  const obtenerNombreFormulario = (id: string) => {
    const formulario = FORMULARIOS.find((f) => f.id === id)
    return formulario ? formulario.nombre : id
  }

  // Generar una clave para el protocolo basada en su nombre (para el enlace)
  const generarClaveProtocolo = (nombre: string) => {
    return nombre.toLowerCase().replace(/\s+/g, "-")
  }

  // Lista de formularios KoboToolbox de ejemplo (duplicada para acceso local)
  const FORMULARIOS = [
    { id: "form1", nombre: "Formulario de Registro de Beneficiarios" },
    { id: "form2", nombre: "Encuesta de Satisfacción" },
    { id: "form3", nombre: "Evaluación de Necesidades" },
    { id: "form4", nombre: "Monitoreo de Actividades" },
    { id: "form5", nombre: "Registro de Incidentes" },
    { id: "form6", nombre: "Evaluación Post-Distribución" },
    { id: "form7", nombre: "Formulario de Consentimiento" },
    { id: "form8", nombre: "Evaluación de Vulnerabilidad" },
    { id: "form9", nombre: "Registro de Asistencia" },
    { id: "form10", nombre: "Formulario de Seguimiento" },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onVolver}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Detalle del Portal de Servicio</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{portalServicioActual.nombre}</CardTitle>
            <CardDescription>Información detallada del portal de servicio</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Dominio</dt>
                <dd className="text-sm">{portalServicioActual.dominio}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Área</dt>
                <dd className="text-sm">{portalServicioActual.area}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Espacio de trabajo</dt>
                <dd className="text-sm">{portalServicioActual.espacioTrabajo}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Proyecto</dt>
                <dd className="text-sm">{portalServicioActual.portalServicio}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Protocolos</CardTitle>
              <CardDescription>Protocolos asociados a este portal de servicio</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setProtocolosModalAbierto(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </CardHeader>
          <CardContent>
            {portalServicioActual.protocolos && portalServicioActual.protocolos.length > 0 ? (
              <ul className="space-y-2">
                {portalServicioActual.protocolos.map((protocolo) => (
                  <li key={protocolo} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="text-sm">{protocolo}</span>
                    </div>
                    <Link
                      //href={`/services/${protocolo}/create`}
                      href={`/services/TEM-1/create`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <ListPlus className="h-5 w-5" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">
                  No hay protocolos asociados. Haga clic en "Editar" para agregar.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Roles</CardTitle>
              <CardDescription>Roles asociados a este portal de servicio</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleNuevoRol}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          </CardHeader>
          <CardContent>
            {rolesAsociados.length > 0 ? (
              <ul className="space-y-2">
                {rolesAsociados.map((rol) => (
                  <li key={rol.id} className="flex items-center justify-between">
                    <span className="text-sm">{rol.nombre}</span>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditarRol(rol)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleConfirmarEliminar(rol)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">
                  No hay roles asociados. Haga clic en "Agregar" para crear un rol.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Formularios</CardTitle>
              <CardDescription>Formularios KoboToolbox asociados a este portal de servicio</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setFormulariosModalAbierto(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </CardHeader>
          <CardContent>
            {portalServicioActual.formularios && portalServicioActual.formularios.length > 0 ? (
              <ul className="space-y-2">
                {portalServicioActual.formularios.map((formularioId) => (
                  <li key={formularioId} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-sm">{obtenerNombreFormulario(formularioId)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">
                  No hay formularios asociados. Haga clic en "Editar" para agregar.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <ProtocolosModal
          abierto={protocolosModalAbierto}
          onOpenChange={setProtocolosModalAbierto}
          protocolosSeleccionados={portalServicioActual.protocolos || []}
          onGuardar={handleGuardarProtocolos}
        />

        <RolModal
          abierto={rolModalAbierto}
          onOpenChange={setRolModalAbierto}
          rol={rolActual}
          onGuardar={handleGuardarRol}
        />

        <FormulariosModal
          abierto={formulariosModalAbierto}
          onOpenChange={setFormulariosModalAbierto}
          formulariosSeleccionados={portalServicioActual.formularios || []}
          onGuardar={handleGuardarFormularios}
        />

        <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará el rol "{rolAEliminar?.nombre}" permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleEliminarRol}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

