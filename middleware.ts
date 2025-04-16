import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Configuración de next-intl
const intlMiddleware = createIntlMiddleware(routing)

// Rutas protegidas: cualquier cosa dentro de /en/, /es/, /pt/
const isProtectedRoute = createRouteMatcher([
  '/(en|es|pt)(/.*)?'  // Protege todas las rutas como /en, /en/home, etc.
])

// Middleware combinado
export default clerkMiddleware(async (auth, req) => {
  // Protege solo rutas internacionalizadas
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  // Siempre ejecuta el middleware de internacionalización
  return intlMiddleware(req)
})

// Matcher global para Clerk + next-intl
export const config = {
  matcher: [
    // Clerk internals y rutas protegidas
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',

    // next-intl
    '/',
    '/(en|es|pt)/:path*'
  ]
}


