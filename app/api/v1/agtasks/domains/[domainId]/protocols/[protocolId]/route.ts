import { NextResponse } from "next/server";
import {
    deleteDomainProtocol
} from "@/lib/services/agtasks";
import {
    deleteDomainProtocolSchema
} from "@/lib/schemas";

export async function DELETE(req: Request, { params }: { params: { domainId: string, protocolId: string } }) {
    try {
        const { domainId, protocolId } = params;
        const parsed = deleteDomainProtocolSchema.safeParse({ domainId, protocolId });
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }
        const result = await deleteDomainProtocol(parsed.data.domainId, parsed.data.protocolId);
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