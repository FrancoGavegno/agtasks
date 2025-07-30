"use client"

import { 
  useState, 
  useEffect 
} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormModal } from "./form-modal"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Loader2, 
  Search 
} from "lucide-react"
import { useSettings } from "@/lib/contexts/settings-context"
import { Badge } from "@/components/ui/badge"
import  { type DomainForm } from "@/lib/schemas"

export default function Forms() {
  const { 
    forms, 
    allForms, 
    selectedForms, 
    formsLoading, 
    setSelectedForms, 
    refreshForms 
  } = useSettings()
  const [filter, setFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [displayedForms, setDisplayedForms] = useState<DomainForm[]>([])

  // console.log("Forms component:", { forms, allForms, selectedForms, displayedForms })

  // Actualizar displayedForms cuando cambien forms o selectedForms
  useEffect(() => {
    // Combinar los formularios del dominio con los formularios seleccionados de allForms
    const domainFormKtFormIds = forms.map((form) => form.ktFormId)

    // 1. Primero, incluir todos los formularios del dominio que están seleccionados
    let combined: DomainForm[] = forms
      .filter((form) => selectedForms.includes(form.ktFormId))
      .map((form) => ({
        domainId: form.domainId,
        id: form.id,
        ktFormId: form.ktFormId,
        name: form.name,
        language: form.language
      }))

    // 2. Luego, añadir formularios de allForms que están seleccionados pero no están en el dominio
    const additionalForms = allForms
      .filter((form) => {
        // Si el ktFormId está seleccionado pero no está en los formularios del dominio
        return selectedForms.includes(form.ktFormId) && !domainFormKtFormIds.includes(form.ktFormId)
      })
      .map((form) => ({
        ...form,
        id: form.id || form.ktFormId // Asegurar que id siempre tenga un valor
      })) as DomainForm[]

    combined = [...combined, ...additionalForms]

    // console.log("Combined forms:", combined)

    // Filtrar por término de búsqueda
    const filtered = combined.filter((form) => form.name.toLowerCase().includes(filter.toLowerCase()))

    setDisplayedForms(filtered)
  }, [forms, allForms, selectedForms, filter])

  // Calculate pagination
  const totalPages = Math.ceil(displayedForms.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const paginatedForms = displayedForms.slice(startIndex, startIndex + rowsPerPage)

  const handleSavePreferences = async (selectedIds: string[]) => {
    console.log("Guardando preferencias de formularios:", selectedIds)
    setSelectedForms(selectedIds)
    refreshForms()
  }

  if (formsLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Cargando formularios...</span>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Formularios</h2>
          <p className="text-sm text-muted-foreground">Administra los formularios de recolección de datos</p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          Editar
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filtrar formularios..."
            className="pl-8"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70%]">Nombre</TableHead>
              <TableHead className="text-center">Idioma</TableHead>
              <TableHead className="text-center">Origen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedForms.length > 0 ? (
              paginatedForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">{form.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{form.language || "ES"}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{form.ktFormId ? "KoboToolbox" : "Local"}</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No se encontraron formularios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {displayedForms.length > 0
            ? `Mostrando ${startIndex + 1} a ${Math.min(startIndex + rowsPerPage, displayedForms.length)} de ${
                displayedForms.length
              } formularios`
            : "No se encontraron formularios"}
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Filas por página</p>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => {
                setRowsPerPage(Number(value))
                setPage(1)
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={rowsPerPage.toString()} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 15, 20].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(1)} disabled={page === 1}>
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">Primera página</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>
            <span className="text-sm">
              Página {page} de {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Página siguiente</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages || totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Última página</span>
            </Button>
          </div>
        </div>
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allForms={allForms}
        forms={forms}
        selectedForms={selectedForms}
        onSave={handleSavePreferences}
      />
    </div>
  )
}
