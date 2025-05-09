import { NextResponse } from "next/server";
import { 
    deleteDomainForm 
} from "@/lib/services/agtasks";
import { 
    deleteDomainFormSchema 
} from "@/lib/schemas";

export async function DELETE(req: Request, { params }: { params: { domainId: string, formId: string } }) {
    try {
        const { domainId, formId } = params;
        const parsed = deleteDomainFormSchema.safeParse({ domainId, formId });
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }
        const result = await deleteDomainForm(parsed.data.domainId, parsed.data.formId);
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