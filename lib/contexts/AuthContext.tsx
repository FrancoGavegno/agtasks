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
    console.log("AuthProvider mounted");
    checkAuthStatus();
  }, []);

  useEffect(() => {
    console.log("Setting up auth listener");
    const authListener = Hub.listen("auth", listener);
    return () => {
      console.log("Cleaning up auth listener");
      authListener();
    };
  }, []);

  const listener = ({ payload }: { payload: any }) => {
    console.log("Auth event received:", payload.event, payload);
    switch (payload.event) {
      case "signedIn":
        console.log("User signed in, checking auth status...");
        // En desarrollo, dar más tiempo para que la sesión se establezca
        setTimeout(() => checkAuthStatus(), 2000);
        break;
      case "signedOut":
        console.log("User signed out");
        setUser(null);
        setAuthStatus("unauthenticated");
        break;
      case "tokenRefresh":
        console.log("Token refreshed");
        checkAuthStatus();
        break;
      default:
        console.log("Unhandled auth event:", payload.event);
        break;
    }
  };

  const checkAuthStatus = async () => {
    try {
      console.log("=== Checking auth status ===");
      
      // Primero verificar si hay una sesión válida
      const session = await fetchAuthSession();
      console.log("Session result:", session);
      console.log("Session tokens:", session.tokens);
      
      if (session.tokens && session.tokens.idToken) {
        console.log("Valid session found, fetching user attributes...");
        
        // Si hay tokens válidos, obtener los atributos del usuario
        const userAttributes = await fetchUserAttributes();
        console.log("User attributes:", userAttributes);
        
        setUser({
          userId: userAttributes.sub || '123',
          userName: userAttributes.sub || 'User',
          attributes: userAttributes,
        });
        setAuthStatus("authenticated");
        
        // Establecer cookie user-email para compatibilidad
        if (userAttributes.email) {
          document.cookie = `user-email=${userAttributes.email}; path=/; domain=.geoagro.com; secure; samesite=lax`;
          console.log("Set user-email cookie:", userAttributes.email);
        }
      } else {
        console.log("No valid session found - no tokens");
        setUser(null);
        setAuthStatus("unauthenticated");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      console.error("Error details:", {
        name: (error as any).name,
        message: (error as any).message,
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
      console.error("Error fetching token:", error);
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

  console.log("AuthContext state:", { user, authStatus, hasCheckedAuth });

  // En desarrollo, no mostrar pantallas de carga, dejar que el Authenticator maneje todo
  if (process.env.NODE_ENV === 'development') {
    return (
      <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
    );
  }

  // Solo redirigir en producción
  if (hasCheckedAuth && authStatus === "unauthenticated" && process.env.NODE_ENV === "production") {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      const authUrl = `${process.env.NEXT_PUBLIC_BASEURLAUTH}/login?returnUrl=${encodeURIComponent(currentUrl)}`;
      
      // Evitar redirección múltiple
      if (!window.location.href.includes('testing-auth.geoagro.com')) {
        window.location.replace(authUrl);
      }
    }

    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  if (!hasCheckedAuth || authStatus === "configuring") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
