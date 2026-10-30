import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

function generateFallbackContent(moduleTitle: string, topic: string, level: string) {
  return {
    success: true,
    title: moduleTitle,
    objectives: [
      `Understand foundational principles of ${topic}`,
      `Learn core syntax and operational patterns for ${moduleTitle}`,
      `Implement practical examples with best practices`
    ],
    content: `## ${moduleTitle}\n\nWelcome to this comprehensive guide on **${moduleTitle}** within **${topic}** (${level} level).\n\n### Key Principles\n- **Foundations**: Core definitions, architectural structure, and concepts.\n- **Practical Execution**: How to write, test, and debug code for this milestone.\n- **Best Practices**: Maintainability, performance considerations, and edge cases.\n\n### Next Steps\nReview the code examples below, run them locally, and complete the practice exercises to reinforce your learning.`,
    codeExamples: [
      {
        language: 'javascript',
        code: `// Example: ${moduleTitle}\nfunction learnTopic() {\n  const skill = "${topic}";\n  console.log(\`Mastering \${skill} at ${level} level!\`);\n}\n\nlearnTopic();`
      }
    ],
    exercises: [
      `Define and execute a sample script demonstrating ${moduleTitle}.`,
      `Add input validation and error handling to your implementation.`,
      `Refactor your solution for optimal performance.`
    ],
    resources: [
      'https://developer.mozilla.org/',
      'https://github.com/'
    ]
  };
}

export async function POST(request: NextRequest) {
  try {
    const { moduleTitle, topic, level } = await request.json();

    if (!moduleTitle || !topic || !level) {
      return NextResponse.json({ error: 'Missing moduleTitle, topic, or level' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

    if (!apiKey) {
      console.warn('GEMINI_API_KEY not configured. Serving fallback learning content.');
      return NextResponse.json(generateFallbackContent(moduleTitle, topic, level));
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
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
  "objectives": ["string"],
  "content": "string - markdown formatted content",
  "codeExamples": [{"language": "python", "code": "print('hello')"}],
  "exercises": ["string"],
  "resources": ["links or books"]
}`;

      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const content = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          success: true,
          ...content
        });
      }
    } catch (aiErr) {
      console.warn('Gemini content generation failed, serving fallback:', aiErr);
      return NextResponse.json(generateFallbackContent(moduleTitle, topic, level));
    }

    return NextResponse.json(generateFallbackContent(moduleTitle, topic, level));

  } catch (error: unknown) {
    console.error('Content generation error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      error: 'Failed to generate content',
      details: message
    }, { status: 500 });
  }
}
