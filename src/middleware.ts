// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import { i18nRouter } from 'next-i18n-router';
import i18nConfig from '../i18nConfig';
import { NextRequest } from 'next/server';

// Xử lý i18n sau
export function middleware(request: NextRequest) {
  return i18nRouter(request, i18nConfig);
}

// Áp dụng middleware cho cả dashboard và i18n routing
export const config = {
  matcher: [
    '/((?!api|static|.*\\..*|_next).*)' // Middleware i18n áp dụng cho toàn bộ ứng dụng
  ]
};
