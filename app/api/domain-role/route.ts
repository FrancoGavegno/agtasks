import { NextResponse } from "next/server";
import { createDomainRole, listDomainRoles, deleteDomainRole } from "@/lib/services/agtasks";
import { domainRoleSchema, domainRoleQuerySchema, deleteDomainRoleSchema } from "@/lib/schemas";

export async function POST(req: Request) {
    try {
        const json = await req.json();

        const parsed = domainRoleSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }

        const result = await createDomainRole(parsed.data);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error creating domain Role:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const domainId = searchParams.get("domainId");

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

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const roleId = searchParams.get("roleId"); 

        const parsed = deleteDomainRoleSchema.safeParse({ roleId });
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }

        const result = await deleteDomainRole(parsed.data.roleId);
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