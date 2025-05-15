import { NextResponse } from "next/server";
import { z } from "zod";
import { getServiceDetail } from "@/lib/services/agtasks";

// Esquema de validación para los parámetros de la ruta
const serviceParamsSchema = z.object({
  domainId: z.string(),
  projectId: z.string(),
  serviceId: z.string(),
});

export async function GET(req: Request, { params }: { params: { domainId: string; projectId: string; serviceId: string } }) {
  try {
    const { serviceId } = params;

    // Validar los parámetros
    const parsedParams = serviceParamsSchema.safeParse(params);
    if (!parsedParams.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsedParams.error.format() },
        { status: 400 },
      );
    }

    // Obtener los detalles del servicio
    const serviceDetail = await getServiceDetail(serviceId);

    return NextResponse.json(serviceDetail, { status: 200 });
  } catch (error) {
    console.error("Error fetching service detail:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}