import { NextResponse } from "next/server";
import { 
    createDomainRole, 
    listDomainRoles
} from "@/lib/services/agtasks";
import { 
    domainRoleSchema, 
    domainRoleQuerySchema 
} from "@/lib/schemas";

export async function GET(req: Request, { params }: { params: { domainId: string } }) {
    try {
        const { domainId } = params;
        const parsed = domainRoleQuerySchema.safeParse({ domainId });
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }
        const result = await listDomainRoles(parsed.data.domainId);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching domain Role:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { domainId: string } }) {
    try {
        const { domainId } = params;
        const json = await req.json();
        const parsed = domainRoleSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }
        const result = await createDomainRole(domainId, parsed.data);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error creating domain Role:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}