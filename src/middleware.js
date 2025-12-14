export const runtime = 'nodejs'; 

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * Middleware that runs before every request
 * Handles authentication checks and route protection
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // console.log('=== MIDDLEWARE START ===');
  console.log('Path:', pathname);
  
  // Get your custom JWT token from cookies or Authorization header
  let token = null;
  let decoded = null;
  
  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }
  
  // If not in header, try cookies
  if (!token) {
    token = request.cookies.get('token')?.value;
  }
  
  // console.log('Token found:', !!token);
  
  // Decode and verify token
  if (token) {
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log('Decoded user:', decoded.email, 'Role:', decoded.role);
    } catch (error) {
      // console.log('Token verification failed:', error.message);
      decoded = null;
    }
  }
  
  // Define protected routes that require authentication
  const protectedRoutes = [
    '/profile',
    '/favorites',
    '/user',
  ];

  // Define admin-only routes
  const adminRoutes = [
    '/admin',
  ];

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );

  // console.log('Is protected route:', isProtectedRoute);
  // console.log('Is admin route:', isAdminRoute);

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !decoded) {
    // console.log('REDIRECT: Protected route without auth sends to /login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin access
  if (isAdminRoute) {
    if (!decoded) {
      // console.log('REDIRECT: Admin route without auth sends to /login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Check if user has ADMIN role
    if (decoded.role !== 'ADMIN') {
      // console.log('REDIRECT: Not admin sends to /');
      // console.log('User role is:', decoded.role);
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // console.log('ACCESS GRANTED: Admin access OK');
  }

  // Redirect logged-in users away from auth pages
  if (decoded && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Allow the request to continue
  return NextResponse.next();
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};