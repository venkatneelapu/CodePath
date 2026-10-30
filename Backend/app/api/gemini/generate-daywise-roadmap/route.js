export async function POST(request) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

    const { topic, duration = '7 days', level = 'Beginner' } = await request.json()

    // Parse duration to get number of days
    let totalDays = 30
    if (typeof duration === 'string' && duration.includes('week')) {
      const weeks = parseInt(duration)
      totalDays = weeks * 7
    } else if (typeof duration === 'string' && duration.includes('month')) {
      const months = parseInt(duration)
      totalDays = months * 30
    } else if (typeof duration === 'string' && duration.includes('day')) {
      totalDays = parseInt(duration)
    } else if (typeof duration === 'number') {
      totalDays = duration
    }

    if (!API_KEY) {
      console.warn('GEMINI_API_KEY not found. Serving fallback roadmap.')
      const fallbackRoadmap = generateFallbackRoadmap(topic, totalDays, level)
      return Response.json(fallbackRoadmap)
    }

    // For API requests, reduce to max 5 days to avoid token limits and ensure valid JSON
    const daysToGenerate = Math.min(totalDays, 5)
    console.log('Requested days:', totalDays, 'Generating:', daysToGenerate)

    const prompt = `Generate a ${daysToGenerate}-day learning roadmap for ${topic} at ${level} level.

CRITICAL: Return ONLY valid JSON. Start with { and end with }. No markdown, no backticks, no extra text.

For each day, generate:
- day: number
- title: string
- topic: string (1-2 sentences)
- concepts: array of 3 strings
- codingAssignment: object with title, description, difficulty (easy/medium/hard), language (python/javascript/java)
- quiz: object with questions array (3 questions only, not 15)

Example structure (MODIFY THIS FOR THE ACTUAL CONTENT):
{"roadmap":[{"day":1,"title":"Day 1: Topic Name","topic":"What you learn","concepts":["C1","C2","C3"],"codingAssignment":{"title":"Assignment","description":"Do this","difficulty":"easy","language":"python"},"quiz":{"questions":[{"id":1,"question":"Q?","options":["a) A","b) B","c) C","d) D"],"correctAnswer":"a"},{"id":2,"question":"Q?","options":["a) A","b) B","c) C","d) D"],"correctAnswer":"b"},{"id":3,"question":"Q?","options":["a) A","b) B","c) C","d) D"],"correctAnswer":"c"}]}}]}

Generate valid JSON for ${daysToGenerate} days of ${topic} at ${level} level.`

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`

    console.log('Calling Gemini API for day-wise roadmap generation...')
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    })

    console.log('Gemini response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Gemini API error status:', response.status, 'data:', errorData)
      
      // Handle API quota exceeded (429) - use fallback roadmap
      if (response.status === 429) {
        console.warn('API quota exceeded (429). Using fallback roadmap.')
        const fallbackRoadmap = generateFallbackRoadmap(topic, totalDays, level)
        return Response.json({
          ...fallbackRoadmap,
          quotaExceeded: true,
          message: 'Using pre-generated roadmap. API quota will reset tomorrow.'
        })
      }
      
      // For other errors, also try fallback
      console.log('API error. Attempting fallback roadmap.')
      const fallbackRoadmap = generateFallbackRoadmap(topic, totalDays, level)
      return Response.json(fallbackRoadmap)
    }

    const data = await response.json()
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!responseText) {
      console.error('No response text from Gemini')
      return Response.json(
        { error: 'No response from AI service' },
        { status: 500 }
      )
    }

    console.log('Raw response length:', responseText.length)
    console.log('Response starts with:', responseText.substring(0, 100))
    console.log('Response ends with:', responseText.substring(Math.max(0, responseText.length - 100)))

    // Extract JSON from response
    let jsonText
    try {
      jsonText = extractJSON(responseText)
    } catch (extractError) {
      console.error('Error in extractJSON:', extractError?.message)
      console.log('Using fallback due to extraction error')
      const fallbackRoadmap = generateFallbackRoadmap(topic, totalDays, level)
      return Response.json(fallbackRoadmap)
    }

    if (!jsonText) {
      console.error('Could not find valid JSON in response')
      console.error('Full response text:', responseText.substring(0, 500))
      console.log('Using fallback roadmap generation due to JSON extraction failure')
      const fallbackRoadmap = generateFallbackRoadmap(topic, totalDays, level)
      return Response.json(fallbackRoadmap)
    }

    console.log('Extracted JSON text length:', jsonText.length)
    console.log('JSON starts with:', jsonText.substring(0, 100))
    console.log('JSON ends with:', jsonText.substring(Math.max(0, jsonText.length - 100)))

    let roadmapData
    try {
      roadmapData = JSON.parse(jsonText)
      console.log('Successfully parsed JSON with', roadmapData.roadmap?.length, 'days')
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message)
      console.error('Failed JSON text preview:', jsonText.substring(0, 300))
      console.log('Using fallback roadmap generation due to JSON parse failure')
      const fallbackRoadmap = generateFallbackRoadmap(topic, totalDays, level)
      return Response.json(fallbackRoadmap)
    }

    console.log('Successfully generated roadmap with', roadmapData.roadmap?.length, 'days')
    return Response.json(roadmapData)
  } catch (error) {
    console.error('Error generating day-wise roadmap:', error?.message || error)
    console.error('Error stack:', error?.stack)
    console.error('Error type:', error?.constructor?.name)

    // Fallback: Generate a basic roadmap structure with default values
    try {
      console.log('Using fallback roadmap generation with defaults')
      const defaultTopic = 'Programming'
      const defaultTotalDays = 30
      const defaultLevel = 'Intermediate'
      const fallbackRoadmap = generateFallbackRoadmap(defaultTopic, defaultTotalDays, defaultLevel)
      console.log('Fallback roadmap generated successfully with', fallbackRoadmap.roadmap?.length, 'days')
      return Response.json(fallbackRoadmap)
    } catch (fallbackError) {
      console.error('Fallback generation also failed:', fallbackError?.message)
      // Return minimal valid roadmap
      return Response.json({ roadmap: [] }, { status: 500 })
    }
  }
}

function extractJSON(text) {
  if (!text) {
    console.log('No text provided to extractJSON')
    return null
  }

  let cleaned = text.trim()
  
  // Remove markdown code blocks
  if (cleaned.includes('```json')) {
    const parts = cleaned.split('```json')
    if (parts.length > 1) {
      cleaned = parts[1].split('```')[0].trim()
    }
  } else if (cleaned.includes('```')) {
    const parts = cleaned.split('```')
    if (parts.length > 2) {
      cleaned = parts[1].trim()
    }
  }

  // Remove any leading text before {
  const startIdx = cleaned.indexOf('{')
  if (startIdx === -1) {
    console.log('No opening brace found')
    return null
  }

  if (startIdx > 0) {
    cleaned = cleaned.substring(startIdx)
  }

  // Find matching closing brace
  let braceCount = 0
  let inString = false
  let escapeNext = false
  let endIdx = -1

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i]
    
    if (escapeNext) {
      escapeNext = false
      continue
    }
    
    if (char === '\\') {
      escapeNext = true
      continue
    }
    
    if (char === '"' && !escapeNext) {
      inString = !inString
      continue
    }
    
    if (!inString) {
      if (char === '{') {
        braceCount++
      } else if (char === '}') {
        braceCount--
        if (braceCount === 0) {
          endIdx = i + 1
          break
        }
      }
    }
  }

  if (endIdx === -1) {
    console.log('No matching closing brace found. Final count:', braceCount)
    return null
  }

  const result = cleaned.substring(0, endIdx)
  console.log('Extracted JSON, length:', result.length)
  
  return result
}

