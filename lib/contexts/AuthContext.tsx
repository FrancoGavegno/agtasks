"use client"

import React, { useEffect, useContext, useState, useMemo } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
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
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("=== Setting up auth listener for development ===");
      const authListener = Hub.listen("auth", listener);
      return () => {
        console.log("=== Cleaning up auth listener ===");
        authListener();
      };
    }
  }, []);

  const listener = ({ payload }: { payload: any }) => {
    console.log("=== Auth event received ===", {
      event: payload.event,
      data: payload.data,
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
        console.log("=== Unhandled auth event ===", payload.event, payload);
        break;
    }
  };

  const checkAuthStatus = async () => {
    try {
      console.log("=== Checking auth status ===");
      
      if (process.env.NODE_ENV === 'development') {
        // En desarrollo, usar verificación simple de cookies
        console.log("=== Development mode: checking cookies ===");
        const cookies = document.cookie.split(';');
        const userEmailCookie = cookies.find(cookie => cookie.trim().startsWith('user-email='));
        
        if (userEmailCookie) {
          const userEmail = decodeURIComponent(userEmailCookie.split('=')[1]);
          console.log("=== Found user email from cookie ===", userEmail);
          
          setUser({
            userId: 'dev-user',
            userName: userEmail,
            attributes: { email: userEmail },
          });
          setAuthStatus("authenticated");
        } else {
          console.log("=== No user session found ===");
          setUser(null);
          setAuthStatus("unauthenticated");
        }
      } else {
        // En producción, verificar cookies del microservicio
        console.log("=== Production mode: checking microservice cookies ===");
        const cookies = document.cookie.split(';');
        const userEmailCookie = cookies.find(cookie => cookie.trim().startsWith('user-email='));
        
        if (userEmailCookie) {
          const userEmail = decodeURIComponent(userEmailCookie.split('=')[1]);
          console.log("=== Found user email from cookie ===", userEmail);
          
          setUser({
            userId: 'microservice-user',
            userName: userEmail,
            attributes: { email: userEmail },
          });
          setAuthStatus("authenticated");
        } else {
          console.log("=== No user session found, redirecting to microservice ===");
          setUser(null);
          setAuthStatus("unauthenticated");
          
          // Redirigir al microservicio de Auth
          if (typeof window !== 'undefined') {
            const currentUrl = window.location.href;
            const authUrl = `${process.env.NEXT_PUBLIC_BASEURLAUTH}/login?returnUrl=${encodeURIComponent(currentUrl)}`;
            
            console.log("=== Redirecting to ===", authUrl);
            window.location.href = authUrl;
          }
        }
      }
    } catch (error) {
      console.error("=== Error checking auth status ===", error);
      setUser(null);
      setAuthStatus("unauthenticated");
    } finally {
      setHasCheckedAuth(true);
      console.log("=== Auth status check completed ===");
    }
  };

  const fetchToken = async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // En desarrollo, no usar tokens de Amplify
        console.log("=== Development mode: no token handling ===");
        return null;
      } else {
        console.log("=== Token handling delegated to microservice ===");
        return null;
      }
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

  // Siempre proporcionar el contexto
  const contextProvider = (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );

  // En desarrollo, mostrar el Authenticator cuando no está autenticado
  if (process.env.NODE_ENV === 'development') {
    if (!hasCheckedAuth || authStatus === "configuring") {
      return (
        <AuthContext.Provider value={contextData}>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando...</p>
            </div>
          </div>
        </AuthContext.Provider>
      );
    }

    if (authStatus === "unauthenticated") {
      return (
        <AuthContext.Provider value={contextData}>
          <Authenticator
            initialState="signIn"
            loginMechanisms={["email"]}
            signUpAttributes={["email"]}
          >
            {children}
          </Authenticator>
        </AuthContext.Provider>
      );
    }
  }

  // En producción, mostrar pantalla de carga mientras se verifica la autenticación
  if (!hasCheckedAuth || authStatus === "configuring") {
    return (
      <AuthContext.Provider value={contextData}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verificando autenticación...</p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  // Si no está autenticado, mostrar pantalla de redirección
  if (authStatus === "unauthenticated") {
    return (
      <AuthContext.Provider value={contextData}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Redirigiendo al login...</p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  return contextProvider;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
