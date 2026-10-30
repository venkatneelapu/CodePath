import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { toObjectId } from '@/lib/auth-utils';

export async function GET(req, { params }) {
  try {
    const { userId } = await params;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Query user without sensitive fields
    let user = null;
    try {
      user = await db.collection('users').findOne(
        { _id: toObjectId(userId) },
        { projection: { password_hash: 0, email: 0, phone: 0 } }
      );
    } catch (e) {
      user = await db.collection('users').findOne(
        { id: userId },
        { projection: { password_hash: 0, email: 0, phone: 0 } }
      );
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get streak info
    const streak = await db.collection('streaks').findOne({ user_id: user._id });

    // Get leaderboard info
    const leaderboard = await db.collection('leaderboard').findOne({ user_id: user._id });

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: user._id.toString(),
          name: user.name,
          bio: user.bio || '',
          location: user.location || '',
          website: user.website || '',
          avatar_url: user.avatar_url || user.profilePhoto || null,
          points: leaderboard?.points || 120,
          streak: streak?.current || 1,
          createdAt: user.created_at || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Public profile API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

