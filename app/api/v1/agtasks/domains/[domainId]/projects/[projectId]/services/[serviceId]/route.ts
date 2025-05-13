import { NextResponse } from "next/server"
import { getService } from "@/lib/services/agtasks"

export async function GET(req: Request, { params }: { params: { serviceId: string } }) {
  try {
    const { serviceId } = params

    if (!serviceId) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    const result = await getService(serviceId)
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error fetching service:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
