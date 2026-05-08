import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyPassword, generateSessionToken } from '@/lib/auth-utils';
import { validateRequestBody, setSessionCookie } from '@/lib/api-middleware';
import { signinSchema } from '@/lib/validation-schemas';

export async function POST(req) {
  try {
    const validation = await validateRequestBody(req, signinSchema);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validation.error },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const { db } = await connectToDatabase();

    // Find user by email
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    const sessionToken = generateSessionToken();
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.collection('sessions').insertOne({
      user_id: user._id,
      token: sessionToken,
      expiresAt: sessionExpiresAt,
      created_at: new Date(),
    });

    // Return response with session cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Signin successful',
        data: {
          user_id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );

    return setSessionCookie(response, sessionToken);
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
