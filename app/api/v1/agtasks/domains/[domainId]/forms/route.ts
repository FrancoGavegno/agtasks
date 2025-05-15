import { NextResponse } from "next/server";
import { z } from "zod";
import { createDomainForm, listDomainForms } from "@/lib/services/agtasks";

// Esquema de validación para los parámetros de la query (GET)
const listFormsQuerySchema = z.object({
  domainId: z.string(),
});

// Esquema de validación para el cuerpo de la solicitud (POST)
const createFormBodySchema = z.object({
  domainId: z.string(),
  name: z.string(),
  language: z.string(),
  ktFormId: z.string(),
});

export async function GET(req: Request, { params }: { params: { domainId: string } }) {
  try {
    const { domainId } = params;

    // Validar los parámetros
    const parsedParams = listFormsQuerySchema.safeParse(params);
    if (!parsedParams.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsedParams.error.format() },
        { status: 400 },
      );
    }

    // Listar formularios de dominio
    const forms = await listDomainForms(domainId);

    return NextResponse.json(forms, { status: 200 });
  } catch (error) {
    console.error("Error fetching domain forms:", error);
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
    const parsedBody = createFormBodySchema.safeParse({ ...body, domainId });

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsedBody.error.format() },
        { status: 400 },
      );
    }

    // Crear el formulario de dominio
    const newForm = await createDomainForm(domainId, parsedBody.data);

    return NextResponse.json(newForm, { status: 201 });
  } catch (error) {
    console.error("Error creating domain form:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}