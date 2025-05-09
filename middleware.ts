import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import { Clerk } from '@clerk/clerk-sdk-node';

const intlMiddleware = createIntlMiddleware(routing);

// Rutas protegidas: solo las internacionalizadas
const isProtectedRoute = createRouteMatcher(['/(en|es|pt)(/.*)?']);

// Habilitar logs solo en desarrollo
const isDebug = process.env.NODE_ENV === 'development';

// Middleware combinado
export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  //if (isDebug) console.log('Middleware - Executing for route:', pathname);

  // Excluir API routes del intlMiddleware
  if (pathname.startsWith('/api') || pathname.startsWith('/trpc')) {
    // if (isDebug) console.log('Middleware - Skipping for API route');
    return NextResponse.next();
  }

  // Proteger rutas internacionalizadas y preparar el email del usuario
  let userEmail: string | null = null;
  if (isProtectedRoute(req)) {
    await auth.protect();
    const { userId } = await auth();
    // if (isDebug) {
    //   console.log('Middleware - Route:', pathname, 'Is Protected:', isProtectedRoute(req));
    //   console.log('Middleware - User ID:', userId);
    // }

    if (userId) {
      try {
        const clerkClient = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
        const user = await clerkClient.users.getUser(userId);
        userEmail = user?.emailAddresses[0]?.emailAddress;
        // if (isDebug) console.log('Middleware - User Email:', userEmail);

        // if (!userEmail) {
        //   if (isDebug) console.log('Middleware - No email found for user');
        // }
      } catch (error) {
        if (isDebug) console.error('Middleware - Error fetching user from Clerk:', error);
      }
    } else {
      if (isDebug) console.log('Middleware - No user ID, user not authenticated');
    }
  }

  // Ejecutar el middleware de internacionalización
  const intlResponse = await intlMiddleware(req);

  // Log para depurar el idioma detectado por next-intl
  // if (isDebug) {
  //   const detectedLocale = req.nextUrl.pathname.split('/')[1]; // Extraer el idioma de la URL (por ejemplo, "es" de "/es/...")
  //   console.log('Middleware - Detected Locale from URL:', detectedLocale);
  //   console.log('Middleware - Intl Response Headers:', Object.fromEntries(intlResponse.headers.entries()));
  // }

  // Crear una nueva respuesta basada en intlResponse
  const finalResponse = NextResponse.next({
    request: req,
    headers: intlResponse.headers,
  });

  // Establecer el email como cookie si existe
  if (userEmail) {
    finalResponse.cookies.set('user-email', userEmail, { path: '/', httpOnly: false });
    //if (isDebug) console.log('Middleware - Cookie Set: user-email =', userEmail);
  }

  // Copiar las cookies y el status de intlResponse
  intlResponse.cookies.getAll().forEach((cookie) => {
    finalResponse.cookies.set(cookie.name, cookie.value);
  });

  // Manejar status y redirecciones
  if (intlResponse.status && intlResponse.status !== 200) {
    const rewriteResponse = NextResponse.rewrite(req.nextUrl, { status: intlResponse.status });
    if (userEmail) {
      rewriteResponse.cookies.set('user-email', userEmail, { path: '/', httpOnly: false });
      //if (isDebug) console.log('Middleware - Cookie Set on Rewrite Response: user-email =', userEmail);
    }
    return rewriteResponse;
  }

  if (intlResponse.headers.get('location')) {
    const redirectResponse = NextResponse.redirect(intlResponse.headers.get('location')!, {
      status: intlResponse.status,
    });
    if (userEmail) {
      redirectResponse.cookies.set('user-email', userEmail, { path: '/', httpOnly: false });
      //if (isDebug) console.log('Middleware - Cookie Set on Redirect Response: user-email =', userEmail);
    }
    return redirectResponse;
  }

  return finalResponse;
});

// Configuración del middleware
export const config = {
  matcher: ['/', '/(en|es|pt)/:path*'],
};