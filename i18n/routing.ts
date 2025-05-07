import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  locales: ['en', 'es', 'pt'], // A list of all locales that are supported
  defaultLocale: 'en', // Used when no locale matches
  localePrefix: 'always', // O 'as-needed' si no quieres el prefijo en el idioma por defecto
});
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);
