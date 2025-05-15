import { NextResponse } from "next/server";
import { z } from "zod";
import { createDomainProtocol, listDomainProtocols } from "@/lib/services/agtasks";

// Esquema de validación para los parámetros de la query (GET)
const listProtocolsQuerySchema = z.object({
  domainId: z.string(),
});

// Esquema de validación para el cuerpo de la solicitud (POST)
const createProtocolBodySchema = z.object({
  domainId: z.string(),
  tmProtocolId: z.string(),
  name: z.string(),
  language: z.string(),
});

export async function GET(req: Request, { params }: { params: { domainId: string } }) {
  try {
    const { domainId } = params;

    // Validar los parámetros
    const parsedParams = listProtocolsQuerySchema.safeParse(params);
    if (!parsedParams.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsedParams.error.format() },
        { status: 400 },
      );
    }

    // Listar protocolos
    const protocols = await listDomainProtocols(domainId);

    return NextResponse.json(protocols, { status: 200 });
  } catch (error) {
    console.error("Error fetching domain protocols:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

export async function POST(req: Request, { params }: { params: { domainId: string } }) {
  try {
    const { domainId } = params;

    // Parsear el cuerpo de la solicitud
    const body = await req.json();
    const parsedBody = createProtocolBodySchema.safeParse({ ...body, domainId });

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsedBody.error.format() },
        { status: 400 },
      );
    }

    // Crear el protocolo
    const newProtocol = await createDomainProtocol(domainId, parsedBody.data);

    return NextResponse.json(newProtocol, { status: 201 });
  } catch (error) {
    console.error("Error creating domain protocol:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}