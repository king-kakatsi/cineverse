import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    console.log("Logout requested");
    
    // Create response
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
    
    // Delete cookie in the response
    response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: -60 * 60 * 24 * 7, // -7 days
    path: '/',
    });
    return response;
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to log user out' },
      { status: 500 }
    );
  }
}