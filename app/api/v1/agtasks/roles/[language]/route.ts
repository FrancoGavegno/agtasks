import { NextResponse } from "next/server";
import { 
    createRole, 
    listRoles
} from "@/lib/services/agtasks";
import { 
    roleSchema, 
    roleQuerySchema 
} from "@/lib/schemas";

export async function GET(req: Request, { params }: { params: { language: string } }) {
    try {
        const { language } = params;
        const parsed = roleQuerySchema.safeParse({ language });
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }
        const result = await listRoles(parsed.data.language.toLocaleUpperCase());
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching roles:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { language: string } }) {
    try {
        const { language } = params;
        const json = await req.json();
        const parsed = roleSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }
        const result = await createRole(language.toLocaleUpperCase(), parsed.data);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error creating domain Role:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}