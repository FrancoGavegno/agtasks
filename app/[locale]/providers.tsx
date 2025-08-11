"use client"

import React, { Suspense } from "react";
import { Amplify } from "aws-amplify";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import outputs from "@/amplify_outputs.json";

// Configurar SOLO datos del proyecto actual (Gen2)
console.log("Configurando datos del proyecto (Gen2)...");

const dataConfig = {
  aws_project_region: outputs.data.aws_region,
  aws_appsync_graphqlEndpoint: outputs.data.url,
  aws_appsync_region: outputs.data.aws_region,
  aws_appsync_authenticationType: outputs.data.default_authorization_type,
  aws_appsync_apiKey: outputs.data.api_key,
};

console.log("Configuración de datos:", dataConfig);
Amplify.configure(dataConfig);

interface RootProvidersProps {
  children: React.ReactNode;
}

export default function RootProviders({ children }: RootProvidersProps) {
  return (
    <Suspense>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Suspense>
  );
}
