import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { withAuthMiddleware, validateRequestBody } from '@/lib/api-middleware';
import { enrollCourseSchema } from '@/lib/validation-schemas';
import { toObjectId, isValidObjectId } from '@/lib/auth-utils';

// GET list of all courses
export async function GET(req) {
  try {
    const { db } = await connectToDatabase();

    const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '20'), 100);
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');
    const category = req.nextUrl.searchParams.get('category');

    const query = {};
    if (category) {
      query.category = category;
    }

    const courses = await db.collection('courses')
      .find(query)
      .skip(offset)
      .limit(limit)
      .toArray();

    const total = await db.collection('courses').countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: {
          courses: courses.map(c => ({
            ...c,
            _id: c._id.toString(),
          })),
          total,
          limit,
          offset,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST enroll in course
export const POST = (req) =>
  withAuthMiddleware(async (req, { user_id }) => {
    try {
      const validation = await validateRequestBody(req, enrollCourseSchema);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, message: 'Validation failed', errors: validation.error },
          { status: 400 }
        );
      }

      const { db } = await connectToDatabase();
      const userId = toObjectId(user_id);
      const { course_id } = validation.data;

      if (!isValidObjectId(course_id)) {
        return NextResponse.json(
          { success: false, message: 'Invalid course ID' },
          { status: 400 }
        );
      }

      const courseObjId = toObjectId(course_id);

      // Check if course exists
      const course = await db.collection('courses').findOne({ _id: courseObjId });
      if (!course) {
        return NextResponse.json(
          { success: false, message: 'Course not found' },
          { status: 404 }
        );
      }

      // Check if already enrolled
      const existing = await db.collection('enrollments').findOne({
        user_id: userId,
        course_id: courseObjId,
      });

      if (existing) {
        return NextResponse.json(
          { success: false, message: 'Already enrolled in this course' },
          { status: 400 }
        );
      }

      // Create enrollment
      const result = await db.collection('enrollments').insertOne({
        user_id: userId,
        course_id: courseObjId,
        enrolled_date: new Date(),
        progress: 0,
        status: 'active',
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Enrolled successfully',
          data: {
            enrollment_id: result.insertedId.toString(),
            course_id: course_id,
            status: 'active',
          },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Enroll course error:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  })(req);
