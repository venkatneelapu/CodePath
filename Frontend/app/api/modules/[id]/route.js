import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { withAuthMiddleware, validateRequestBody } from '@/lib/api-middleware';
import { completeModuleSchema } from '@/lib/validation-schemas';
import { toObjectId, isValidObjectId } from '@/lib/auth-utils';

// GET module details
async function handleGet(
  req,
  { user_id, params }
) {
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid module ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const moduleId = toObjectId(id);
    const userId = toObjectId(user_id);

    // Get module
    const module = await db.collection('modules').findOne({ _id: moduleId });

    if (!module) {
      return NextResponse.json(
        { success: false, message: 'Module not found' },
        { status: 404 }
      );
    }

    // Verify user owns the roadmap
    const roadmap = await db.collection('roadmaps').findOne({
      _id: module.roadmap_id,
      user_id: userId,
    });

    if (!roadmap) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get user progress on this module
    const progress = await db.collection('progress').findOne({
      user_id: userId,
      module_id: moduleId,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...module,
          _id: module._id.toString(),
          roadmap_id: module.roadmap_id.toString(),
          progress,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get module error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST mark module as complete
async function handlePost(
  req,
  { user_id, params }
) {
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid module ID' },
        { status: 400 }
      );
    }

    const validation = await validateRequestBody(req, completeModuleSchema);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validation.error },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const moduleId = toObjectId(id);
    const userId = toObjectId(user_id);

    // Get module and verify ownership
    const module = await db.collection('modules').findOne({ _id: moduleId });
    if (!module) {
      return NextResponse.json(
        { success: false, message: 'Module not found' },
        { status: 404 }
      );
    }

    const roadmap = await db.collection('roadmaps').findOne({
      _id: module.roadmap_id,
      user_id: userId,
    });

    if (!roadmap) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const completionDate = validation.data.completion_date 
      ? new Date(validation.data.completion_date)
      : new Date();

    // Update or create progress
    const result = await db.collection('progress').findOneAndUpdate(
      { user_id: userId, module_id: moduleId },
      {
        $set: {
          completed: true,
          completion_date: completionDate,
          updated_at: new Date(),
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    // Award points if module just completed
    if (!result.value?.completed) {
      const points = 10; // Points per module
      await db.collection('leaderboard').updateOne(
        { user_id: userId },
        {
          $inc: { points },
          $set: { updated_at: new Date() },
        }
      );

      // Update streak
      const today = new Date().toDateString();
      const streak = await db.collection('streaks').findOne({ user_id: userId });
      
      if (streak) {
        const lastActivityDate = streak.last_activity_date 
          ? new Date(streak.last_activity_date).toDateString()
          : null;

        let newStreak = streak.current_streak;
        if (lastActivityDate !== today) {
          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
          if (lastActivityDate === yesterday) {
            newStreak = streak.current_streak + 1;
          } else {
            newStreak = 1;
          }
        }

        const longestStreak = Math.max(newStreak, streak.longest_streak);

        await db.collection('streaks').updateOne(
          { user_id: userId },
          {
            $set: {
              current_streak: newStreak,
              longest_streak: longestStreak,
              last_activity_date: new Date(),
              updated_at: new Date(),
            },
          }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Module marked as complete',
        data: result.value,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Complete module error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = async (req, context) => {
  const resolvedParams = await context.params;
  return withAuthMiddleware((r, authContext) => handleGet(r, { ...authContext, params: resolvedParams }))(req);
};

export const POST = async (req, context) => {
  const resolvedParams = await context.params;
  return withAuthMiddleware((r, authContext) => handlePost(r, { ...authContext, params: resolvedParams }))(req);
};
