function getFallbackResources(topic = 'Software Engineering', level = 'Beginner') {
  return [
    {
      title: `${topic} Official Documentation & Guides`,
      type: 'website',
      url: 'https://developer.mozilla.org/',
      description: `Comprehensive tutorials, reference manuals, and interactive examples for ${topic}.`,
      difficulty: level.toLowerCase()
    },
    {
      title: `FreeCodeCamp - ${topic} Curriculum`,
      type: 'course',
      url: 'https://www.freecodecamp.org/',
      description: `Structured interactive challenges and milestone projects covering ${topic}.`,
      difficulty: level.toLowerCase()
    },
    {
      title: `${topic} Open Source Projects & Architectures`,
      type: 'tutorial',
      url: 'https://github.com/',
      description: `Explore real-world repositories, design patterns, and codebases in ${topic}.`,
      difficulty: level.toLowerCase()
    }
  ];
}

export async function POST(request) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const body = await request.json().catch(() => ({}));
    const { topic = 'Programming', level = 'Beginner' } = body;

    if (!API_KEY) {
      console.warn('GEMINI_API_KEY not found. Serving fallback resources.');
      return Response.json(getFallbackResources(topic, level), { status: 200 });
    }

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

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

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
