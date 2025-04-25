import { NextResponse } from 'next/server';
// import { generateClient } from 'aws-amplify/data';
// import { type Schema } from '@/amplify/data/resource';
// const client = generateClient<Schema>();

// import { getClient } from "@/lib/amplify"

export async function GET() {
    return NextResponse.json({
        message: 'Se completó la creación de protocolos',
    });
} 
// export async function POST() {
//     const client = getClient()
//     const domainName = 'Agrotecnología';

//     // 1. Buscar o crear Domain
//     const domainRes = await client.models.Domain.list({
//         filter: { name: { eq: domainName } },
//     });

//     const domain =
//         domainRes.data.length > 0
//             ? domainRes.data[0]
//             : (await client.models.Domain.create({ name: domainName })).data;

//     // 2. Crear 6 protocolos si no existen (basado en tmProtocolId únicos)
//     const protocolsToSeed = [
//         { tmProtocolId: 'TEM-1', name: 'Monitoreo satelital y control de malezas', language: 'ES' },
//         { tmProtocolId: 'TEM-2', name: 'Protocolo Siembra y/o Fertilización Variable', language: 'ES' },
//         { tmProtocolId: 'TEM-24', name: 'Variable rate recommendations & applications', language: 'EN' },
//         { tmProtocolId: 'TEM-25', name: 'Weed Control', language: 'EN' },
//         { tmProtocolId: 'TEM-43', name: 'Digitalização de Estabelecimentos e Lotes', language: 'PT' },
//         { tmProtocolId: 'TEM-44', name: 'Monitoramento Satelital', language: 'PT' },
//     ];

//     const createdProtocols = [];

//     for (const proto of protocolsToSeed) {
//         if (!domain) {
//             throw new Error('Domain is null or undefined');
//         }
//         const existing = await client.models.DomainProtocol.list({
//             filter: {
//                 tmProtocolId: { eq: proto.tmProtocolId },
//                 domainId: { eq: domain.id },
//             },
//         });

//         if (existing.data.length === 0) {
//             const created = await client.models.DomainProtocol.create({
//                 ...proto,
//                 domainId: domain.id,
//             });
//             createdProtocols.push(created.data);
//         } else {
//             createdProtocols.push(existing.data[0]);
//         }
//     }

//     return NextResponse.json({
//         message: 'Se completó la creación de protocolos',
//         domain,
//         createdProtocols,
//     });
// }
