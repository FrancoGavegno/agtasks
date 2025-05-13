import { NextResponse } from "next/server";
import {
    listProjectsByDomain,
    createProject
} from "@/lib/services/agtasks";
import {
    projectQuerySchema,
    projectSchema
} from "@/lib/schemas";

export async function GET(req: Request, { params }: { params: { domainId: string } }) {
    try {
        const { domainId } = params;
        const parsed = projectQuerySchema.safeParse({ domainId });
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }
        const result = await listProjectsByDomain(parsed.data.domainId);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching projects by domain:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { domainId: string } }) {
    try {
        const { domainId } = params
        const json = await req.json();
        const parsed = projectSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }
        // console.log("json: ", json)
        const result = await createProject(domainId, parsed.data);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error creating domain protocol:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}