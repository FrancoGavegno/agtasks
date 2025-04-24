import { NextResponse } from "next/server";
import { createDomain } from "@/lib/services/agtasks";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // validación mínima opcional
    if (!data.name) {
      return NextResponse.json({ error: "Missing name" }, { status: 400 });
    }

    const result = await createDomain(data);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating domain:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
