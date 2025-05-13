import { NextResponse } from "next/server";
import { jiraServiceQuerySchema } from "@/lib/schemas";
import { listServicesByProject } from "@/lib/integrations/jira";

export async function GET(req: Request, { params }: { 
    params: { domainId: string, projectId: string, queueId: string } 
}) {
    try {
        const { domainId, projectId, queueId } = params;
        const parsed = jiraServiceQuerySchema.safeParse({ domainId, projectId, queueId });
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }
        const result = await listServicesByProject(parsed.data.domainId, parsed.data.projectId, parsed.data.queueId);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching domain protocol:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}