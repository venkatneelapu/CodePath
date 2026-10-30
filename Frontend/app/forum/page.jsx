'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { authStorage } from '@/lib/auth'
import { 
  MessageSquare, 
  Search, 
  Plus, 
  ThumbsUp, 
  Eye, 
  Send, 
  Tag, 
  Clock, 
  User, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react'

export default function ForumPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [threads, setThreads] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewThread, setShowNewThread] = useState(false)
  const [activeThreadId, setActiveThreadId] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [newThread, setNewThread] = useState({ 
    title: '', 
    category: 'general', 
    content: '' 
  })

  useEffect(() => {
    const currentUser = authStorage.getUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)
    loadThreads()
  }, [router])

  const loadThreads = () => {
    const saved = localStorage.getItem('forum-threads-v2')
    if (saved) {
      try {
        setThreads(JSON.parse(saved))
        return
      } catch (e) {
        console.error(e)
      }
    }

    const defaultThreads = [
      {
        id: 1,
        title: 'Best roadmap and tips for mastering React 19 & Next.js?',
        author: 'Alex Morgan',
        category: 'react',
        content: "I am building fullstack web apps and want to understand the best mental model for Server Components vs Client Components. Any advice or favorite resources?",
        repliesList: [
          {
            id: 101,
            author: 'Sarah Chen',
            text: 'Focus first on keeping state as close to the leaves as possible. Only mark components as "use client" when you need hooks or DOM listeners.',
            createdAt: '1 day ago'
          },
          {
            id: 102,
            author: 'DevNinja',
            text: 'Check out the official Next.js App Router docs and build small mock apps before a full production app. It helps solidify caching behaviors.',
            createdAt: '18 hours ago'
          }
        ],
        replies: 2,
        views: 312,
        likes: 18,
        createdAt: '2 days ago',
      },
      {
        id: 2,
        title: 'Python vs JavaScript for DSA and technical interviews',
        author: 'Marcus Lee',
        category: 'python',
        content: 'Which language gives you more speed and concise syntax during 45-minute live coding sessions? Would love to hear your real interview experiences.',
        repliesList: [
          {
            id: 201,
            author: 'Priya Sharma',
            text: 'Python is generally faster to write because of built-in heaps (heapq), sets, dicts, and slicing. JavaScript requires custom heap implementations unless provided by the platform.',
            createdAt: 'Yesterday'
          }
        ],
        replies: 1,
        views: 245,
        likes: 12,
        createdAt: '1 day ago',
      },
      {
        id: 3,
        title: 'How to prepare for Data Structures: Arrays to Dynamic Programming',
        author: 'Elena Rostova',
        category: 'data-structures',
        content: 'I struggled with graph traversals and DP memoization patterns. What was your breakthrough moment when studying these concepts?',
        repliesList: [],
        replies: 0,
        views: 180,
        likes: 9,
        createdAt: '3 hours ago',
      }
    ]
    setThreads(defaultThreads)
    localStorage.setItem('forum-threads-v2', JSON.stringify(defaultThreads))
  }

  const persistThreads = (updated) => {
    setThreads(updated)
    localStorage.setItem('forum-threads-v2', JSON.stringify(updated))
  }

  const handleCreateThread = (e) => {
    e.preventDefault()
    if (!newThread.title.trim() || !newThread.content.trim()) return

    const thread = {
      id: Date.now(),
      title: newThread.title.trim(),
      author: user?.name || 'Developer',
      category: newThread.category,
      content: newThread.content.trim(),
      repliesList: [],
      replies: 0,
      views: 1,
      likes: 1,
      createdAt: 'Just now',
    }

    const updated = [thread, ...threads]
    persistThreads(updated)
    setNewThread({ title: '', category: 'general', content: '' })
    setShowNewThread(false)
    setActiveThreadId(thread.id)
  }

  const handleUpvote = (threadId, e) => {
    e.stopPropagation()
    const updated = threads.map(t => {
      if (t.id === threadId) {
        return { ...t, likes: (t.likes || 0) + 1 }
      }
      return t
    })
    persistThreads(updated)
  }

  const handleAddReply = (threadId) => {
    if (!replyText.trim()) return

    const updated = threads.map(t => {
      if (t.id === threadId) {
        const newReply = {
          id: Date.now(),
          author: user?.name || 'Community Member',
          text: replyText.trim(),
          createdAt: 'Just now'
        }
        const updatedReplies = [...(t.repliesList || []), newReply]
        return {
          ...t,
          repliesList: updatedReplies,
          replies: updatedReplies.length,
          views: (t.views || 0) + 1
        }
      }
      return t
    })

    persistThreads(updated)
    setReplyText('')
  }

  const toggleThread = (threadId) => {
    if (activeThreadId === threadId) {
      setActiveThreadId(null)
    } else {
      setActiveThreadId(threadId)
      // Increment views count
      const updated = threads.map(t => 
        t.id === threadId ? { ...t, views: (t.views || 0) + 1 } : t
      )
      persistThreads(updated)
    }
  }

  const categories = [
    { value: 'all', label: 'All Topics' },
    { value: 'general', label: 'General' },
    { value: 'react', label: 'React & Next.js' },
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'data-structures', label: 'DSA & Algorithms' },
    { value: 'help', label: 'Help Wanted' },
  ]

  const filteredThreads = threads.filter(thread => {
    const matchesCategory = selectedCategory === 'all' || thread.category === selectedCategory
    const query = searchQuery.toLowerCase()
    const matchesSearch = !query || 
      thread.title.toLowerCase().includes(query) || 
      (thread.content && thread.content.toLowerCase().includes(query)) ||
      thread.author.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Loading Community Forum...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Hero Banner */}
        <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-800/80 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Peer Knowledge Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Community Forum
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
                Collaborate, ask coding questions, discuss technical interview strategies, and build together with fellow developers.
              </p>
            </div>
            <Button
              onClick={() => setShowNewThread(!showNewThread)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium shadow-lg shadow-indigo-500/20 px-5 py-2.5 rounded-xl flex items-center gap-2 self-start md:self-center transition-all"
            >
              {showNewThread ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showNewThread ? 'Close Form' : 'New Discussion'}
            </Button>
          </div>
        </div>

        {/* Create Thread Form */}
        {showNewThread && (
          <form 
            onSubmit={handleCreateThread}
            className="mb-8 rounded-2xl border border-indigo-500/40 bg-slate-900/90 backdrop-blur p-6 shadow-2xl transition-all"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              Start a New Discussion
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Discussion Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., How does JavaScript event loop handle Microtasks vs Macrotasks?"
                  value={newThread.title}
                  onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={newThread.category}
                    onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {categories.filter(c => c.value !== 'all').map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <p className="text-xs text-slate-400">
                    Posting as <span className="text-indigo-300 font-medium">{user.name}</span>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Message Content
                </label>
                <textarea
                  placeholder="Provide context, code snippets, or background so others can give actionable feedback..."
                  value={newThread.content}
                  onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                  rows={4}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewThread(false)}
                  className="border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 font-medium shadow-md shadow-indigo-600/30"
                >
                  Post Discussion
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search discussions by keyword, question, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Discussions List */}
        <div className="space-y-4">
          {filteredThreads.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-slate-800/60 bg-slate-900/30">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-300">No discussions found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No threads match your current filter or search criteria. Try a different query or start a new discussion!
              </p>
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const isOpen = activeThreadId === thread.id
              return (
                <div
                  key={thread.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen 
                      ? 'border-indigo-500/50 bg-slate-900/90 shadow-xl shadow-indigo-950/20' 
                      : 'border-slate-800/80 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700 cursor-pointer'
                  }`}
                  onClick={() => toggleThread(thread.id)}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase tracking-wide">
                            {thread.category}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {thread.createdAt}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {thread.title}
                        </h3>
                        {thread.content && (
                          <p className={`text-slate-400 text-sm mt-2 leading-relaxed ${!isOpen ? 'line-clamp-2' : ''}`}>
                            {thread.content}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-4 text-xs text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                              {thread.author?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-slate-300 font-medium">{thread.author}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats & Actions */}
                      <div className="flex flex-col items-end gap-2.5 shrink-0">
                        <button
                          onClick={(e) => handleUpvote(thread.id, e)}
                          title="Upvote discussion"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-300 border border-slate-700/60 hover:border-indigo-500/40 text-xs font-semibold transition-all"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{thread.likes || 0}</span>
                        </button>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1" title="Replies">
                            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                            {thread.replies || 0}
                          </span>
                          <span className="flex items-center gap-1" title="Views">
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            {thread.views || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Replies Section when Opened */}
                    {isOpen && (
                      <div 
                        className="mt-6 pt-6 border-t border-slate-800/80" 
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                          Discussion Replies ({thread.repliesList?.length || 0})
                        </h4>

                        {/* List of existing replies */}
                        <div className="space-y-3 mb-5">
                          {(!thread.repliesList || thread.repliesList.length === 0) ? (
                            <p className="text-xs text-slate-500 italic">No replies yet. Be the first to share your thoughts!</p>
                          ) : (
                            thread.repliesList.map((reply) => (
                              <div key={reply.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-sm">
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <div className="flex items-center gap-1.5 text-xs">
                                    <span className="font-semibold text-indigo-300">{reply.author}</span>
                                  </div>
                                  <span className="text-[11px] text-slate-500">{reply.createdAt}</span>
                                </div>
                                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{reply.text}</p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Reply Input Box */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Write your answer or feedback..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddReply(thread.id)
                              }
                            }}
                            className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                          <Button
                            onClick={() => handleAddReply(thread.id)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 rounded-xl flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
