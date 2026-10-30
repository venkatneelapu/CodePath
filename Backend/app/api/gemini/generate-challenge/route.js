const API_KEY = process.env.GEMINI_API_KEY

export async function POST(request) {
  try {
    if (!API_KEY) {
      console.error('GEMINI_API_KEY not found')
      return Response.json({ error: 'API key not configured' }, { status: 500 })
    }

    const { roadmapId, topicsCovered, difficulty, language } = await request.json()

    const prompt = `Generate a coding challenge based on these topics: ${topicsCovered.join(', ')}. Difficulty: ${difficulty || 'intermediate'}. Language: ${language || 'python'}.

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
  "starterCode": "${language === 'python' ? '# TODO: Write your solution here\\n# ' : '// TODO: Write your solution here\\n// '}"
}

Make sure:
- Problem is clear and solvable
- Include multiple examples
- Add helpful hints
- Starter code is in the correct language
- Constraints are realistic`

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`

    console.log('Generating challenge for topics:', topicsCovered)

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API error:', errorData)
      return Response.json({ error: 'Failed to generate challenge' }, { status: response.status })
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!content) {
      return Response.json({ error: 'No content generated' }, { status: 400 })
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const challenge = JSON.parse(jsonMatch[0])
      console.log('Challenge generated successfully')
      return Response.json(challenge)
    }

    return Response.json({ error: 'Failed to parse challenge response' }, { status: 400 })
  } catch (error) {
    console.error('Challenge generation error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
