// Server-side Gemini API route for resource recommendations
const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request) {
  try {
    if (!API_KEY) {
      console.error('GEMINI_API_KEY not found');
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    const { topic, level } = await request.json();

    const prompt = `Recommend 10 best learning resources (books, courses, websites, tutorials) for learning "${topic}" at ${level} level.
    
Return a JSON array like this:
[
  {
    "title": "string",
    "type": "book|course|website|tutorial|video",
    "url": "string",
    "description": "string",
    "difficulty": "beginner|intermediate|advanced"
  }
]`;

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return Response.json([], { status: 200 });
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      return Response.json([], { status: 200 });
    }

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return Response.json(JSON.parse(jsonMatch[0]));
    }
    return Response.json([], { status: 200 });
  } catch (error) {
    console.error('Resources error:', error);
    return Response.json([], { status: 200 });
  }
}
