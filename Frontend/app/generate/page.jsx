"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authStorage, roadmapStorage } from "@/lib/auth"

export default function GeneratePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [topic, setTopic] = useState("")
  const [duration, setDuration] = useState("28 days")
  const [level, setLevel] = useState("Beginner")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quotaMessage, setQuotaMessage] = useState('')

  useEffect(() => {
    const currentUser = authStorage.getUser()
    if (!currentUser) {
      router.push("/login")
    }
    setUser(currentUser)
  }, [router])

  const generateRoadmap = async (e) => {
    e.preventDefault()
    setError('')
    setQuotaMessage('')
    setLoading(true)

    try {
      if (!topic.trim()) {
        setError('Please enter a topic to learn')
        setLoading(false)
        return
      }

      console.log('[v0] Generating day-wise roadmap for:', topic)
      
      // Call the day-wise roadmap generator API
      const response = await fetch('/api/gemini/generate-daywise-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, duration, level }),
      })

      const daywiseRoadmap = await response.json()
      console.log('[v0] Day-wise roadmap generated:', daywiseRoadmap)

      // Check for quota exceeded message
      if (daywiseRoadmap.quotaExceeded) {
        setQuotaMessage('Using pre-generated roadmap. API quota will reset tomorrow. You can still learn effectively!')
        console.warn('[v0] Using fallback roadmap due to quota')
      }

      // Save the roadmap with day-wise structure
      const roadmap = {
        title: `${topic} - ${duration} Learning Roadmap`,
        description: `A structured ${duration} course to master ${topic}`,
        topic,
        duration,
        level,
        days: daywiseRoadmap.roadmap || [],
        createdAt: new Date().toISOString(),
        completed: false,
        quotaExceeded: daywiseRoadmap.quotaExceeded || false,
      }

      if (!roadmap.days || roadmap.days.length === 0) {
        setError('Failed to generate roadmap. Please try again later.')
        setLoading(false)
        return
      }

      const saved = roadmapStorage.saveRoadmap(roadmap)
      console.log('[v0] Roadmap saved:', saved.id)
      
      // Show success message and navigate
      if (quotaMessage) {
        alert(quotaMessage)
      }
      router.push(`/roadmap/${saved.id}`)
    } catch (err) {
      console.error('[v0] Error generating roadmap:', err)
      setError('Error generating roadmap. Please try again.')
    } finally {
      setLoading(false)
    }
  }



  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Generate Your Roadmap</h1>
          <p className="text-muted-foreground mb-8">
            Tell us what you want to learn and we'll create a personalized roadmap with topics, reading materials, and
            exams
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Roadmap Details</CardTitle>
              <CardDescription>Customize your learning path</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              {quotaMessage && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 font-medium">{quotaMessage}</p>
                </div>
              )}

              <form onSubmit={generateRoadmap} className="space-y-6">
                <div>
                  <label className="text-sm font-medium">What do you want to learn?</label>
                  <Input
                    placeholder="e.g., Python, JavaScript, Web Development, Machine Learning"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option>7 days</option>
                      <option>14 days</option>
                      <option>21 days</option>
                      <option>28 days</option>
                      <option>30 days</option>
                      <option>60 days</option>
                      <option>90 days</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading || !topic}>
                  {loading ? "Generating..." : "Generate Roadmap"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
