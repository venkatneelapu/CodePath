import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(req) {
  try {
    const { db } = await connectToDatabase();

    // Get limit from query params (default 10)
    const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '10'), 100);
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');

    // Get leaderboard with user details
    const leaderboard = await db.collection('leaderboard').aggregate([
      { $sort: { points: -1 } },
      { $skip: offset },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          user_id: 1,
          points: 1,
          updated_at: 1,
          name: '$user.name',
          avatar_url: '$user.avatar_url'
        }
      }
    ]).toArray();

    // Get total count
    const totalCount = await db.collection('leaderboard').countDocuments();

    // Add rank to each user
    const leaderboardWithRank = leaderboard.map((entry, index) => ({
      ...entry,
      _id: entry._id.toString(),
      user_id: entry.user_id.toString(),
      rank: offset + index + 1,
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          leaderboard: leaderboardWithRank,
          total: totalCount,
          limit,
          offset,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
