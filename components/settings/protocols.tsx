"use client"

import { 
  useState, 
  useEffect 
} from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModalProtocols } from "./protocol-modal"
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
import { useTranslations } from 'next-intl'

export default function Protocols() {
  const t = useTranslations("SettingsProtocols")
  const {
    protocols,
    allProtocols,
    selectedProtocols,
    protocolsLoading,
    setSelectedProtocols,
    refreshProtocols,
    isRefreshingProtocols,
  } = useSettings()

  const [filter, setFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [displayedProtocols, setDisplayedProtocols] = useState<typeof protocols>([])

  // Efecto para actualizar los protocolos mostrados cuando cambian los datos
  useEffect(() => {   
    // Usar directamente los protocolos del dominio
    if (protocols.length > 0) {
      setDisplayedProtocols(protocols)
    } else {
      setDisplayedProtocols([])
    }
  }, [protocols, selectedProtocols])

  // Filter protocols by name
  const filteredProtocols = displayedProtocols.filter((protocol) =>
    protocol.name.toLowerCase().includes(filter.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredProtocols.length / rowsPerPage)
  const startIndex = (page - 1) * rowsPerPage
  const paginatedProtocols = filteredProtocols.slice(startIndex, startIndex + rowsPerPage)

  const handleSavePreferences = async (selectedIds: string[]) => {
    // console.log("Saving preferences with selected IDs:", selectedIds)
    setSelectedProtocols(selectedIds)
    refreshProtocols() // Esto debería volver a cargar los protocolos del dominio
  }

  if (protocolsLoading || isRefreshingProtocols) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          <span className="ml-2 text-muted-foreground">{t("loadingProtocols")}</span>
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
              <TableHead>{t("tableHeaders.name")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProtocols.length === 0 ? (
              <TableRow>
                <TableCell colSpan={1} className="text-center py-6 text-muted-foreground">
                  {filter ? t("noProtocolsSubtitle") : t("noProtocolsTitle")}
                </TableCell>
              </TableRow>
            ) : (
              paginatedProtocols.map((protocol) => (
                <TableRow key={protocol.id}>
                  <TableCell className="font-medium">{protocol.name}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {t("showing")} {startIndex + 1} {t("of")} {Math.min(startIndex + rowsPerPage, filteredProtocols.length)} {t("entries")}
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
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
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

      <ModalProtocols
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allProtocols={allProtocols}
        protocols={protocols}
        selectedProtocols={selectedProtocols}
        onSave={handleSavePreferences}
      />
    </div>
  )
}
