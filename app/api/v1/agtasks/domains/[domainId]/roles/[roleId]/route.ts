import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteDomainRole } from "@/lib/services/agtasks";

// Esquema de validación para los parámetros de la ruta (DELETE)
const deleteDomainRoleParamsSchema = z.object({
  domainId: z.string(),
  roleId: z.string(),
});

export async function DELETE(req: Request, { params }: { params: { domainId: string; roleId: string } }) {
  try {
    const { domainId, roleId } = params;

    // Validar los parámetros
    const parsedParams = deleteDomainRoleParamsSchema.safeParse(params);
    if (!parsedParams.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsedParams.error.format() },
        { status: 400 },
      );
    }

    // Eliminar el rol de dominio
    const deletedRole = await deleteDomainRole(domainId, roleId);

    return NextResponse.json(deletedRole, { status: 200 });
  } catch (error) {
    console.error("Error deleting domain role:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}