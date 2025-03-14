import { NextResponse } from 'next/server';
import { createMiddleware } from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en'], // Add other locales as needed
  defaultLocale: 'en',
});

export function middleware(request) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};