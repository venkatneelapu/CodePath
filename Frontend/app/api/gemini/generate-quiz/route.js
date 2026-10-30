function generateFallbackQuiz(topicsCovered = ['Programming Concepts'], difficulty = 'intermediate') {
  const primaryTopic = topicsCovered[0] || 'Software Engineering';
  return {
    id: `quiz-fallback-${Date.now()}`,
    title: `${primaryTopic} Knowledge Check (${difficulty})`,
    questions: [
      {
        id: 'q1',
        question: `What is the primary role of variables and data types in ${primaryTopic}?`,
        options: [
          'To define and store structured data during program execution',
          'To format CSS styles for display',
          'To connect directly to DNS servers',
          'To compile source code into machine bytecode'
        ],
        correct: 0,
        explanation: 'Variables act as labeled storage containers that hold typed data values in memory.'
      },
      {
        id: 'q2',
        question: `Which architectural pattern emphasizes breaking systems into small, independent modules?`,
        options: [
          'Monolithic single-tier pattern',
          'Modular and component-based design',
          'Uncontrolled recursion pattern',
          'Hardcoded global state pattern'
        ],
        correct: 1,
        explanation: 'Modular design isolates concerns, promoting maintainability, reusability, and easier testing.'
      },
      {
        id: 'q3',
        question: `When handling runtime operations in ${primaryTopic}, what is the best practice for unexpected errors?`,
        options: [
          'Silently ignore all exceptions',
          'Terminate the entire server without logging',
          'Use structured try/catch blocks with contextual logging',
          'Loop infinitely until it succeeds'
        ],
        correct: 2,
        explanation: 'Graceful exception handling with try/catch ensures user stability and provides diagnostic logs.'
      }
    ]
  };
}

export async function POST(request) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const body = await request.json().catch(() => ({}));
    const { topicsCovered = ['Core Concepts'], difficulty = 'intermediate' } = body;

    if (!API_KEY) {
      console.warn('GEMINI_API_KEY not configured. Serving fallback quiz.');
      return Response.json(generateFallbackQuiz(topicsCovered, difficulty));
    }

    const prompt = `Generate a quiz with 3 multiple choice questions based on these topics: ${Array.isArray(topicsCovered) ? topicsCovered.join(', ') : topicsCovered}. The difficulty level is ${difficulty}.

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
- Options are plausible but distinct`;

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
      console.warn('Gemini quiz call failed, serving fallback:', aiErr);
    }

    return Response.json(generateFallbackQuiz(topicsCovered, difficulty));
  } catch (error) {
    console.error('Quiz generation error:', error);
    return Response.json(generateFallbackQuiz(['Programming'], 'beginner'));
  }
}
