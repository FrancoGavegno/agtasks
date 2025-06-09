import { NextResponse } from "next/server"
import {
    jiraTaskQuerySchema
} from "@/lib/schemas"
import {
    listTasksbyService
} from "@/lib/integrations/jira"

export async function GET(req: Request, { params }: { params: { serviceId: string } }) {
    try {
        const { serviceId } = params;
        const parsed = jiraTaskQuerySchema.safeParse({ serviceId });
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", issues: parsed.error.format() },
                { status: 400 }
            );
        }
        const result = await listTasksbyService(serviceId, [
            "customfield_10371"
        ]);

        // const resultWithCustomFields = await listTasksbyService("PROJ-123", [
        //     "customfield_10010",
        //     "customfield_10020"
        // ]);
        // if (resultWithCustomFields.success) {
        //     console.log("Subtasks con custom fields:", resultWithCustomFields.data?.subtasks);
        // } else {
        //     console.error("Error:", resultWithCustomFields.error);
        // }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}