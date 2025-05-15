import { NextResponse } from "next/server";
import { z } from "zod";
import { createDomainRole, listDomainRoles } from "@/lib/services/agtasks";

// Esquema de validación para los parámetros de la query (GET)
const listDomainRolesQuerySchema = z.object({
  domainId: z.string(),
});

// Esquema de validación para el cuerpo de la solicitud (POST)
const createDomainRoleBodySchema = z.object({
  domainId: z.string(),
  name: z.string(),
  language: z.string(),
});

export async function GET(req: Request, { params }: { params: { domainId: string } }) {
  try {
    const { domainId } = params;

    // Validar los parámetros
    const parsedParams = listDomainRolesQuerySchema.safeParse(params);
    if (!parsedParams.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsedParams.error.format() },
        { status: 400 },
      );
    }

    // Listar roles de dominio
    const roles = await listDomainRoles(domainId);

    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    console.error("Error fetching domain roles:", error);
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
    const parsedBody = createDomainRoleBodySchema.safeParse({ ...body, domainId });

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsedBody.error.format() },
        { status: 400 },
      );
    }

    // Crear el rol de dominio
    const newRole = await createDomainRole(domainId, parsedBody.data);

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error("Error creating domain role:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}