import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { withAuthMiddleware } from '@/lib/api-middleware';
import { toObjectId } from '@/lib/auth-utils';

// GET user enrollments
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

    const enrollments = await db.collection('enrollments')
      .find(query)
      .sort({ enrolled_date: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    // Enhance with course details
    const enrollmentsWithCourse = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = await db.collection('courses').findOne({
          _id: enrollment.course_id,
        });

        return {
          ...enrollment,
          _id: enrollment._id.toString(),
          user_id: enrollment.user_id.toString(),
          course_id: enrollment.course_id.toString(),
          course: course
            ? {
                ...course,
                _id: course._id.toString(),
              }
            : null,
        };
      })
    );

    const total = await db.collection('enrollments').countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: {
          enrollments: enrollmentsWithCourse,
          total,
          limit,
          offset,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get enrollments error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = (req) => withAuthMiddleware(handleGet)(req);
