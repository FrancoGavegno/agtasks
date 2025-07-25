import { apiClient} from "@/lib/integrations/amplify"
import type { Schema } from "@/amplify/data/resource"
type DomainProtocol = Schema["DomainProtocol"]["type"]
import { DomainProtocolsClient } from "./protocols-client"

export default async function DomainProtocolsPage() {
  const { items: domainProtocols } = await apiClient.listDomainProtocols()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Protocols</h1>
        <p className="text-muted-foreground">Manage domain protocols with TM protocol mappings.</p>
      </div>
      <DomainProtocolsClient domainProtocols={domainProtocols as DomainProtocol[]} />
    </div>
  )
}
