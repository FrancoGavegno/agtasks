"use client"

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react";
import { FieldType } from "@/lib/interfaces";
import { fieldTypes } from "@/utils/mockData";

const allColumns = [
  { key: "label", title: "Label" },
  { key: "name", title: "Name" },
  { key: "type", title: "Type" },
  { key: "required", title: "Required" },
  { key: "placeholder", title: "Placeholder" },
  { key: "options", title: "Options" },
  { key: "apiCall", title: "API Call" },
]

const uniqueTypes = Array.from(new Set(fieldTypes.map(field => field.type)))

interface FieldTypeSelectorProps {
  taskId: string;
  taskName: string;
  onSelect: (fields: any[]) => void;
  selectedFields: any[];
}

export default function FieldTypeSelector({ taskId, taskName, onSelect, selectedFields }: FieldTypeSelectorProps) {
  const [localSelectedFields, setLocalSelectedFields] = useState(selectedFields)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [visibleColumns, setVisibleColumns] = useState([
    "label",
    "name",
    "type",
    "required",
  ])

  useEffect(() => {
    setLocalSelectedFields(selectedFields)
  }, [selectedFields])

  const filteredFields = fieldTypes.filter((field) => {
    const matchesSearch = field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || field.type === selectedType
    return matchesSearch && matchesType
  })

  const handleFieldToggle = (field: FieldType) => {
    setLocalSelectedFields((prev) => {
      const newSelection = prev.some((f) => f.name === field.name)
        ? prev.filter((f) => f.name !== field.name)
        : [...prev, field]
      onSelect(newSelection)
      return newSelection
    })
  }

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey]
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md">{taskName} Fields</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {allColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={visibleColumns.includes(column.key)}
                  onCheckedChange={() => toggleColumn(column.key)}
                >
                  {column.title}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ScrollArea className="h-[200px] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      filteredFields.length > 0 &&
                      filteredFields.every((field) =>
                        localSelectedFields.some((f) => f.name === field.name)
                      )
                    }
                    onCheckedChange={(checked) => {
                      const newSelection = checked ? filteredFields : []
                      setLocalSelectedFields(newSelection)
                      onSelect(newSelection)
                    }}
                  />
                </TableHead>
                {visibleColumns.map((columnKey) => (
                  <TableHead key={columnKey}>
                    {allColumns.find((col) => col.key === columnKey)?.title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFields.map((field: FieldType) => (
                <TableRow key={field.name}>
                  <TableCell>
                    <Checkbox
                      checked={localSelectedFields.some((f) => f.name === field.name)}
                      onCheckedChange={() => handleFieldToggle(field)}
                    />
                  </TableCell>
                  {visibleColumns.map((columnKey) => (
                    <TableCell key={columnKey}>
                      {columnKey === "required" ? (
                        field.required ? "Yes" : "No"
                      ) : columnKey === "options" ? (
                        Array.isArray(field.options)
                          ? field.options.join(", ")
                          : field.options
                      ) : (
                        field[columnKey as keyof FieldType]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <div className="text-sm text-muted-foreground">
          {localSelectedFields.length} of {filteredFields.length} field(s) selected
        </div>
      </CardContent>
    </Card>
  )
}

