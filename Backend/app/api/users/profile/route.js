import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { withAuthMiddleware, validateRequestBody } from '@/lib/api-middleware';
import { updateProfileSchema } from '@/lib/validation-schemas';
import { toObjectId } from '@/lib/auth-utils';

// GET user profile
async function handleGet(req, { user_id }) {
  try {
    const { db } = await connectToDatabase();
    
    const user = await db.collection('users').findOne(
      { _id: toObjectId(user_id) },
      { projection: { password_hash: 0 } }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get leaderboard info
    const leaderboard = await db.collection('leaderboard').findOne({ user_id: toObjectId(user_id) });
    
    // Get streak info
    const streak = await db.collection('streaks').findOne({ user_id: toObjectId(user_id) });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...user,
          _id: user._id.toString(),
          leaderboard,
          streak,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update user profile
async function handlePut(req, { user_id }) {
  try {
    const validation = await validateRequestBody(req, updateProfileSchema);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validation.error },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Update user
    const result = await db.collection('users').findOneAndUpdate(
      { _id: toObjectId(user_id) },
      {
        $set: {
          ...validation.data,
          updated_at: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully',
        data: {
          ...result.value,
          _id: result.value._id.toString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = (req) => withAuthMiddleware(handleGet)(req);
export const PUT = (req) => withAuthMiddleware(handlePut)(req);
