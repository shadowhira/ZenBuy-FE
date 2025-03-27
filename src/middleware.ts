// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import { i18nRouter } from 'next-i18n-router';
import i18nConfig from '../i18nConfig';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Xử lý xác thực cho API routes
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  
  if (isApiRoute) {
    // Kiểm tra token trong header
    const token = request.headers.get("Authorization")?.split(" ")[1];
    
    // Danh sách các API cần xác thực
    const protectedRoutes = [
      "/api/cart",
      "/api/orders",
      "/api/analytics",
      "/api/inventory",
    ];

    // Kiểm tra nếu là protected route
    if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
      if (!token) {
        return NextResponse.json(
          { error: "Không có quyền truy cập" },
          { status: 401 }
        );
      }
    }
  }

  // Xử lý i18n cho các routes khác
  return i18nRouter(request, i18nConfig);
}

// Áp dụng middleware cho cả API routes và i18n routing
export const config = {
  matcher: [
    // API routes cần xác thực
    "/api/cart/:path*",
    "/api/orders/:path*",
    "/api/analytics/:path*",
    "/api/inventory/:path*",
    // i18n routes
    '/((?!api|static|.*\\..*|_next).*)'
  ]
};
