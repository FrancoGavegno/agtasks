import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/amplify/data/resource";

// Configura Amplify antes de generar el cliente
Amplify.configure(outputs);

export const client = generateClient<Schema>();