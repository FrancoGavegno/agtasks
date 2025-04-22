import { NextResponse } from 'next/server';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

export async function POST(req: Request) {
    const body = await req.json();
    const { name, ktFormId, domainId } = body;

    const result = await client.models.DomainForm.create({
        name,
        ktFormId,
        domainId
    });

    return NextResponse.json(result);
}
