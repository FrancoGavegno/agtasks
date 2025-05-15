import { NextResponse } from "next/server";
import { z } from "zod";
import { createRole, deleteRole, listRoles } from "@/lib/services/agtasks";

// Esquema de validación para el parámetro de la ruta (language)
const languageParamSchema = z.object({
  language: z.string().min(2, "Language must be at least 2 characters").max(5, "Language must be at most 5 characters").regex(/^[A-Z]{2}$/, "Language must be a valid ISO 639-1 code (e.g., 'EN', 'ES')"),
});

// Esquema de validación para el cuerpo de la solicitud POST (crear un rol)
const createRoleSchema = z.object({
  name: z.string().min(1, "Role name is required").max(100, "Role name must be at most 100 characters"),
  // Puedes añadir más campos según los requisitos de createRole
});

// Esquema de validación para el cuerpo de la solicitud DELETE (eliminar un rol)
const deleteRoleSchema = z.object({
  id: z.string().min(1, "Role ID is required"), // Asumiendo que deleteRole necesita un ID para identificar el rol
});

export async function GET(req: Request, { params }: { params: { language: string } }) {
  try {
    const { language } = languageParamSchema.parse(params);

    // Obtener los roles
    const roles = await listRoles(language);
    // console.log("roles:", roles)

    // Estandarizar la respuesta
    return NextResponse.json({ data: roles }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", message: error.errors },
        { status: 400 },
      );
    }

    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

export async function POST(req: Request, { params }: { params: { language: string } }) {
  try {
    // Validar el parámetro language
    const { language } = languageParamSchema.parse(params);

    // Validar el cuerpo de la solicitud
    const data = await req.json();
    const validatedData = createRoleSchema.parse(data);

    // Crear el rol
    const role = await createRole({ ...validatedData, language });

    // Estandarizar la respuesta
    return NextResponse.json({ data: role }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", message: error.errors },
        { status: 400 },
      );
    }

    console.error("Error creating role:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { language: string } }) {
  try {
    const {language} = params;
    // Eliminar el rol
    const result = await deleteRole(language);

    // Estandarizar la respuesta
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", message: error.errors },
        { status: 400 },
      );
    }

    console.error("Error deleting role:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}