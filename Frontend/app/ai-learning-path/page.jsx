'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authStorage, roadmapStorage } from '@/lib/auth'


export default function AILearningPathPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState('beginner')
  const [duration, setDuration] = useState('14')
  const [loading, setLoading] = useState(false)
  const [generatedPath, setGeneratedPath] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const currentUser = authStorage.getUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)
  }, [router])

  const handleGeneratePath = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }

    setLoading(true)
    setError(null)
    setGeneratedPath(null)

    try {
      const response = await fetch('/api/gemini/learning-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level, duration: parseInt(duration) })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || 'Failed to generate learning path');
      }

      const path = await response.json()
      setGeneratedPath(path)
    } catch (err) {
      setError('Error generating path: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveRoadmap = async () => {
    if (!generatedPath) return

    try {
      const response = await fetch('/api/roadmaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedPath.title || topic,
          description: generatedPath.description || `AI generated learning path for ${topic}`,
          topic: topic,
          duration_days: parseInt(duration) || 14,
          modules: generatedPath.modules || generatedPath.roadmap || [],
        })
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/roadmap/${data.data._id}`)
      } else {
        setError('Failed to save roadmap')
      }
    } catch (err) {
      setError('Error saving roadmap: ' + err.message)
    }
  }

  if (!user) return <div>Loading...</div>

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">AI Learning Path Generator</h1>
            <p className="text-muted-foreground">Generate personalized learning roadmaps powered by AI</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Generate Your Learning Path</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">What do you want to learn?</label>
                <input
                  type="text"
                  placeholder="e.g., Web Development with React, Python Machine Learning, Data Structures..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium mb-2">Duration (days)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <Button
                onClick={handleGeneratePath}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Generating Path...' : 'Generate Learning Path'}
              </Button>
            </CardContent>
          </Card>

          {generatedPath && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{generatedPath.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">{generatedPath.description}</p>
                  </div>
                  <Button onClick={handleSaveRoadmap} className="ml-4">
                    Save Roadmap
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium">Total Duration: </span>
                    <span className="text-sm">{generatedPath.totalDays || duration} days</span>
                  </div>

                  {generatedPath.modules && generatedPath.modules.length > 0 && (
                    <div>
                      <h3 className="font-bold mb-3">Learning Modules</h3>
                      <div className="space-y-3">
                        {generatedPath.modules.map((module, index) => (
                          <Card key={index} className="border">
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-bold">{module.title}</div>
                                  <div className="text-sm text-muted-foreground">Duration: {module.duration || 0} day(s)</div>
                                  {module.topics && module.topics.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {module.topics.map((topic, i) => (
                                        <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                                          {topic}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs bg-accent text-white px-2 py-1 rounded">
                                  {module.type || 'learning'}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  )
}
