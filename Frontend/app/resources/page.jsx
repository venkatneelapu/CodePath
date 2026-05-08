'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authStorage } from '@/lib/auth'


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
      setSearchHistory(JSON.parse(saved))
    }
  }

  const handleGetRecommendations = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }

    setLoading(true)
    setError(null)
    setResources([])

    try {
      const response = await fetch('/api/gemini/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level })
      })

      if (!response.ok) {
        throw new Error('Failed to get recommendations')
      }

      const recs = await response.json()
      setResources(recs)
      
      // Save to history
      const newHistory = [{ topic, level, date: new Date().toLocaleDateString() }, ...searchHistory].slice(0, 10)
      setSearchHistory(newHistory)
      localStorage.setItem('resource-history', JSON.stringify(newHistory))
    } catch (err) {
      setError('Error fetching recommendations: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePreviousSearch = (prevTopic, prevLevel) => {
    setTopic(prevTopic)
    setLevel(prevLevel)
  }

  if (!user) return <div>Loading...</div>

  const typeIcons = {
    book: '📕',
    course: '🎓',
    website: '🌐',
    tutorial: '📺',
    video: '🎬',
  }

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Learning Resources</h1>
            <p className="text-muted-foreground">AI-curated learning materials matched to your interests</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Find Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Topic</label>
                <input
                  type="text"
                  placeholder="e.g., React, Python, Data Structures..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleGetRecommendations()}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                <select
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                onClick={handleGetRecommendations}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Finding Resources...' : 'Get Recommendations'}
              </Button>
            </CardContent>
          </Card>

          {searchHistory.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Recent Searches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreviousSearch(item.topic, item.level)}
                    >
                      {item.topic}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {resources.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Recommended Resources</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {resources.map((resource, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-3xl">{typeIcons[resource.type] || '📚'}</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded ${difficultyColors[resource.difficulty] || 'bg-gray-100'}`}>
                          {resource.difficulty}
                        </span>
                      </div>
                      <h3 className="font-bold mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                      <div className="text-xs bg-muted px-2 py-1 rounded inline-block mb-4">
                        {resource.type}
                      </div>
                      {resource.url && (
                        <Button
                          asChild
                          size="sm"
                          className="w-full"
                        >
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            View Resource
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
