"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getQueueIssues } from "@/lib/jira"
import type { Value } from "@/lib/interfaces"

// Tipo para los protocolos
interface Protocol {
  id: string
  summary: string
  language: "ES" | "EN" | "PT"
  key: string
  created: string
  reporter?: string
}

export default function ProtocolsRepository() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [languageFilter, setLanguageFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Función para extraer el idioma de las etiquetas o asignar uno por defecto
  const extractLanguage = useCallback((labels: string): "ES" | "EN" | "PT" => {
    if (!labels) return "ES" // Valor por defecto

    const labelsStr = String(labels).toUpperCase()
    if (labelsStr.includes("ES")) return "ES"
    if (labelsStr.includes("EN")) return "EN"
    if (labelsStr.includes("PT")) return "PT"

    return "ES" // Valor por defecto si no se encuentra ninguna coincidencia
  }, [])

  // Cargar datos desde la API de Jira
  useEffect(() => {
    const fetchJiraIssues = async () => {
      setLoading(true)
      try {
        // Usar IDs de servicio y cola de Jira (ajustar según sea necesario)
        const serviceDeskId = "TEM" // Reemplazar con el ID correcto
        const queueId = 82 // Reemplazar con el ID correcto

        const response = await getQueueIssues(serviceDeskId, queueId)

        if (response.success && response.data) {
          // Mapear los datos de Jira a nuestro formato de protocolo
          const jiraIssues = response.data.values as Value[]
          const mappedProtocols = jiraIssues.map((issue) => ({
            id: issue.id,
            key: issue.key,
            summary: issue.fields.summary,
            language: extractLanguage(issue.fields.labels),
            created: issue.fields.created,
            reporter: issue.fields.reporter?.displayName,
          }))

          setProtocols(mappedProtocols)
        } else {
          setError("Error al cargar los protocolos: " + (response.error || "Error desconocido"))
        }
      } catch (err) {
        setError("Error al conectar con la API de Jira")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchJiraIssues()
  }, [extractLanguage])

  // Filtrar protocolos basados en la búsqueda y el filtro de idioma
  const filteredProtocols = protocols.filter((protocol) => {
    const matchesSearch = protocol.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLanguage = languageFilter === "all" || protocol.language === languageFilter
    return matchesSearch && matchesLanguage
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Protocols Repository</h1>
          <p className="text-muted-foreground">Browse and use protocols templates</p>
        </div>
        {/* <Button className="bg-black text-white hover:bg-gray-800">Register protocol</Button> */}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Protocols..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={languageFilter} onValueChange={setLanguageFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            <SelectItem value="ES">ES</SelectItem>
            <SelectItem value="EN">EN</SelectItem>
            <SelectItem value="PT">PT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProtocols.length > 0 ? (
            filteredProtocols.map((protocol) => (
              <Card key={protocol.id} className="border rounded-lg shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold min-h-20">{protocol.summary}</CardTitle>
                    <Button variant="ghost" size="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {protocol.language}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {protocol.key}
                      </Badge>
                    </div>
                    {protocol.created && (
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(protocol.created).toLocaleDateString()}
                      </p>
                    )}
                    {/* protocol.reporter && (
                      <p className="text-xs text-muted-foreground">Reporter: {protocol.reporter}</p>
                    ) */}
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="p-4">
                  <Button
                    variant="default"
                    className="w-full bg-black text-white hover:bg-gray-800"
                    asChild >
                    <Link
                      target="_blank"
                      href={`/services/${protocol.key}/create`}>
                      Start protocol
                    </Link>
                  </Button>


                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No protocols found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

