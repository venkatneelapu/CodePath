'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authStorage } from '@/lib/auth'


export default function MentorPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')

  useEffect(() => {
    const currentUser = authStorage.getUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)
  }, [router])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { id: Date.now(), text: input, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      console.log('[v0] Sending message to mentor API:', input)
      
      const response = await fetch('/api/gemini/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, context: topic })
      })

      console.log('[v0] Mentor API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[v0] Response not ok. Status:', response.status, 'Body:', errorText)
        throw new Error(`Failed to get response: ${response.status}`)
      }

      const data = await response.json()
      console.log('[v0] Mentor API response data:', data)
      
      const botMessage = { 
        id: Date.now() + 1, 
        text: data.reply || 'Sorry, I could not generate a response. Please try again.', 
        sender: 'bot' 
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('[v0] Error in handleSendMessage:', error.message)
      const errorMessage = { 
        id: Date.now() + 1, 
        text: `Error: ${error.message}. Please check your connection and try again.`, 
        sender: 'bot' 
      }
      setMessages(prev => [...prev, errorMessage])
    }
    setLoading(false)
  }

  if (!user) return <div>Loading...</div>

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">AI Mentor</h1>
            <p className="text-muted-foreground">Chat with your AI mentor for help with coding and learning concepts</p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Topic (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Python, JavaScript, React..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="h-96 mb-4 overflow-y-auto">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground">Start a conversation with your mentor!</p>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === 'user' 
                          ? 'bg-accent text-white' 
                          : 'bg-muted text-foreground'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask your mentor anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              disabled={loading}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            />
            <Button onClick={handleSendMessage} disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
