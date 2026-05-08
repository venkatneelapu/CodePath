'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, MessageCircle, Send, Minimize2, Maximize2, Copy, Trash2 } from 'lucide-react'
import { authStorage } from '@/lib/auth'

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 100 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [user, setUser] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const currentUser = authStorage.getUser()
    setUser(currentUser)
  }, [])
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! I\'m your AI Learning Assistant. Ask me anything about coding, algorithms, interview prep, or your learning journey!', sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleMouseDown = (e) => {
    if (e.target.closest('[data-no-drag]')) return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { id: Date.now(), text: input, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    const userInput = input
    setInput('')
    setLoading(true)

    try {
      console.log('[v0] Sending message:', userInput)
      const response = await fetch('/api/gemini/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput, context: 'learning' })
      })

      console.log('[v0] Response status:', response.status)
      const data = await response.json()
      console.log('[v0] Response data:', data)

      if (!response.ok || !data.reply) {
        throw new Error(data.error || 'No response received')
      }

      const botMessage = {
        id: Date.now() + 1,
        text: data.reply,
        sender: 'bot'
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('[v0] Chatbot error:', error)
      const fallbackResponses = [
        'Great question! Can you give me more details? What specifically are you confused about?',
        'Good question! Let me help. What part would you like to understand first?',
        'I understand! The simple way to think about this: Learn the basics first, then practice with examples. What would help you most?',
        'That\'s a common question! The key is: Read, code, repeat. What do you want to try first?',
        'Nice question! Step 1: Understand the concept. Step 2: Write code. Step 3: Fix errors and learn. Where are you stuck?'
      ]
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      
      const botMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'bot'
      }
      setMessages(prev => [...prev, botMessage])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([
      { id: 1, text: 'Chat cleared! How can I help you today?', sender: 'bot' }
    ])
  }

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text)
  }

  // Only show chatbot if user is logged in
  if (!mounted || !user) return null

  return (
    <div
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        zIndex: 9999,
      }}
      className="select-none"
    >
      {isOpen ? (
        <Card 
          className={`bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 border border-violet-500/40 flex flex-col rounded-2xl shadow-2xl transition-all ${
            isMinimized ? 'w-80 h-auto' : 'w-96 h-[600px]'
          }`}
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
        >
          <div className="flex items-center justify-between p-4 border-b border-violet-500/20 bg-gradient-to-r from-violet-900/30 to-purple-900/30" data-no-drag>
            <div>
              <h3 className="text-white font-bold text-lg">CodeMentor AI</h3>
              <p className="text-xs text-violet-300">Your Learning Assistant</p>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-violet-500/20 text-violet-400 hover:text-violet-300"
                data-no-drag
              >
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="hover:bg-red-500/20 text-red-400 hover:text-red-300"
                data-no-drag
              >
                <X size={18} />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} group`}>
                    <div className={`max-w-xs px-4 py-3 rounded-xl transition-all ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-none shadow-lg'
                        : 'bg-slate-800 text-slate-100 border border-violet-500/30 rounded-bl-none'
                    }`}>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap break-words prose prose-sm prose-invert max-w-none">
                        {msg.text.split('\n').map((line, idx) => (
                          <p key={idx} className="m-0 mb-1 last:mb-0">{line}</p>
                        ))}
                      </div>
                      {msg.sender === 'bot' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyMessage(msg.text)}
                          className="opacity-0 group-hover:opacity-100 mt-2 h-6 text-xs text-violet-300 hover:text-violet-100"
                          data-no-drag
                        >
                          <Copy size={14} className="mr-1" /> Copy
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 text-slate-100 border border-cyan-500/30 px-4 py-3 rounded-xl rounded-bl-none">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-violet-500/20 p-3 space-y-2 bg-slate-900/50" data-no-drag>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-slate-800 text-white placeholder-slate-400 px-3 py-2 rounded-lg border border-violet-500/20 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={loading || !input.trim()}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg"
                    data-no-drag
                  >
                    <Send size={18} />
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearChat}
                  className="w-full text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                  data-no-drag
                >
                  <Trash2 size={14} className="mr-1" /> Clear Chat
                </Button>
              </div>
            </>
          )}
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-2xl hover:shadow-violet-500/50 transition-all flex items-center justify-center group"
          data-no-drag
        >
          <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
        </Button>
      )}
    </div>
  )
}
