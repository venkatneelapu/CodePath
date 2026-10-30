import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { withAuthMiddleware } from '@/lib/api-middleware';
import { toObjectId } from '@/lib/auth-utils';

async function handleGet(req, { user_id }) {
  try {
    const { db } = await connectToDatabase();
    const userId = toObjectId(user_id);

    // Get all roadmaps
    const roadmaps = await db.collection('roadmaps')
      .find({ user_id: userId })
      .toArray();

    // Get progress for each roadmap
    const progress = await Promise.all(
      roadmaps.map(async (roadmap) => {
        const modules = await db.collection('modules')
          .find({ roadmap_id: roadmap._id })
          .toArray();

        const completedModules = await db.collection('progress')
          .find({ 
            user_id: userId, 
            module_id: { $in: modules.map(m => m._id) },
            completed: true 
          })
          .toArray();

        const completionPercentage = modules.length > 0 
          ? Math.round((completedModules.length / modules.length) * 100)
          : 0;

        return {
          roadmap_id: roadmap._id.toString(),
          title: roadmap.title,
          total_modules: modules.length,
          completed_modules: completedModules.length,
          completion_percentage: completionPercentage,
          status: roadmap.status,
          created_at: roadmap.created_at,
          last_updated: roadmap.updated_at,
        };
      })
    );

    // Calculate overall stats
    const totalModules = progress.reduce((sum, p) => sum + p.total_modules, 0);
    const completedModulesTotal = progress.reduce((sum, p) => sum + p.completed_modules, 0);
    const overallCompletion = totalModules > 0 
      ? Math.round((completedModulesTotal / totalModules) * 100)
      : 0;

    return NextResponse.json(
      {
        success: true,
        data: {
          overall_completion: overallCompletion,
          total_roadmaps: roadmaps.length,
          total_modules: totalModules,
          completed_modules: completedModulesTotal,
          roadmaps: progress,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = (req) => withAuthMiddleware(handleGet)(req);
