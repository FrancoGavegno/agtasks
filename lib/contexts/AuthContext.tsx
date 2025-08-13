"use client"

import React, { useEffect, useContext, useState, useMemo } from "react";
import { fetchUserAttributes, fetchAuthSession } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

interface User {
  userId: string;
  userName: string;
  attributes: any;
}

interface AuthContextType {
  user: User | null;
  authStatus: 'configuring' | 'authenticated' | 'unauthenticated';
  fetchToken: () => Promise<string | null>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<'configuring' | 'authenticated' | 'unauthenticated'>('configuring');
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    console.log("=== AuthProvider mounted ===");
    console.log("=== Environment ===", process.env.NODE_ENV);
    console.log("=== Configuration mode ===", process.env.NODE_ENV === 'development' ? 'MICROSERVICE (us-east-1)' : 'LOCAL + OAUTH (us-west-2)');
    
    checkAuthStatus();
    
    // Configurar listener de eventos de autenticación
    const authListener = Hub.listen("auth", ({ payload }) => {
      console.log("=== Auth event received ===", {
        event: payload.event,
        message: payload.message
      });
      
      switch (payload.event) {
        case "signedIn":
          console.log("=== User signed in, checking auth status... ===");
          setTimeout(() => checkAuthStatus(), 2000);
          break;
        case "signedOut":
          console.log("=== User signed out ===");
          setUser(null);
          setAuthStatus("unauthenticated");
          break;
        case "tokenRefresh":
          console.log("=== Token refreshed ===");
          checkAuthStatus();
          break;
        default:
          console.log("=== Unhandled auth event ===", payload.event);
          break;
      }
    });
    
    return () => {
      console.log("=== Cleaning up auth listener ===");
      authListener();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log("=== Checking auth status ===");
      console.log("=== Current Amplify config ===", (globalThis as any).__AMPLIFY_CONFIG__);
      
      // Verificar sesión de Cognito
      const session = await fetchAuthSession();
      console.log("=== Session result ===", session);
      console.log("=== Session tokens ===", session.tokens);
      console.log("=== Session userSub ===", session.tokens?.accessToken?.payload?.sub);
      
      if (session.tokens && session.tokens.idToken) {
        console.log("=== Valid session found, fetching user attributes... ===");
        
        // Obtener atributos del usuario
        const userAttributes = await fetchUserAttributes();
        console.log("=== User attributes ===", userAttributes);
        
        setUser({
          userId: userAttributes.sub || 'unknown',
          userName: userAttributes.email || userAttributes.sub || 'User',
          attributes: userAttributes,
        });
        setAuthStatus("authenticated");
        
        // Establecer cookie user-email para compatibilidad con AgTasks
        if (userAttributes.email) {
          const domain = process.env.NODE_ENV === 'development' ? 'localhost' : '.geoagro.com';
          const secure = process.env.NODE_ENV === 'production';
          
          document.cookie = `user-email=${userAttributes.email}; path=/; domain=${domain}; ${secure ? 'secure; ' : ''}samesite=lax`;
          console.log("=== Set user-email cookie ===", userAttributes.email);
        }
      } else {
        console.log("=== No valid session found ===");
        console.log("=== Session details ===", {
          hasTokens: !!session.tokens,
          hasIdToken: !!session.tokens?.idToken,
          hasAccessToken: !!session.tokens?.accessToken
        });
        setUser(null);
        setAuthStatus("unauthenticated");
      }
    } catch (error) {
      console.error("=== Error checking auth status ===", error);
      console.error("=== Error details ===", {
        name: (error as any).name,
        message: (error as any).message,
        code: (error as any).code,
        stack: (error as any).stack
      });
      setUser(null);
      setAuthStatus("unauthenticated");
    } finally {
      setHasCheckedAuth(true);
      console.log("=== Auth status check completed ===");
    }
  };

  const fetchToken = async () => {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString?.() || null;
      return idToken;
    } catch (error) {
      console.error("=== Error fetching token ===", error);
      return null;
    }
  };

  const contextData = useMemo(
    () => ({
      user,
      authStatus,
      fetchToken,
    }),
    [user, authStatus]
  );

  console.log("=== AuthContext state ===", { 
    user: user ? { userId: user.userId, email: user.attributes?.email } : null, 
    authStatus, 
    hasCheckedAuth
  });

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (!hasCheckedAuth || authStatus === "configuring") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si está autenticado, mostrar la aplicación
  if (authStatus === "authenticated") {
    return (
      <AuthContext.Provider value={contextData}>
        {children}
      </AuthContext.Provider>
    );
  }

  // Si no está autenticado, el ConditionalWrapper en providers.tsx manejará el Authenticator
  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
