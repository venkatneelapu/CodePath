import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { withAuthMiddleware, validateRequestBody } from '@/lib/api-middleware';
import { sendChatMessageSchema } from '@/lib/validation-schemas';
import { toObjectId } from '@/lib/auth-utils';

// GET chat history
async function handleGet(req, { user_id }) {
  try {
    const { db } = await connectToDatabase();
    const userId = toObjectId(user_id);

    const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '50'), 200);
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');
    const roadmapId = req.nextUrl.searchParams.get('roadmap_id');

    const query = { user_id: userId };
    if (roadmapId) {
      query.roadmap_id = toObjectId(roadmapId);
    }

    const messages = await db.collection('chat_history')
      .find(query)
      .sort({ created_at: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    const total = await db.collection('chat_history').countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: {
          messages: messages.map(m => ({
            ...m,
            _id: m._id.toString(),
            user_id: m.user_id.toString(),
            roadmap_id: m.roadmap_id?.toString(),
          })),
          total,
          limit,
          offset,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get chat history error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST send message
async function handlePost(req, { user_id }) {
  try {
    const validation = await validateRequestBody(req, sendChatMessageSchema);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validation.error },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const userId = toObjectId(user_id);
    const { message, roadmap_id } = validation.data;

    // Store user message
    const userMessageResult = await db.collection('chat_history').insertOne({
      user_id: userId,
      roadmap_id: roadmap_id ? toObjectId(roadmap_id) : null,
      role: 'user',
      content: message,
      created_at: new Date(),
    });

    // TODO: Call Gemini API for AI response
    // For now, return placeholder response
    const aiResponse = 'This is a placeholder response. Connect Gemini API for actual AI responses.';

    const aiMessageResult = await db.collection('chat_history').insertOne({
      user_id: userId,
      roadmap_id: roadmap_id ? toObjectId(roadmap_id) : null,
      role: 'assistant',
      content: aiResponse,
      created_at: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        data: {
          user_message: {
            _id: userMessageResult.insertedId.toString(),
            role: 'user',
            content: message,
          },
          ai_message: {
            _id: aiMessageResult.insertedId.toString(),
            role: 'assistant',
            content: aiResponse,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = (req) => withAuthMiddleware(handleGet)(req);
export const POST = (req) => withAuthMiddleware(handlePost)(req);
