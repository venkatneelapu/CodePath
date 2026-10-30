import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const MODEL_NAME = 'gemini-2.5-flash';

function generateFallbackPath(topic: string, level: string, duration: number) {
  const modules = [];
  const days = Math.min(Math.max(duration, 1), 30);

  const phaseNames = [
    'Fundamentals & Core Concepts',
    'Practical Application & Syntax',
    'Intermediate Patterns & Workflows',
    'Advanced Techniques & Optimization',
    'Real-World Capstone Project & Best Practices'
  ];

  for (let i = 1; i <= days; i++) {
    const phaseIndex = Math.min(Math.floor((i - 1) / (days / phaseNames.length)), phaseNames.length - 1);
    const phase = phaseNames[phaseIndex];

    modules.push({
      day: i,
      title: `Day ${i}: ${topic} - ${phase}`,
      duration: 1,
      topics: [
        `${topic} Core Milestone ${i}`,
        `Hands-on Coding Practice for Day ${i}`,
        `Review & Mini Challenge`
      ],
      type: i % 4 === 0 ? 'project' : i % 2 === 0 ? 'quiz' : 'learning',
      description: `Structured learning and hands-on exercises covering ${topic} at the ${level} skill level.`,
      resources: [
        `https://developer.mozilla.org/`,
        `https://github.com/`
      ]
    });
  }

  return {
    success: true,
    title: `${topic} (${level} Level) - ${days} Days Roadmap`,
    description: `A comprehensive, progressive curriculum designed to master ${topic} step-by-step.`,
    totalDays: days,
    modules
  };
}

export async function POST(request: NextRequest) {
  try {
    const { topic, level, duration } = await request.json();

    if (!topic || !level || !duration) {
      return NextResponse.json({ error: 'Missing topic, level, or duration' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not configured. Serving intelligent fallback roadmap.');
      return NextResponse.json(generateFallbackPath(topic, level, parseInt(duration) || 7));
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
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
      "type": "learning",
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

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const roadmap = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          success: true,
          title: roadmap.title || `${topic} Learning Path`,
          description: roadmap.description || `Roadmap for ${topic}`,
          totalDays: roadmap.totalDays || duration,
          modules: roadmap.modules || []
        });
      }
    } catch (aiError) {
      console.warn('Gemini API call failed, falling back to structured roadmap:', aiError);
      return NextResponse.json(generateFallbackPath(topic, level, parseInt(duration) || 7));
    }

    return NextResponse.json(generateFallbackPath(topic, level, parseInt(duration) || 7));

  } catch (error: unknown) {
    console.error('Server error in learning-path route:', error);
    return NextResponse.json({
      error: 'Failed to generate learning path',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
