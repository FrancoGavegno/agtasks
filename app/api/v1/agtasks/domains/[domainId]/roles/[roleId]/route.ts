import { NextResponse } from "next/server";
import { 
    deleteDomainRole 
} from "@/lib/services/agtasks";
import { 
    deleteDomainRoleSchema 
} from "@/lib/schemas";

export async function DELETE(req: Request, { params }: { params: { domainId: string, roleId: string } }) {
    try {
        const { domainId, roleId } = params;
        const parsed = deleteDomainRoleSchema.safeParse({ domainId, roleId });
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }
        const result = await deleteDomainRole(parsed.data.domainId, parsed.data.roleId);
        if (!result) {
            return NextResponse.json(
                { error: "Role not found or could not be deleted" },
                { status: 404 }
            );
        }
        return NextResponse.json({ message: "Role deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting role:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}