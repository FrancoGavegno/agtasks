"use client"

import React, { Suspense } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import ConditionalWrapper from "@/components/ConditionalWrapper";
import { Amplify } from "aws-amplify";
import { CookieStorage } from "aws-amplify/utils";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import outputs from "@/amplify_outputs.json";

// Configuración condicional por entorno
let amplifyConfig;

if (process.env.NODE_ENV === 'development') {
  console.log("=== Configurando Amplify para DESARROLLO (microservicio) ===");
  
  // En desarrollo: usar configuración mínima del microservicio de Auth
  amplifyConfig = {
    aws_project_region: "us-east-1",
    aws_user_pools_id: "us-east-1_NbQ1xLem2", // User Pool del microservicio
    aws_user_pools_web_client_id: "4qhuppim3cd75kt736hliti2il", // Client ID del microservicio
    aws_cognito_identity_pool_id: "us-east-1:26b40d12-ed93-4d59-842d-42c726179d81", // Identity Pool del microservicio
  };
} else {
  console.log("=== Configurando Amplify para PRODUCCIÓN (local + OAuth) ===");
  
  // En producción: usar configuración local + OAuth al microservicio
  amplifyConfig = {
    aws_project_region: outputs.data.aws_region,
    aws_user_pools_id: outputs.auth.user_pool_id,
    aws_user_pools_web_client_id: outputs.auth.user_pool_client_id,
    aws_cognito_identity_pool_id: outputs.auth.identity_pool_id,
    aws_appsync_graphqlEndpoint: outputs.data.url,
    aws_appsync_region: outputs.data.aws_region,
    aws_appsync_authenticationType: outputs.data.default_authorization_type,
    aws_appsync_apiKey: outputs.data.api_key,
    oauth: {
      domain: "auth586214cc-586214cc-dev.auth.us-east-1.amazoncognito.com",
      scope: ["email", "openid", "profile"],
      redirectSignIn: "https://testing-auth.geoagro.com/login",
      redirectSignOut: "https://testing-auth.geoagro.com/login",
      responseType: "code"
    }
  };
}

// Configurar Amplify (usar any para evitar errores de TypeScript con configuración legacy)
Amplify.configure(amplifyConfig as any);

// Create cookie storage for sharing cookies between subdomains (como Datasync)
const cookieStorage = new CookieStorage({
  domain: process.env.NEXT_PUBLIC_BASEURLAUTH?.includes("localhost")
    ? "localhost"
    : ".geoagro.com",
  path: "/",
  expires: 30,
  secure: process.env.NEXT_PUBLIC_BASEURLAUTH?.includes("localhost")
    ? false
    : true,
  sameSite: "lax",
});

// Solo usar CookieStorage en producción
if (process.env.NODE_ENV === 'production') {
  cognitoUserPoolsTokenProvider.setKeyValueStorage(cookieStorage);
}

interface RootProvidersProps {
  children: React.ReactNode;
}

export default function RootProviders({ children }: RootProvidersProps) {
  return (
    <Suspense>
      <Authenticator.Provider>
        <ConditionalWrapper
          condition={process.env.NODE_ENV === "development"}
          wrapper={(children) => (
            <Authenticator
              initialState="signIn"
              loginMechanisms={["email"]}
              signUpAttributes={["email"]}
            >
              {children}
            </Authenticator>
          )}
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ConditionalWrapper>
      </Authenticator.Provider>
    </Suspense>
  );
}
