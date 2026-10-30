import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { generateSessionToken } from '@/lib/auth-utils';
import { setSessionCookie } from '@/lib/api-middleware';

export async function POST(req) {
  try {
    const sessionToken = req.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: 'No session to refresh' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();

    // Find existing session
    const oldSession = await db.collection('sessions').findOne({
      token: sessionToken,
      expiresAt: { $gt: new Date() },
    });

    if (!oldSession) {
      return NextResponse.json(
        { success: false, message: 'Session expired or invalid' },
        { status: 401 }
      );
    }

    // Create new session
    const newSessionToken = generateSessionToken();
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.collection('sessions').deleteOne({ _id: oldSession._id });
    
    await db.collection('sessions').insertOne({
      user_id: oldSession.user_id,
      token: newSessionToken,
      expiresAt: newExpiresAt,
      created_at: new Date(),
    });

    const response = NextResponse.json(
      { success: true, message: 'Session refreshed' },
      { status: 200 }
    );

    return setSessionCookie(response, newSessionToken);
  } catch (error) {
    console.error('Refresh session error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
