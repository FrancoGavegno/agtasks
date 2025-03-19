import { Card, CardContent, CardDescription } from "@/components/ui/card"

export default function WorkspaceSelection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Selección del espacio de trabajo, campaña, establecimiento y lotes</h2>
      <Card>
        <CardContent className="pt-6">
          <CardDescription>
            En este paso el usuario podrá seleccionar el espacio de trabajo, la campaña, el establecimiento y los lotes
            correspondientes para la aplicación del protocolo.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}

