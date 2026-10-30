'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { authStorage } from '@/lib/auth'
import { 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  Search, 
  Clock, 
  Bookmark, 
  Compass, 
  Star,
  GraduationCap
} from 'lucide-react'

export default function ResourcesPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState('beginner')
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchHistory, setSearchHistory] = useState([])

  useEffect(() => {
    const currentUser = authStorage.getUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)
    loadSearchHistory()
  }, [router])

  const loadSearchHistory = () => {
    const saved = localStorage.getItem('resource-history')
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleGetRecommendations = async (overrideTopic) => {
    const activeTopic = overrideTopic || topic
    if (!activeTopic.trim()) {
      setError('Please enter a topic to search')
      return
    }

    setLoading(true)
    setError(null)
    setResources([])

    try {
      const response = await fetch('/api/gemini/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: activeTopic, level })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }

      const recs = await response.json()
      setResources(Array.isArray(recs) ? recs : [])
      
      const newHistory = [{ topic: activeTopic, level, date: new Date().toLocaleDateString() }, ...searchHistory.filter(h => h.topic !== activeTopic)].slice(0, 8)
      setSearchHistory(newHistory)
      localStorage.setItem('resource-history', JSON.stringify(newHistory))
    } catch (err) {
      setError('Error fetching recommendations: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Loading Learning Resources...
        </div>
      </div>
    )
  }

  const starterTopics = ["React & Next.js", "Python Fullstack", "DSA & Algorithms", "System Design", "TypeScript Masterclass"]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>AI Resource Curator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Curated Learning Resources</h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            AI-curated tutorials, official documentation, interactive courses, and books matched specifically to your skill tier.
          </p>
        </div>

        {/* Search Panel */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur shadow-xl shadow-indigo-950/10 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Topic or Technology
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Next.js App Router, Docker, Rust, Graph Algorithms..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGetRecommendations()}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Target Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="beginner">Beginner (Foundations)</option>
                <option value="intermediate">Intermediate (Hands-on)</option>
                <option value="advanced">Advanced (Production)</option>
              </select>
            </div>
          </div>

          {/* Quick Starter Chips */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-xs text-slate-500">Popular:</span>
            {starterTopics.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setTopic(item)
                  handleGetRecommendations(item)
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs border border-slate-700/60 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 text-xs">
              {error}
            </div>
          )}

          <Button
            onClick={() => handleGetRecommendations()}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Curating Best Resources with AI...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Find Recommended Materials</span>
              </div>
            )}
          </Button>
        </div>

        {/* Resources Grid */}
        {resources.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              Recommendations for "{topic}"
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {resources.map((res, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700 p-5 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-base font-bold text-white">{res.title}</h3>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 uppercase">
                        {res.type || 'Guide'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                      {res.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 mt-auto">
                    <span className="text-[11px] text-slate-500">{res.platform || 'Recommended Source'}</span>
                    <a
                      href={res.url || `https://www.google.com/search?q=${encodeURIComponent(res.title + ' ' + topic)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
                    >
                      <span>Explore</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTopic(item.topic)
                    setLevel(item.level || 'beginner')
                    handleGetRecommendations(item.topic)
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
                >
                  <span className="font-medium text-white">{item.topic}</span>
                  <span className="text-slate-500 ml-1.5 text-[10px]">({item.level})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
