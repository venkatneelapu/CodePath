"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { authStorage, progressStorage } from "@/lib/auth"
import Header from "@/components/header"

export default function AnalyticsPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState(null)
  const [user, setUser] = useState(null)
  const [selectedRoadmap, setSelectedRoadmap] = useState(null)

  useEffect(() => {
    const currentUser = authStorage.getUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    const data = progressStorage.getStudentAnalytics(currentUser.id)
    setAnalytics(data)
  }, [router])

  if (!analytics || !user) {
    return <div className="p-8 text-center">Loading analytics...</div>
  }

  const roadmapStats = analytics.roadmaps.map((roadmap) => {
    const roadmapQuizzes = analytics.quizScores.filter((q) => q.roadmapId === roadmap.id)
    const roadmapChallenges = analytics.completions.filter((c) => c.roadmapId === roadmap.id)
    const avgScore =
      roadmapQuizzes.length > 0
        ? Math.round(roadmapQuizzes.reduce((sum, q) => sum + q.percentage, 0) / roadmapQuizzes.length)
        : 0

    return {
      ...roadmap,
      quizCount: roadmapQuizzes.length,
      challengeCount: roadmapChallenges.length,
      averageScore: avgScore,
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Learning Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive tracking of your learning progress</p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active Roadmaps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{analytics.totalRoadmaps}</div>
                <p className="text-xs text-muted-foreground mt-1">Learning paths started</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Average Quiz Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{analytics.averageQuizScore}%</div>
                <p className="text-xs text-muted-foreground mt-1">Based on {analytics.quizScores.length} quizzes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Challenges Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{analytics.totalChallengesCompleted}</div>
                <p className="text-xs text-muted-foreground mt-1">Coding problems solved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Learning Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{Math.round(analytics.totalTimeSpent / 60)}h</div>
                <p className="text-xs text-muted-foreground mt-1">Hours spent learning</p>
              </CardContent>
            </Card>
          </div>

          {/* Roadmap Performance */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Roadmap Performance</CardTitle>
              <CardDescription>Detailed statistics for each learning path</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roadmapStats.map((roadmap) => (
                  <div key={roadmap.id} className="border rounded-lg p-4 hover:bg-muted transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{roadmap.title}</h3>
                        <p className="text-sm text-muted-foreground">{roadmap.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{roadmap.progress}%</div>
                        <p className="text-xs text-muted-foreground">Progress</p>
                      </div>
                    </div>

                    <div className="w-full bg-muted rounded-full h-2 mb-4">
                      <div
                        className="bg-accent h-2 rounded-full transition-all"
                        style={{ width: `${roadmap.progress}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Quizzes Taken</p>
                        <p className="font-semibold text-lg">{roadmap.quizCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Quiz Score</p>
                        <p className="font-semibold text-lg text-accent">{roadmap.averageScore}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Challenges Done</p>
                        <p className="font-semibold text-lg">{roadmap.challengeCount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quiz Performance Timeline */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quiz Performance Timeline</CardTitle>
              <CardDescription>Your quiz scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.quizScores.length > 0 ? (
                <div className="space-y-3">
                  {analytics.quizScores.map((quiz, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <div>
                        <p className="font-semibold">Quiz {idx + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(quiz.completedAt).toLocaleDateString()} at{" "}
                          {new Date(quiz.completedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{quiz.percentage}%</div>
                        <p className="text-sm text-muted-foreground">
                          {quiz.score}/{quiz.totalQuestions}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No quizzes completed yet</p>
              )}
            </CardContent>
          </Card>

          {/* Challenge Completions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Challenge Completions</CardTitle>
              <CardDescription>Your coding challenge progress</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.completions.length > 0 ? (
                <div className="space-y-3">
                  {analytics.completions.map((completion, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <div>
                        <p className="font-semibold">Challenge {idx + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(completion.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-accent">Completed</p>
                        <p className="text-xs text-muted-foreground">{completion.timeSpent || 0} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No challenges completed yet</p>
              )}
            </CardContent>
          </Card>

          {/* Learning Statistics */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Learning Statistics</CardTitle>
              <CardDescription>Summary of your learning activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Activity Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Study Sessions</span>
                      <span className="font-semibold">
                        {analytics.quizScores.length + analytics.completions.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Session Duration</span>
                      <span className="font-semibold">
                        {analytics.totalChallengesCompleted > 0
                          ? Math.round(analytics.totalTimeSpent / analytics.totalChallengesCompleted)
                          : 0}{" "}
                        min
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-semibold">
                        {analytics.totalRoadmaps > 0
                          ? Math.round(
                              (analytics.roadmaps.reduce((sum, r) => sum + r.progress, 0) /
                                analytics.totalRoadmaps /
                                100) *
                                100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Best Quiz Score</span>
                      <span className="font-semibold text-accent">
                        {analytics.quizScores.length > 0
                          ? Math.max(...analytics.quizScores.map((q) => q.percentage))
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lowest Quiz Score</span>
                      <span className="font-semibold">
                        {analytics.quizScores.length > 0
                          ? Math.min(...analytics.quizScores.map((q) => q.percentage))
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Challenges Success Rate</span>
                      <span className="font-semibold text-accent">
                        {analytics.totalChallengesCompleted > 0 ? "100%" : "0%"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={() => router.push("/dashboard")} className="flex-1">
              Back to Dashboard
            </Button>
            <Button onClick={() => router.push("/explore")} variant="outline" className="flex-1">
              Explore More Roadmaps
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
