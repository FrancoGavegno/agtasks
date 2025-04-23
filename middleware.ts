// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
// import createIntlMiddleware from 'next-intl/middleware'
// import { routing } from './i18n/routing'

// // Configuración de next-intl
// const intlMiddleware = createIntlMiddleware(routing)

// // Rutas protegidas: cualquier cosa dentro de /en/, /es/, /pt/
// const isProtectedRoute = createRouteMatcher([
//   '/(en|es|pt)(/.*)?'  // Protege todas las rutas como /en, /en/home, etc.
// ])

// // Middleware combinado
// export default clerkMiddleware(async (auth, req) => {
//   // Protege solo rutas internacionalizadas
//   if (isProtectedRoute(req)) {
//     await auth.protect()
//   }

//   // Siempre ejecuta el middleware de internacionalización
//   return intlMiddleware(req)
// })

// // Matcher global para Clerk + next-intl
// export const config = {
//   matcher: [
//     // Clerk internals y rutas protegidas
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     '/(api|trpc)(.*)',

//     // next-intl
//     '/',
//     '/(en|es|pt)/:path*'
//   ]
// }

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'

const intlMiddleware = createIntlMiddleware(routing)

// Rutas protegidas: solo las internacionalizadas
const isProtectedRoute = createRouteMatcher([
  '/(en|es|pt)(/.*)?'
])

// Middleware combinado
export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl

  // Excluir API routes del intlMiddleware
  if (pathname.startsWith('/api') || pathname.startsWith('/trpc')) {
    return NextResponse.next()
  }

  // Protege rutas internacionalizadas
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  // Ejecuta el middleware de internacionalización si corresponde
  return intlMiddleware(req)
})

// Solo aplicar middleware a rutas relevantes (excluye /api)
export const config = {
  matcher: [
    // Rutas de frontend internacionalizadas
    '/',
    '/(en|es|pt)/:path*',
  ]
}


