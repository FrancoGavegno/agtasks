import { NextResponse } from "next/server";
import { createDomainForm, listDomainForms, deleteDomainForm } from "@/lib/services/agtasks";
import { domainFormSchema, domainFormQuerySchema, deleteDomainFormSchema } from "@/lib/schemas";

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

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const formId = searchParams.get("formId"); 

        const parsed = deleteDomainFormSchema.safeParse({ formId });
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }

        const result = await deleteDomainForm(parsed.data.formId);
        if (!result) {
            return NextResponse.json(
                { error: "Form not found or could not be deleted" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Form deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting form:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}