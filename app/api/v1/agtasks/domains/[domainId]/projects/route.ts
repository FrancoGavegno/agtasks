import { NextResponse } from "next/server";
import { z } from "zod";
import { listProjectsByDomain, createProject } from "@/lib/services/agtasks";

// Esquema de validación para los parámetros de la query (GET)
const listProjectsQuerySchema = z.object({
  domainId: z.string(),
});

// Esquema de validación para el cuerpo de la solicitud (POST)
const createProjectBodySchema = z.object({
  domainId: z.string(),
  areaId: z.string(), // relaciona con el area de 360
  language: z.string(),
  sourceSystem: z.string(),
  projectId: z.string(), // relaciona con el proyecto del task manager
  requestTypeId: z.string(),
  queueId: z.number(),
  name: z.string(),
});

export async function GET(req: Request, { params }: { params: { domainId: string } }) {
  try {
    const { domainId } = params;

    // Validar los parámetros
    const parsedParams = listProjectsQuerySchema.safeParse(params);
    if (!parsedParams.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsedParams.error.format() },
        { status: 400 },
      );
    }

    // Listar proyectos
    const projects = await listProjectsByDomain(domainId);

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
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
    const parsedBody = createProjectBodySchema.safeParse({ ...body, domainId });

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsedBody.error.format() },
        { status: 400 },
      );
    }

    // Crear el proyecto
    const newProject = await createProject(domainId, parsedBody.data);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}