export async function POST(request) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!API_KEY) {
      console.warn('GEMINI_API_KEY not found in environment variables');
      return Response.json({ reply: 'Hello! I am your AI coding mentor. Ask me anything about programming or web development!' }, { status: 200 });
    }

    const { message, context } = await request.json();
    console.log('Mentor request - message:', message, 'context:', context);

    const prompt = `You are a helpful coding mentor. Keep responses SHORT and SIMPLE. Like talking to a friend.

RULES - MUST FOLLOW:
1. Maximum 2-3 sentences for simple questions
2. Use VERY simple English that a beginner understands
3. One small code example ONLY if helpful
4. NO long lists or complex explanations
5. Focus on ONE main idea only
6. Be friendly and encouraging
7. Ask a follow-up question if needed

Example response: "Great question! A variable is like a box where you store information. For example: name = 'Ali' stores the text 'Ali'. Want to learn how to use variables?"

Student Question: "${message}"

REMEMBER: Short, simple, and helpful - like a real mentor!`;

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    console.log('Calling Gemini API...');
    console.log('API URL:', GEMINI_API_URL.replace(API_KEY, '***'));
    
    let response;
    try {
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
    } catch (fetchError) {
      console.error('Fetch error calling Gemini API:', fetchError.message);
      
      if (fetchError.name === 'AbortError') {
        return Response.json({ 
          reply: 'The AI service is taking too long to respond. Please try again in a moment.' 
        }, { status: 200 });
      }
      
      return Response.json({ 
        reply: 'Network error: Unable to reach the AI service. Please check your connection and try again.' 
      }, { status: 200 });
    }

    console.log('Gemini response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return Response.json({ reply: 'I\'m having trouble accessing the AI service. But I can still help! Tell me more about your question.' }, { status: 200 });
    }

    const data = await response.json();
    console.log('Gemini data:', data);
    
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!reply) {
      console.warn('No reply in Gemini response');
      return Response.json({ reply: 'I received your question but couldn\'t generate a response. Please try again or rephrase your question.' }, { status: 200 });
    }

    return Response.json({ reply });
  } catch (error) {
    console.error('Mentor API error:', error);
    return Response.json({ reply: 'An error occurred. Please try again later.' }, { status: 200 });
  }
}
