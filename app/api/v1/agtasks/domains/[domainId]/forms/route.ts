import { NextResponse } from "next/server";
import { 
    createDomainForm, 
    listDomainForms 
} from "@/lib/services/agtasks";
import { 
    domainFormSchema, 
    domainFormQuerySchema 
} from "@/lib/schemas";

export async function GET(req: Request, { params }: { params: { domainId: string } }) {
    try {
        const { domainId } = params;
        const parsed = domainFormQuerySchema.safeParse({ domainId });
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }
        const result = await listDomainForms(parsed.data.domainId);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching domain Form:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { domainId: string } }) {
    try {
        const { domainId } = params;
        const json = await req.json();
        const parsed = domainFormSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }
        const result = await createDomainForm(domainId, parsed.data);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error creating domain Form:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
