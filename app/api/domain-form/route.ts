import { NextResponse } from "next/server";
import { createDomainForm, listDomainForms } from "@/lib/services/agtasks";
import { domainFormSchema, domainFormQuerySchema } from "@/lib/schemas";

export async function POST(req: Request) {
    try {
        const json = await req.json();

        const parsed = domainFormSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }

        const result = await createDomainForm(parsed.data);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error creating domain Form:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const domainId = searchParams.get("domainId");

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
