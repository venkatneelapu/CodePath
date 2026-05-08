import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

const MODEL_NAME = 'gemini-3-flash-preview';


function getGeminiKeyDebug() {
  const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) return 'MISSING';
  if (typeof key !== 'string') return 'INVALID_TYPE';
  return `PRESENT_LEN_${key.length}`;
}

export async function POST(request: NextRequest) {
  try {
    const { topic, level, duration } = await request.json();

    if (!topic || !level || !duration) {
      return NextResponse.json({ error: 'Missing topic, level, or duration' }, { status: 400 });
    }

    const prompt = `Generate a detailed learning roadmap for "${topic}" at ${level} level for exactly ${duration} days.

Return ONLY valid JSON in this exact structure:
{
  "title": "string - roadmap title",
  "description": "string - short description",
  "totalDays": number,
  "modules": [
    {
      "day": number,
      "title": "string",
      "duration": 1,
      "topics": ["string", "string"],
      "type": "learning|quiz|project",
      "description": "string - brief",
      "resources": ["optional links or tips"]
    }
  ]
}

Make it realistic and progressive.`;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }

    const roadmap = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      title: roadmap.title,
      description: roadmap.description,
      totalDays: roadmap.totalDays || duration,
      modules: roadmap.modules || []
    });

  } catch (error: unknown) {
    console.error('Gemini API error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      error: 'Failed to generate learning path',
      details: message,
      geminiModel: 'gemini-3-flash-preview',
      geminiKeyDebug: getGeminiKeyDebug()
    }, { status: 500 });
  }
}

