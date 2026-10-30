import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { withAuthMiddleware, validateRequestBody } from '@/lib/api-middleware';
import { createRoadmapSchema } from '@/lib/validation-schemas';
import { toObjectId } from '@/lib/auth-utils';

// GET list of user's roadmaps
async function handleGet(req, { user_id }) {
  try {
    const { db } = await connectToDatabase();
    const userId = toObjectId(user_id);

    const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '20'), 100);
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');
    const status = req.nextUrl.searchParams.get('status');

    const query = { user_id: userId };
    if (status) {
      query.status = status;
    }

    const roadmaps = await db.collection('roadmaps')
      .find(query)
      .sort({ created_at: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    const total = await db.collection('roadmaps').countDocuments(query);

    // Enhance with module count
    const roadmapsWithStats = await Promise.all(
      roadmaps.map(async (roadmap) => {
        const moduleCount = await db.collection('modules')
          .countDocuments({ roadmap_id: roadmap._id });
        
        const completedCount = await db.collection('progress')
          .countDocuments({ 
            user_id: userId,
            roadmap_id: roadmap._id,
            completed: true 
          });

        return {
          ...roadmap,
          _id: roadmap._id.toString(),
          user_id: roadmap.user_id.toString(),
          module_count: moduleCount,
          completed_count: completedCount,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          roadmaps: roadmapsWithStats,
          total,
          limit,
          offset,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get roadmaps error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new roadmap
async function handlePost(req, { user_id }) {
  try {
    const validation = await validateRequestBody(req, createRoadmapSchema);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validation.error },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const userId = toObjectId(user_id);
    const { title, description, topic, duration_days, generateAI, modules: customModules } = validation.data;

    // Create roadmap
    const result = await db.collection('roadmaps').insertOne({
      user_id: userId,
      title,
      description: description || '',
      topic,
      duration_days,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    });

    const roadmapId = result.insertedId;

    if (customModules && customModules.length > 0) {
      const modulesToInsert = customModules.map((m, index) => ({
        ...m,
        roadmap_id: roadmapId,
        module_order: index + 1,
        created_at: new Date(),
      }));
      await db.collection('modules').insertMany(modulesToInsert);
    } else if (generateAI) {
      // If generateAI is true, create placeholder modules (AI generation will fill them)
      const modules = [];
      for (let i = 1; i <= Math.min(duration_days, 30); i++) {
        modules.push({
          roadmap_id: roadmapId,
          title: `Day ${i}: ${topic}`,
          content: '',
          duration_day: 1,
          module_order: i,
          generated: false,
          created_at: new Date(),
        });
      }
      await db.collection('modules').insertMany(modules);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Roadmap created successfully',
        data: {
          _id: roadmapId.toString(),
          user_id,
          title,
          topic,
          duration_days,
          status: 'active',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create roadmap error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = (req) => withAuthMiddleware(handleGet)(req);
export const POST = (req) => withAuthMiddleware(handlePost)(req);
