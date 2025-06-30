import { NextResponse } from "next/server"
import { z } from "zod"
import { 
  listServicesByProject, 
} from "@/lib/services/agtasks"

const listServicesQuerySchema = z.object({
  projectId: z.string(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  search: z.string().optional().default(""),
  sortBy: z.string().optional().default("serviceName"),
  sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
})

export async function GET(req: Request, { params }: { params: { domainId: string; projectId: string } }) {
  try {
    const { projectId } = params

    const result = await listServicesByProject(projectId, {
      page: 1,
      pageSize: 10000, 
      searchQuery: '',
      sortBy: 'createdAt',
      sortDirection: 'desc',
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