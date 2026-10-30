import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from './mongodb';

type AuthContext = { user_id: string };
type AuthedHandler = (req: NextRequest, context: AuthContext) => Promise<Response>;

export function withAuthMiddleware(handler: AuthedHandler) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      const sessionToken = req.cookies.get('session_token')?.value;

      if (!sessionToken) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized: No session token' },
          { status: 401 }
        );
      }

      const { db } = await connectToDatabase();
      const session = await db.collection('sessions').findOne({
        token: sessionToken,
        expiresAt: { $gt: new Date() },
      });

      if (!session) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized: Invalid or expired session' },
          { status: 401 }
        );
      }

      return await handler(req, { user_id: session.user_id.toString() });
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

export function errorHandler(error: unknown, defaultStatus = 500) {
  if (error instanceof Error) {
    const statusCode = (error as any).statusCode || defaultStatus;
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
      { status: statusCode }
    );
  }

  return NextResponse.json(
    { success: false, message: 'Internal server error' },
    { status: defaultStatus }
  );
}

import { z } from 'zod';

export async function validateRequestBody<T>(
  req: NextRequest,
  schema: z.ZodType<T>
): Promise<{ valid: true; data: T } | { valid: false; error: any }> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return {
        valid: false,
        error: result.error.errors.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      };
    }
    return { valid: true, data: result.data };
  } catch {
    return {
      valid: false,
      error: 'Invalid JSON in request body',
    };
  }
}

export function setSessionCookie(
  response: NextResponse,
  token: string,
  expiresIn = 7 * 24 * 60 * 60
) {
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  response.cookies.set({
    name: 'session_token',
    value: token,
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.delete('session_token');
  return response;
}

