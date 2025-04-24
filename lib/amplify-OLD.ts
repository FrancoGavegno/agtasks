// import { Amplify } from "aws-amplify"
// import outputs from "@/amplify_outputs.json"
// import { generateClient } from "aws-amplify/api"
// import type { Schema } from "@/amplify/data/resource"

// Amplify.configure(outputs)
// export const client = generateClient<Schema>()


import { Amplify } from "aws-amplify"
import outputs from "@/amplify_outputs.json"
import { generateClient } from "aws-amplify/api"
import type { Schema } from "@/amplify/data/resource"

let clientInstance: ReturnType<typeof generateClient<Schema>> | null = null
let configured = false

export function getClient() {
  if (!configured) {
    Amplify.configure(outputs)
    configured = true
  }

  if (!clientInstance) {
    clientInstance = generateClient<Schema>()
  }

  return clientInstance
}
