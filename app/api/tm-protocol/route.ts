import { NextResponse } from "next/server";
import { listTaskManagerProtocols } from "@/lib/integrations/jira";
import { taskManagerProtocolQuerySchema } from "@/lib/schemas";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get("projectId");
        const queueId = searchParams.get("queueId")

        const parsed = taskManagerProtocolQuerySchema.safeParse({ projectId, queueId });

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }

        const result = await listTaskManagerProtocols(parsed.data.projectId, parsed.data.queueId);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching domain protocol:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}