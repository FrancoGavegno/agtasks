import { NextResponse } from "next/server"
import { z } from "zod"
import { listServicesByProject, createService } from "@/lib/services/agtasks"
import type { Service } from "@/lib/interfaces"

// Esquema de validación para los parámetros de la query (GET)
const listServicesQuerySchema = z.object({
  projectId: z.string(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  search: z.string().optional().default(""),
  sortBy: z.string().optional().default("serviceName"),
  sortDirection: z.enum(["asc", "desc"]).optional().default("asc"),
})

// Esquema de validación para el cuerpo de la solicitud (POST)
const createServiceBodySchema = z.object({
  projectId: z.string(),
  serviceName: z.string(),
  sourceSystem: z.string(),
  externalTemplateId: z.string(),
  workspaceId: z.string(),
  workspaceName: z.string().optional(),
  campaignId: z.string(),
  campaignName: z.string().optional(),
  farmId: z.string(),
  farmName: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  fields: z.array(z.object({ fieldId: z.string(), fieldName: z.string().optional() })).optional(),
  tasks: z
    .array(
      z.object({
        externalTemplateId: z.string(),
        sourceSystem: z.string(),
        roleId: z.string(),
        userId: z.string(),
        taskName: z.string().optional(),
      }),
    )
    .optional(),
})

// Handler para GET (listar servicios con paginación)
export async function GET(req: Request, { params }: { params: { domainId: string; projectId: string } }) {
  try {
    const { projectId } = params

    // Parsear los parámetros de la query
    const url = new URL(req.url)
    const queryParams = {
      projectId,
      page: url.searchParams.get("page") || "1",
      pageSize: url.searchParams.get("pageSize") || "10",
      search: url.searchParams.get("search") || "",
      sortBy: url.searchParams.get("sortBy") || "serviceName",
      sortDirection: url.searchParams.get("sortDirection") || "asc",
    }

    const parsedQuery = listServicesQuerySchema.safeParse(queryParams)
    if (!parsedQuery.success) {
      return NextResponse.json({ error: "Validation error", issues: parsedQuery.error.format() }, { status: 400 })
    }

    const { page, pageSize, search, sortBy, sortDirection } = parsedQuery.data

    // Llamar a la función para listar servicios
    const result = await listServicesByProject(projectId, {
      page,
      pageSize,
      searchQuery: search,
      sortBy: sortBy as keyof Service,
      sortDirection: sortDirection as "asc" | "desc",
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

// Handler para POST (crear un servicio)
export async function POST(req: Request, { params }: { params: { domainId: string; projectId: string } }) {
  try {
    const { projectId } = params

    // Parsear el cuerpo de la solicitud
    const body = await req.json()
    const parsedBody = createServiceBodySchema.safeParse({ ...body, projectId })

    if (!parsedBody.success) {
      return NextResponse.json({ error: "Validation error", issues: parsedBody.error.format() }, { status: 400 })
    }

    // Crear el servicio
    const newService = await createService(parsedBody.data)

    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
