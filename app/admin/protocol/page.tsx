import { client } from "@/lib/amplify-client"
import { DomainProtocolsClient } from "./protocols-client"
import { serializeModelData } from "@/lib/serialization-utils"

export default async function DomainProtocolsPage() {
  const { data: domainProtocols } = await client.models.DomainProtocol.list()

  // Serialize the data to remove function properties
  const serializedDomainProtocols = domainProtocols?.map((protocol) => serializeModelData(protocol)) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Protocols</h1>
        <p className="text-muted-foreground">Manage domain protocols with TM protocol mappings.</p>
      </div>
      <DomainProtocolsClient domainProtocols={serializedDomainProtocols} />
    </div>
  )
}