function generateFallbackRoadmap(topic, totalDays, level) {
  const roadmap = []
  const difficulties = ['easy', 'medium', 'hard']
  const languages = ['python', 'javascript', 'java']
  
  // Ensure totalDays is a valid number
  const daysToGenerate = Math.min(totalDays || 30, 30)
  console.log('Generating fallback roadmap with', daysToGenerate, 'days for', topic)

  for (let day = 1; day <= daysToGenerate; day++) {
    const difficulty = difficulties[Math.floor((day - 1) / 10) % difficulties.length]
    const language = languages[day % languages.length]

    const questions = []
    for (let q = 1; q <= 15; q++) {
      const correctAnswer = String.fromCharCode(97 + ((q - 1) % 4)) // a, b, c, or d
      questions.push({
        id: q,
        question: `${topic} - Question ${q}: What is the concept of ${topic}?`,
        options: [
          `a) First approach to ${topic}`,
          `b) Second approach to ${topic}`,
          `c) Third approach to ${topic}`,
          `d) Fourth approach to ${topic}`,
        ],
        correctAnswer: correctAnswer,
      })
    }

    roadmap.push({
      day,
      title: `Day ${day}: ${topic} - Part ${Math.ceil(day / 10)}`,
      topic: `Learn ${topic} concepts on day ${day}`,
      concepts: [
        `${topic} Concept ${day}`,
        `${topic} Principle ${day}`,
        `${topic} Practice ${day}`,
      ],
      codingAssignment: {
        title: `Build a ${topic} project - Day ${day}`,
        description: `Create a practical ${topic} application demonstrating day ${day} concepts`,
        difficulty,
        language,
      },
      quiz: { questions },
    })
  }

  return { roadmap }
}
