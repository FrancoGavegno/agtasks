"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getIssue } from "@/lib/jira"

type JiraSubtask = {
  key: string
  fields: {
    summary: string
    status: {
      name: string
    }
  }
}

type ProtocolDetailProps = {
  templateId: string
}

const PROTOCOL_OPTIONS = [
  {
    value: "satellite-monitoring",
    label: "Monitoreo satelital y control de malezas",
  },
  {
    value: "variable-seeding",
    label: "Protocolo Siembra y/o Fertilización Variable",
  },
]

export default function ProtocolSummary({ templateId }: ProtocolDetailProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [issueData, setIssueData] = useState<any>(null)
  const [selectedProtocol, setSelectedProtocol] = useState<string>("")

  useEffect(() => {
    async function fetchIssueData() {
      try {
        setLoading(true)
        const result = await getIssue(templateId)

        if (!result.success) {
          setError(result.error || "Error al cargar los datos del protocolo")
        } else {
          setIssueData(result.data)
        }
      } catch (err) {
        setError("Error inesperado al cargar los datos")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchIssueData()
  }, [templateId])

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Cargando resumen del protocolo...</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="h-20 flex items-center justify-center">
              <div className="animate-pulse h-4 w-3/4 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Resumen del protocolo a aplicar</h2>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const subtasks: JiraSubtask[] = issueData?.fields?.subtasks || []

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Resumen del protocolo a aplicar</h2>

      <div className="space-y-4">
        <div className="grid w-full max-w-xl items-center gap-1.5">
          <Label htmlFor="protocol">Seleccione el tipo de protocolo</Label>
          <Select value={selectedProtocol} onValueChange={setSelectedProtocol}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un protocolo" />
            </SelectTrigger>
            <SelectContent>
              {PROTOCOL_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProtocol && (
          <Card>
            <CardHeader>
              <CardTitle>{PROTOCOL_OPTIONS.find((opt) => opt.value === selectedProtocol)?.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Detalles del Issue {templateId}</h3>
                  <Badge className="mr-2" variant="outline">
                    {issueData?.fields?.status?.name}
                  </Badge>
                </div>

                {subtasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Subtareas asociadas</h3>
                    <ul className="space-y-4">
                      {subtasks.map((subtask) => (
                        <li key={subtask.key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{subtask.key}</p>
                            <p className="text-sm text-muted-foreground">{subtask.fields.summary}</p>
                          </div>
                          <Badge variant={subtask.fields.status.name === "Done" ? "default" : "secondary"}>
                            {subtask.fields.status.name}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

