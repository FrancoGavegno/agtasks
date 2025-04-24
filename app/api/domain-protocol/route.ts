import { NextResponse } from "next/server";
import {
    createDomainProtocol,
    listDomainProtocols,
    deleteDomainProtocol
} from "@/lib/services/agtasks";
import {
    domainProtocolSchema,
    domainProtocolQuerySchema,
    deleteDomainProtocolSchema
} from "@/lib/schemas";

export async function POST(req: Request) {
    try {
        const json = await req.json();

        const parsed = domainProtocolSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }

        const result = await createDomainProtocol(parsed.data);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error creating domain protocol:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const domainId = searchParams.get("domainId");

        const parsed = domainProtocolQuerySchema.safeParse({ domainId });
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }

        const result = await listDomainProtocols(parsed.data.domainId);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching domain protocol:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const protocolId = searchParams.get("protocolId"); // Asumimos que el ID viene como query param

        const parsed = deleteDomainProtocolSchema.safeParse({ protocolId });
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }

        const result = await deleteDomainProtocol(parsed.data.protocolId);
        if (!result) {
            return NextResponse.json(
                { error: "Protocol not found or could not be deleted" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Protocol deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting protocol:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
