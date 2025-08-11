import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware(routing);

// Habilitar logs solo en desarrollo
// const isDebug = process.env.NODE_ENV === 'development';

// Middleware simplificado - solo i18n
export default async function middleware(req: any) {
  const { pathname } = req.nextUrl;

  //if (isDebug) console.log('Middleware - Executing for route:', pathname);

  // Excluir API routes del intlMiddleware
  if (pathname.startsWith('/api') || pathname.startsWith('/trpc')) {
    // if (isDebug) console.log('Middleware - Skipping for API route');
    return NextResponse.next();
  }

  // Ejecutar el middleware de internacionalización
  const intlResponse = await intlMiddleware(req);

  // Crear una nueva respuesta basada en intlResponse
  const finalResponse = NextResponse.next({
    request: req,
    headers: intlResponse.headers,
  });

  // Copiar las cookies y el status de intlResponse
  intlResponse.cookies.getAll().forEach((cookie) => {
    finalResponse.cookies.set(cookie.name, cookie.value);
  });

  // Manejar status y redirecciones
  if (intlResponse.status && intlResponse.status !== 200) {
    return NextResponse.rewrite(req.nextUrl, { status: intlResponse.status });
  }

  if (intlResponse.headers.get('location')) {
    return NextResponse.redirect(intlResponse.headers.get('location')!, {
      status: intlResponse.status,
    });
  }

  return finalResponse;
}

// Configuración del middleware
export const config = {
  matcher: ['/', '/(en|es|pt)/:path*'],
};