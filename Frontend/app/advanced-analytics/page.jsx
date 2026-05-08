'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authStorage, roadmapStorage } from '@/lib/auth'

export default function AdvancedAnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalProblems: 0,
    solvedProblems: 0,
    quizzesCompleted: 0,
    averageScore: 0,
    roadmapsCreated: 0,
    roadmapsCompleted: 0,
    totalLearningHours: 0,
    streakDays: 0,
  })
  const [roadmaps, setRoadmaps] = useState([])
  const [insights, setInsights] = useState([])

  useEffect(() => {
    const currentUser = authStorage.getUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)
    loadAnalytics()
  }, [router])

  const loadAnalytics = () => {
    // Get roadmaps
    const allRoadmaps = roadmapStorage.getRoadmaps()
    setRoadmaps(allRoadmaps)

    // Calculate stats from localStorage
    const savedStats = localStorage.getItem(`user-stats-${user?.id}`) || '{}'
    const userStats = JSON.parse(savedStats)

    const completed = allRoadmaps.filter(r => r.progress === 100).length
    const avgScore = localStorage.getItem(`avg-quiz-score-${user?.id}`) || 0

    const calculatedStats = {
      totalProblems: userStats.totalProblems || 0,
      solvedProblems: userStats.solvedProblems || 0,
      quizzesCompleted: userStats.quizzesCompleted || 0,
      averageScore: Math.round(avgScore),
      roadmapsCreated: allRoadmaps.length,
      roadmapsCompleted: completed,
      totalLearningHours: allRoadmaps.reduce((sum, r) => sum + (r.duration || 0), 0),
      streakDays: userStats.streakDays || 0,
    }

    setStats(calculatedStats)
    generateInsights(calculatedStats, allRoadmaps)
  }

  const generateInsights = (stats, roadmaps) => {
    const newInsights = []

    if (stats.solvedProblems > 50) {
      newInsights.push({
        type: 'achievement',
        message: 'Great job! You\'ve solved over 50 problems!',
        icon: '🎉',
      })
    }

    if (stats.roadmapsCompleted > 0) {
      newInsights.push({
        type: 'success',
        message: `You've completed ${stats.roadmapsCompleted} roadmap(s)!`,
        icon: '✅',
      })
    }

    if (stats.averageScore >= 80) {
      newInsights.push({
        type: 'strong',
        message: 'Your quiz scores are excellent!',
        icon: '⭐',
      })
    }

    if (roadmaps.filter(r => r.progress < 100 && r.progress > 0).length > 2) {
      newInsights.push({
        type: 'focus',
        message: 'You have multiple roadmaps in progress. Consider focusing on one to completion.',
        icon: '💡',
      })
    }

    if (stats.streakDays >= 7) {
      newInsights.push({
        type: 'streak',
        message: `You have a ${stats.streakDays}-day learning streak!`,
        icon: '🔥',
      })
    }

    setInsights(newInsights)
  }

  if (!user) return <div>Loading...</div>

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Learning Analytics</h1>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Problems Solved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats.solvedProblems}</div>
              <p className="text-xs text-muted-foreground mt-1">of {stats.totalProblems} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quizzes Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats.quizzesCompleted}</div>
              <p className="text-xs text-muted-foreground mt-1">Average: {stats.averageScore}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Roadmaps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats.roadmapsCompleted}/{stats.roadmapsCreated}</div>
              <p className="text-xs text-muted-foreground mt-1">completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Learning Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats.totalLearningHours}</div>
              <p className="text-xs text-muted-foreground mt-1">total invested</p>
            </CardContent>
          </Card>
        </div>

        {insights.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Personal Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <span className="text-xl">{insight.icon}</span>
                    <p className="text-sm">{insight.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Roadmap Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roadmaps.length === 0 ? (
                <p className="text-muted-foreground text-center">No roadmaps yet. Start your learning journey!</p>
              ) : (
                roadmaps.map(roadmap => (
                  <div key={roadmap.id}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{roadmap.title}</span>
                      <span className="text-sm text-muted-foreground">{roadmap.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all"
                        style={{ width: `${roadmap.progress}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
