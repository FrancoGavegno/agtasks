"use client"

import React, { Suspense } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import ConditionalWrapper from "@/components/ConditionalWrapper";
import { Amplify } from "aws-amplify";
import amplifyconfig from "@/lib/amplifyconfiguration.json";
import { CookieStorage } from "aws-amplify/utils";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { AuthProvider } from "@/lib/contexts/AuthContext";

// Configurar Amplify para desarrollo
if (process.env.NODE_ENV === 'development') {
  console.log("Configurando Amplify para desarrollo...");
  
  // Usar configuración legacy para desarrollo
  const devConfig = {
    aws_project_region: amplifyconfig.aws_project_region,
    aws_cognito_region: amplifyconfig.aws_cognito_region,
    aws_user_pools_id: amplifyconfig.aws_user_pools_id,
    aws_user_pools_web_client_id: amplifyconfig.aws_user_pools_web_client_id,
    aws_cognito_identity_pool_id: amplifyconfig.aws_cognito_identity_pool_id,
    aws_appsync_graphqlEndpoint: amplifyconfig.aws_appsync_graphqlEndpoint,
    aws_appsync_region: amplifyconfig.aws_appsync_region,
    aws_appsync_authenticationType: amplifyconfig.aws_appsync_authenticationType,
    aws_appsync_apiKey: amplifyconfig.aws_appsync_apiKey,
  };
  
  console.log("Configuración de desarrollo:", devConfig);
  Amplify.configure(devConfig);
} else {
  console.log("Configurando Amplify para producción...");
  // En producción, usar la configuración completa con OAuth
  const prodConfig = {
    ...amplifyconfig,
    oauth: {
      domain: "testing-oauth.geoagro.com",
      scope: ["email", "openid", "profile"],
      redirectSignIn: "https://testing-auth.geoagro.com/login",
      redirectSignOut: "https://testing-auth.geoagro.com/login",
      responseType: "code"
    }
  };
  Amplify.configure(prodConfig);
}

// Crear cookie storage para compartir cookies entre subdominios
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

cognitoUserPoolsTokenProvider.setKeyValueStorage(cookieStorage);

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
