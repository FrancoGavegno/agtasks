import { Card, CardContent, CardDescription } from "@/components/ui/card"

export default function DeadlineAndRoles() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Fecha limite, Roles y Usuarios asignados</h2>
      <Card>
        <CardContent className="pt-6">
          <CardDescription>
            En este paso el usuario podrá establecer la fecha límite para completar el protocolo, asignar roles
            específicos y seleccionar los usuarios que participarán en el proceso.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}

