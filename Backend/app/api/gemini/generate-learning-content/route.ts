import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { moduleTitle, topic, level } = await request.json();

    if (!moduleTitle || !topic || !level) {
      return NextResponse.json({ error: 'Missing moduleTitle, topic, or level' }, { status: 400 });
    }

    const prompt = `Generate detailed learning content for this module: "${moduleTitle}" in topic "${topic}" at ${level} level.

Include:
- Learning objectives
- Step-by-step explanation  
- Code examples
- Practice exercises
- Resources/links

Return ONLY valid JSON:
{
  "title": "string",
  "objectives": ["string", ...],
  "content": "string - markdown formatted content",
  "codeExamples": [{"language": "python", "code": "print('hello')"}],
  "exercises": ["string", ...],
  "resources": ["links or books"]
}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON from Gemini');
    }

    const content = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      ...content
    });

  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate content',
      details: error.message 
    }, { status: 500 });
  }
}

