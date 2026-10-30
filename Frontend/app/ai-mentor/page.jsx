'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { authStorage } from '@/lib/auth'
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Code, 
  Terminal, 
  Check, 
  Copy, 
  RefreshCw,
  Lightbulb,
  Cpu
} from 'lucide-react'

export default function MentorPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am your AI Coding Mentor. Ask me any conceptual question, ask for code reviews, debug errors, or get deep explanations of data structures and algorithms.",
      createdAt: 'Just now'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const chatBottomRef = useRef(null)

  useEffect(() => {
    const currentUser = authStorage.getUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)
  }, [router])

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const starterPrompts = [
    { title: "Explain Event Loop", topic: "JavaScript", query: "Explain how JavaScript event loop, microtasks, and macrotasks work with a quick code example." },
    { title: "Binary Search & Big-O", topic: "Algorithms", query: "Can you explain Binary Search algorithm, its time complexity (O(log n)), and when to use it?" },
    { title: "React State Pitfalls", topic: "React", query: "What are the common pitfalls with asynchronous state updates in React and how do I avoid stale closures?" },
    { title: "Python List Comprehensions", topic: "Python", query: "Show me idiomatic Python list comprehensions, dictionary comprehensions, and when to avoid them." }
  ]

  const handleSendMessage = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : input
    if (!query.trim() || loading) return

    const userMessage = { 
      id: Date.now(), 
      text: query.trim(), 
      sender: 'user',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/gemini/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, context: topic })
      })

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const data = await response.json()
      
      const botMessage = { 
        id: Date.now() + 1, 
        text: data.reply || 'I am ready to help. Please try asking again!', 
        sender: 'bot',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Mentor chat error:', error)
      const errorMessage = { 
        id: Date.now() + 1, 
        text: `I ran into an issue connecting to the AI mentor engine. Let's try again in a moment!`, 
        sender: 'bot',
        isError: true,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Loading AI Mentor...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>24/7 AI Pair Programmer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Learning Mentor</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Ask coding doubts, get step-by-step guidance, and debug technical concepts in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Topic Focus:</span>
            <input
              type="text"
              placeholder="e.g. React, Python, DSA"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Starter Prompts */}
        {messages.length <= 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {starterPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTopic(p.topic)
                  handleSendMessage(p.query)
                }}
                className="text-left p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
                  <Lightbulb className="w-3.5 h-3.5 group-hover:text-indigo-300" />
                  {p.title}
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                  {p.query}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Chat Messages Container */}
        <div className="flex-1 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 sm:p-6 mb-4 overflow-y-auto max-h-[58vh] min-h-[380px] space-y-5">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user'
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className={`relative max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                  isUser 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm shadow-md' 
                    : msg.isError
                      ? 'bg-rose-950/40 border border-rose-800/50 text-rose-200 rounded-tl-sm'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-sm shadow-sm'
                }`}>
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1 border-b border-white/10 text-[11px] opacity-75">
                    <span className="font-semibold">{isUser ? user?.name || 'You' : 'Mentor AI'}</span>
                    <span>{msg.createdAt}</span>
                  </div>

                  {/* Render content */}
                  <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                    {msg.text}
                  </div>

                  {!isUser && !msg.isError && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-end">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-[11px] text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Answer</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-xs font-bold text-slate-300">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            )
          })}

          {loading && (
            <div className="flex gap-3 sm:gap-4 justify-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-slate-900/90 border border-slate-800 px-4 py-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-400 ml-1">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Ask mentor anything (e.g., How do I reverse a linked list?)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage()
              }
            }}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all font-medium disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </Button>
        </div>
      </main>
    </div>
  )
}
