import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteDomainForm } from "@/lib/services/agtasks";

// Esquema de validación para los parámetros de la ruta (DELETE)
const deleteFormParamsSchema = z.object({
  domainId: z.string(),
  formId: z.string(),
});

export async function DELETE(req: Request, { params }: { params: { domainId: string; formId: string } }) {
  try {
    const { domainId, formId } = params;

    // Validar los parámetros
    const parsedParams = deleteFormParamsSchema.safeParse(params);
    if (!parsedParams.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsedParams.error.format() },
        { status: 400 },
      );
    }

    // Eliminar el formulario de dominio
    const deletedForm = await deleteDomainForm(domainId, formId);

    return NextResponse.json(deletedForm, { status: 200 });
  } catch (error) {
    console.error("Error deleting domain form:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}