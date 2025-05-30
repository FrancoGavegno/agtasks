import { NextResponse } from "next/server"

import {
    createService
} from "@/lib/integrations/jira"

export async function POST(req: Request, { params }: { params: { domainId: string, projectId: string } }) {
    try {
        const { domainId, projectId } = params;
        const data = await req.json();

        // Aquí podrías validar los datos recibidos si es necesario

        const result = await createService({
            ...data,
            domainId,
            projectId
        });

        if (result.success) {
            return NextResponse.json(result, { status: 201 });
        } else {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }
    } catch (error) {
        console.error("Error creating service:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}