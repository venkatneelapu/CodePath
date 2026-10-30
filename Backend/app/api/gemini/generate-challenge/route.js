function generateFallbackChallenge(topicsCovered = ['Problem Solving'], difficulty = 'intermediate', language = 'javascript') {
  const primaryTopic = topicsCovered[0] || 'Core Logic';
  const isPython = language.toLowerCase() === 'python';
  return {
    id: `challenge-fallback-${Date.now()}`,
    title: `${primaryTopic} Coding Milestone`,
    description: `Write a robust program demonstrating mastery of ${primaryTopic}.`,
    problemStatement: `Implement a function that processes an input list/array according to the rules of ${primaryTopic}, handling edge cases and empty inputs cleanly.`,
    examples: [
      {
        input: isPython ? '[1, 2, 3]' : '[1, 2, 3]',
        output: isPython ? '[2, 4, 6]' : '[2, 4, 6]',
        explanation: 'Each element in the input is doubled and returned in a new collection.'
      }
    ],
    constraints: ['Input array length <= 1000', 'Handle null or empty inputs gracefully'],
    hints: ['Break down the logic into modular functions', 'Check edge cases first'],
    starterCode: isPython
      ? `# Problem: ${primaryTopic}\ndef solution(items):\n    # TODO: Write your code here\n    return [x * 2 for x in items]\n`
      : `// Problem: ${primaryTopic}\nfunction solution(items) {\n  // TODO: Write your code here\n  return (items || []).map(x => x * 2);\n}\n`
  };
}

export async function POST(request) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const body = await request.json().catch(() => ({}));
    const { topicsCovered = ['Core Logic'], difficulty = 'intermediate', language = 'javascript' } = body;

    if (!API_KEY) {
      console.warn('GEMINI_API_KEY not found. Serving fallback challenge.');
      return Response.json(generateFallbackChallenge(topicsCovered, difficulty, language));
    }

    const prompt = `Generate a coding challenge based on these topics: ${Array.isArray(topicsCovered) ? topicsCovered.join(', ') : topicsCovered}. Difficulty: ${difficulty}. Language: ${language}.

Return a JSON object with this structure:
{
  "id": "challenge-ai-${Date.now()}",
  "title": "string",
  "description": "string",
  "problemStatement": "string with detailed explanation",
  "examples": [
    {
      "input": "string",
      "output": "string",
      "explanation": "string"
    }
  ],
  "constraints": ["constraint1", "constraint2"],
  "hints": ["hint1", "hint2"],
  "starterCode": "string"
}`;

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return Response.json(JSON.parse(jsonMatch[0]));
          }
        }
      }
    } catch (aiErr) {
      console.warn('Gemini challenge call failed, serving fallback:', aiErr);
    }

    return Response.json(generateFallbackChallenge(topicsCovered, difficulty, language));
  } catch (error) {
    console.error('Challenge generation error:', error);
    return Response.json(generateFallbackChallenge());
  }
}
