import createMiddleware from 'next-intl/middleware';
import { locales } from './utils/navigation';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  defaultLocale: (process.env.NEXT_PUBLIC_LOCALE_DEFAULT as never) ?? 'en',
  localeDetection: false,
  localePrefix: 'as-needed'
  // pathnames: {
  //   '/': '/',
  //   '/page': '/'
  // } satisfies Pathnames<typeof locales>
});

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
