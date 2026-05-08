import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { clearSessionCookie } from '@/lib/api-middleware';

export async function POST(req) {
  try {
    // Get session token from cookies
    const sessionToken = req.cookies.get('session_token')?.value;

    if (sessionToken) {
      const { db } = await connectToDatabase();
      
      // Delete session from database
      await db.collection('sessions').deleteOne({ token: sessionToken });
    }

    // Clear session cookie
    const response = NextResponse.json(
      { success: true, message: 'Logout successful' },
      { status: 200 }
    );

    return clearSessionCookie(response);
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear cookie even if DB operation fails
    const response = NextResponse.json(
      { success: false, message: 'Logout encountered an error' },
      { status: 500 }
    );
    
    return clearSessionCookie(response);
  }
}
