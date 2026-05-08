import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword, generateSessionToken } from '@/lib/auth-utils';
import { validateRequestBody } from '@/lib/api-middleware';
import { z } from 'zod';

const resetPasswordRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordConfirmSchema = z.object({
  token: z.string().min(1),
  new_password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])/, 'Password must contain lowercase letters')
    .regex(/^(?=.*[A-Z])/, 'Password must contain uppercase letters')
    .regex(/^(?=.*\d)/, 'Password must contain numbers'),
});

// Request password reset
export async function POST(req) {
  try {
    const validation = await validateRequestBody(req, resetPasswordRequestSchema);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validation.error },
        { status: 400 }
      );
    }

    const { email } = validation.data;
    const { db } = await connectToDatabase();

    // Check if user exists
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { success: true, message: 'If an account exists, reset instructions have been sent' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // Store reset token
    await db.collection('password_resets').insertOne({
      user_id: user._id,
      token: resetToken,
      expiresAt: resetTokenExpiry,
      used: false,
      created_at: new Date(),
    });

    // TODO: Send email with reset link
    // In production, send email: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}

    return NextResponse.json(
      { success: true, message: 'If an account exists, reset instructions have been sent' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Confirm password reset
export async function PUT(req) {
  try {
    const validation = await validateRequestBody(req, resetPasswordConfirmSchema);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validation.error },
        { status: 400 }
      );
    }

    const { token, new_password } = validation.data;
    const { db } = await connectToDatabase();

    // Find valid reset token
    const resetRecord = await db.collection('password_resets').findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash new password
    const password_hash = await hashPassword(new_password);

    // Update user password
    await db.collection('users').updateOne(
      { _id: resetRecord.user_id },
      {
        $set: {
          password_hash,
          updated_at: new Date(),
        },
      }
    );

    // Mark reset token as used
    await db.collection('password_resets').updateOne(
      { _id: resetRecord._id },
      { $set: { used: true } }
    );

    return NextResponse.json(
      { success: true, message: 'Password reset successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset confirm error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
