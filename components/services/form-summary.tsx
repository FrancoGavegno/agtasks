import { Card, CardContent, CardDescription } from "@/components/ui/card"

export default function FormSummary() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Resumen</h2>
      <Card>
        <CardContent className="pt-6">
          <CardDescription>
            Este es el paso final donde se mostrará un resumen completo de toda la información ingresada en los pasos
            anteriores, permitiendo al usuario revisar antes de confirmar.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}

