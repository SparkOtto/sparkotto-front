// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const protectedRoutes: { [key: string]: string[] } = {
        '/dashboard': ['user', 'admin'],
        '/admin/user': ['user', 'admin'],
    };

    const isProtectedRoute = Object.keys(protectedRoutes).some((route) => pathname.startsWith(route));

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

    // Si l'utilisateur est connecté et essaie d'accéder à la page de connexion, redirigez-le vers le tableau de bord
    if (pathname === '/' && authToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    

    if (isProtectedRoute) {
        if (!authToken) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        
        if (!userRole || !protectedRoutes[pathname].includes(userRole)) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Optionally, you can also check if the user has the required role for the route

    }

    return NextResponse.next();
}

// Apply middleware only to specific routes
export const config = {
    matcher: [
        '/', 
        '/dashboard',
        '/admin/user'
    ], 
};