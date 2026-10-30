import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword, generateSessionToken } from '@/lib/auth-utils';
import { validateRequestBody, setSessionCookie } from '@/lib/api-middleware';
import { signupSchema } from '@/lib/validation-schemas';

export async function POST(req: NextRequest) {
  try {
    const validation = await validateRequestBody(req, signupSchema);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validation.error },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;
    const { db } = await connectToDatabase();

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 409 }
      );
    }

    const password_hash = await hashPassword(password);
    
    const newUser = {
      email,
      password_hash,
      name,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);
    
    const sessionToken = generateSessionToken();
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.collection('sessions').insertOne({
      user_id: result.insertedId,
      token: sessionToken,
      expiresAt: sessionExpiresAt,
      created_at: new Date(),
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Signup successful',
        data: {
          user_id: result.insertedId.toString(),
          email,
          name,
        },
      },
      { status: 201 }
    );

    return setSessionCookie(response, sessionToken);
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
