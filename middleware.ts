// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const protectedRoutes: { [key: string]: string[] } = {
        '/dashboard': ['user', 'admin'],
        '/reservation': ['user', 'admin'],
        '/profile': ['user', 'admin'],
        '/admin': ['admin'],
    };

    const isProtectedRoute = Object.keys(protectedRoutes).some((route) => pathname === route || pathname.startsWith(route + '/'));

    const authToken = request.cookies.get('token');
    let userRole = null;

    const userCookie = request.cookies.get('user');
    if (userCookie) {
        const userValue = typeof userCookie === 'object' && userCookie.value ? userCookie.value : userCookie;
        try {
            userRole = JSON.parse(String(userValue)).role.role_name;
        } catch (e) {
            userRole = null;
        }
    }

    if (pathname === '/' && authToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    

    if (isProtectedRoute) {
        if (!authToken) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        
        const matchedRoute = Object.keys(protectedRoutes).find(route => 
            pathname === route || pathname.startsWith(route + '/')
        );
        
        if (matchedRoute && (!userRole || !protectedRoutes[matchedRoute].includes(userRole))) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        
    }

    return NextResponse.next();
}

// Apply middleware only to specific routes
export const config = {
    matcher: [
        '/', 
        '/dashboard/:path*',
        '/reservation/:path*',
        '/profile/:path*',
        '/admin/:path*',
    ], 
};
