import { NextResponse } from "next/server"
import {
    serviceSchema,
    serviceQuerySchema
} from "@/lib/schemas"
import {
    listServicesByProject,
    createService
} from "@/lib/services/agtasks"

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
    try {
        const { projectId } = params;
        const parsed = serviceQuerySchema.safeParse({ projectId });
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }
        const result = await listServicesByProject(projectId);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching services:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const json = await req.json();
        const parsed = serviceSchema.safeParse(json);
        if (!parsed.success) {
            console.log("Validation error", parsed.error.format() )
            
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }
        // console.log("json: ", json)
        const result = await createService(parsed.data);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error creating service:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
