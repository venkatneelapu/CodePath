const API_KEY = process.env.GEMINI_API_KEY

export async function POST(request) {
  try {
    if (!API_KEY) {
      console.error('GEMINI_API_KEY not found')
      return Response.json({ error: 'API key not configured' }, { status: 500 })
    }

    const { roadmapId, topicsCovered, difficulty } = await request.json()

    const prompt = `Generate a quiz with 5 multiple choice questions based on these topics: ${topicsCovered.join(', ')}. The difficulty level is ${difficulty || 'intermediate'}.

Return a JSON object with this structure:
{
  "id": "quiz-ai-${Date.now()}",
  "title": "string",
  "questions": [
    {
      "id": "q1",
      "question": "string",
      "options": ["option1", "option2", "option3", "option4"],
      "correct": 0,
      "explanation": "string"
    }
  ]
}

Make sure:
- Questions are clear and educational
- Only ONE correct answer (specified by the index in 'correct')
- Include helpful explanations
- Options are plausible but distinct`

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`

    console.log('Generating quiz for topics:', topicsCovered)

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
      return Response.json({ error: 'Failed to generate quiz' }, { status: response.status })
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!content) {
      return Response.json({ error: 'No content generated' }, { status: 400 })
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const quiz = JSON.parse(jsonMatch[0])
      console.log('Quiz generated successfully')
      return Response.json(quiz)
    }

    return Response.json({ error: 'Failed to parse quiz response' }, { status: 400 })
  } catch (error) {
    console.error('Quiz generation error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
