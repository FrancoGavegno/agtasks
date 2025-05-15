import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteDomainProtocol } from "@/lib/services/agtasks";

// Esquema de validación para los parámetros de la ruta (DELETE)
const deleteProtocolParamsSchema = z.object({
  domainId: z.string(),
  protocolId: z.string(),
});

export async function DELETE(req: Request, { params }: { params: { domainId: string; protocolId: string } }) {
  try {
    const { domainId, protocolId } = params;

    // Validar los parámetros
    const parsedParams = deleteProtocolParamsSchema.safeParse(params);
    if (!parsedParams.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsedParams.error.format() },
        { status: 400 },
      );
    }

    // Eliminar el protocolo
    const deletedProtocol = await deleteDomainProtocol(domainId, protocolId);

    return NextResponse.json(deletedProtocol, { status: 200 });
  } catch (error) {
    console.error("Error deleting domain protocol:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}