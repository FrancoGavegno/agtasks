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
import { useTranslations } from 'next-intl'

export default function Forms() {
  const t = useTranslations("SettingsForms")
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
    // console.log("Guardando preferencias de formularios:", selectedIds)
    setSelectedForms(selectedIds)
    refreshForms()
  }

  if (formsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          <span className="ml-2 text-muted-foreground">{t("loadingForms")}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
            {t("editButton")}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
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
              <TableHead className="w-[70%]">{t("tableHeaders.name")}</TableHead>
              <TableHead className="text-center">{t("tableHeaders.language")}</TableHead>
              <TableHead className="text-center">{t("tableHeaders.origin")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedForms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                  {filter ? t("noFormsSubtitle") : t("noFormsTitle")}
                </TableCell>
              </TableRow>
            ) : (
              paginatedForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">{form.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{form.language || "ES"}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{form.ktFormId ? t("koboToolbox") : t("local")}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {displayedForms.length > 0
            ? t("showing") + " " + (startIndex + 1) + " " + t("of") + " " + Math.min(startIndex + rowsPerPage, displayedForms.length) + " " + t("entries")
            : t("noFormsFound")}
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{t("rowsPerPage")}</p>
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
            <span className="sr-only">{t("firstPage")}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">{t("previousPage")}</span>
          </Button>
          <span className="text-sm">
            {t("page")} {page} {t("of")} {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">{t("nextPage")}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages || totalPages === 0}
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">{t("lastPage")}</span>
          </Button>
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
