import { NextResponse } from 'next/server';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

export async function POST(req: Request) {
    const body = await req.json();
    const { name } = body;

    // Verifica si ya existe un Domain con ese nombre
    const existing = await client.models.Domain.list({
        filter: { name: { eq: name } },
    });

    if (existing.data.length > 0) {
        return NextResponse.json(existing.data[0]);
    }

    const newDomain = await client.models.Domain.create({ name });
    return NextResponse.json(newDomain);
}
