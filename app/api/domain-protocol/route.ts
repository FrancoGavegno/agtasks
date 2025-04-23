import { NextResponse } from 'next/server';
// import { generateClient } from 'aws-amplify/data';
// import { type Schema } from '@/amplify/data/resource';
// const client = generateClient<Schema>();

import { getClient } from "@/lib/amplify"

export async function POST(req: Request) {
    const client = getClient()
    
    const body = await req.json();
    const { name, language, tmProtocolId, domainId } = body;

    const result = await client.models.DomainProtocol.create({
        name,
        language,
        tmProtocolId,
        domainId
    });

    return NextResponse.json(result);
}
