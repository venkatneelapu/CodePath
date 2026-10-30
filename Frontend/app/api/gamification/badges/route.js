import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { withAuthMiddleware } from '@/lib/api-middleware';
import { toObjectId } from '@/lib/auth-utils';

// Badge definitions
const BADGE_DEFINITIONS = {
  first_roadmap: {
    id: 'first_roadmap',
    name: 'First Step',
    description: 'Complete your first roadmap',
    icon: '🚀',
    requirement: { type: 'roadmap_completion', count: 1 },
  },
  module_master: {
    id: 'module_master',
    name: 'Module Master',
    description: 'Complete 10 modules',
    icon: '📚',
    requirement: { type: 'module_completion', count: 10 },
  },
  streak_warrior: {
    id: 'streak_warrior',
    name: 'Streak Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    requirement: { type: 'streak', count: 7 },
  },
  point_collector: {
    id: 'point_collector',
    name: 'Point Collector',
    description: 'Earn 100 points',
    icon: '⭐',
    requirement: { type: 'points', count: 100 },
  },
  quiz_master: {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Pass 5 quizzes',
    icon: '🎓',
    requirement: { type: 'quiz_completion', count: 5 },
  },
};

// GET user badges
async function handleGet(req, { user_id }) {
  try {
    const { db } = await connectToDatabase();
    const userId = toObjectId(user_id);

    const badges = await db.collection('badges')
      .find({ user_id: userId })
      .toArray();

    // Check if user should earn any new badges
    const earnedBadgeIds = badges.map(b => b.badge_id);
    const newBadges = [];

    // Get user stats
    const leaderboard = await db.collection('leaderboard').findOne({ user_id: userId });
    const streak = await db.collection('streaks').findOne({ user_id: userId });
    const moduleCount = await db.collection('progress').countDocuments({
      user_id: userId,
      completed: true,
    });

    // Check each badge
    for (const [badgeId, badgeDef] of Object.entries(BADGE_DEFINITIONS)) {
      if (earnedBadgeIds.includes(badgeId)) continue;

      const { requirement } = badgeDef;
      let shouldEarn = false;

      if (requirement.type === 'module_completion' && moduleCount >= requirement.count) {
        shouldEarn = true;
      } else if (requirement.type === 'points' && (leaderboard?.points || 0) >= requirement.count) {
        shouldEarn = true;
      } else if (requirement.type === 'streak' && (streak?.current_streak || 0) >= requirement.count) {
        shouldEarn = true;
      }

      if (shouldEarn) {
        const newBadge = {
          user_id: userId,
          badge_id: badgeId,
          name: badgeDef.name,
          description: badgeDef.description,
          icon: badgeDef.icon,
          earned_at: new Date(),
        };
        newBadges.push(newBadge);
      }
    }

    // Save new badges
    if (newBadges.length > 0) {
      await db.collection('badges').insertMany(newBadges);
    }

    // Return all badges
    const allBadges = await db.collection('badges')
      .find({ user_id: userId })
      .toArray();

    return NextResponse.json(
      {
        success: true,
        data: {
          badges: allBadges.map(b => ({
            ...b,
            _id: b._id.toString(),
            user_id: b.user_id.toString(),
          })),
          newly_earned: newBadges.length > 0 ? newBadges.map(b => b.badge_id) : [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get badges error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = (req) => withAuthMiddleware(handleGet)(req);
