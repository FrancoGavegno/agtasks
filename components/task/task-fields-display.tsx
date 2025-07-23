"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

interface TaskField {
  fieldId: string
  fieldName: string
  hectares: number
  crop: string
  hybrid: string
  workspaceId: string
  workspaceName: string
  campaignId: string
  campaignName: string
  farmId: string
  farmName: string
}

interface TaskFieldsDisplayProps {
  fields: TaskField[]
}

export function TaskFieldsDisplay({ fields }: TaskFieldsDisplayProps) {
  if (!fields || fields.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campos/Lotes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No hay campos/lotes seleccionados para esta tarea
          </p>
        </CardContent>
      </Card>
    )
  }

  // Group fields by workspace, campaign, and farm
  const groupedFields = fields.reduce((acc, field) => {
    const key = `${field.workspaceId}-${field.campaignId}-${field.farmId}`
    if (!acc[key]) {
      acc[key] = {
        workspaceName: field.workspaceName,
        campaignName: field.campaignName,
        farmName: field.farmName,
        fields: []
      }
    }
    acc[key].fields.push(field)
    return acc
  }, {} as Record<string, { workspaceName: string; campaignName: string; farmName: string; fields: TaskField[] }>)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Campos/Lotes Seleccionados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedFields).map(([key, group]) => (
          <div key={key} className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{group.workspaceName}</Badge>
              <Badge variant="outline">{group.campaignName}</Badge>
              <Badge variant="outline">{group.farmName}</Badge>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lote</TableHead>
                  <TableHead>Cultivo/Híbrido</TableHead>
                  <TableHead>Hectáreas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.fields.map((field) => (
                  <TableRow key={field.fieldId}>
                    <TableCell className="font-medium">{field.fieldName}</TableCell>
                    <TableCell>
                      {field.crop} {field.hybrid && `/ ${field.hybrid}`}
                    </TableCell>
                    <TableCell>{field.hectares}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 