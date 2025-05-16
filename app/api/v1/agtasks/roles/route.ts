import { NextResponse } from "next/server";
import { z } from "zod";
import { listAllRoles } from "@/lib/services/agtasks";

export async function GET(req: Request) {
  try {
    // Obtener los roles
    const roles = await listAllRoles();
    return NextResponse.json(roles, { status: 200 });
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