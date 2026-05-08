import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { withAuthMiddleware } from '@/lib/api-middleware';
import { toObjectId } from '@/lib/auth-utils';

// GET user gamification stats (streaks, badges, points, level)
async function handleGet(req, { user_id }) {
  try {
    const { db } = await connectToDatabase();
    const userId = toObjectId(user_id);

    // Get streak data
    const streak = await db.collection('streaks').findOne({ user_id: userId });

    // Get leaderboard data
    const leaderboard = await db.collection('leaderboard').findOne({ user_id: userId });

    // Get badges
    const badges = await db.collection('badges')
      .find({ user_id: userId })
      .toArray();

    // Calculate level based on points
    const points = leaderboard?.points || 0;
    const level = Math.floor(points / 100) + 1;

    // Get global rank
    const rank = await db.collection('leaderboard').countDocuments({
      points: { $gt: points },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          points,
          level,
          rank: rank + 1,
          streak: {
            current: streak?.current_streak || 0,
            longest: streak?.longest_streak || 0,
            last_activity: streak?.last_activity_date,
          },
          badges: badges.map(b => ({
            ...b,
            _id: b._id.toString(),
            user_id: b.user_id.toString(),
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get gamification stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = (req) => withAuthMiddleware(handleGet)(req);
