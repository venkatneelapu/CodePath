'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authStorage, streakStorage } from '@/lib/auth'
import { Flame, Target, Award, BookOpen, Calendar } from 'lucide-react'

export default function PublicProfilePage() {
  const params = useParams()
  const [user, setUser] = useState(null)
  const [streak, setStreak] = useState(0)
  const [activities, setActivities] = useState([])
  const [stats, setStats] = useState({ problemsSolved: 0, coursesCompleted: 0, quizzesPassed: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params.userId) return

    const profileUser = authStorage.getUserById(params.userId)
    if (!profileUser) {
      setLoading(false)
      return
    }

    setUser(profileUser)

    // Load streak and activities
    const userStreak = streakStorage.getStreak(profileUser.id)
    setStreak(userStreak)

    const userActivities = streakStorage.getActivities(profileUser.id, 20)
    setActivities(userActivities)

    // Load stats
    const activityStats = streakStorage.getActivityStats(profileUser.id)
    setStats(activityStats)

    setLoading(false)
  }, [params.userId])

  if (loading) return <div className="text-white">Loading...</div>
  if (!user) return <div className="text-white">Profile not found</div>

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="container mx-auto">
          {/* Profile Header */}
          <Card className="glass-card border border-violet-500/30 p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Photo Section */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-violet-500">
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-4xl text-white font-bold">{user.name?.charAt(0).toUpperCase()}</div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="space-y-3">
                  <div>
                    <p className="text-3xl font-bold text-white">{user.name}</p>
                    <p className="text-violet-300">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  {user.bio && <p className="text-slate-300">{user.bio}</p>}
                  <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
                    {user.location && <span className="flex items-center gap-1"><Calendar size={14} /> {user.location}</span>}
                    {user.website && (
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-violet-300 hover:underline">
                        {user.website}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card border border-red-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-semibold">STREAK</p>
                    <p className="text-4xl font-bold text-red-400 mt-2">{streak}</p>
                    <p className="text-xs text-slate-500 mt-1">days</p>
                  </div>
                  <Flame className="text-red-400" size={40} />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border border-blue-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-semibold">PROBLEMS SOLVED</p>
                    <p className="text-4xl font-bold text-blue-400 mt-2">{stats.problemsSolved}</p>
                  </div>
                  <Target className="text-blue-400" size={40} />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border border-green-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-semibold">QUIZZES PASSED</p>
                    <p className="text-4xl font-bold text-green-400 mt-2">{stats.quizzesPassed}</p>
                  </div>
                  <Award className="text-green-400" size={40} />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border border-purple-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-semibold">COURSES COMPLETED</p>
                    <p className="text-4xl font-bold text-purple-400 mt-2">{stats.coursesCompleted}</p>
                  </div>
                  <BookOpen className="text-purple-400" size={40} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity History */}
          <Card className="glass-card border border-violet-500/30">
            <CardHeader>
              <CardTitle className="text-white text-xl">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 pb-3 border-b border-violet-500/20 last:border-0">
                      <div className="w-10 h-10 rounded-full bg-violet-600/30 flex items-center justify-center flex-shrink-0">
                        {activity.type === 'problem_solved' && <Target size={20} className="text-blue-400" />}
                        {activity.type === 'quiz_passed' && <Award size={20} className="text-green-400" />}
                        {activity.type === 'course_completed' && <BookOpen size={20} className="text-purple-400" />}
                        {activity.type === 'learning' && <BookOpen size={20} className="text-cyan-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium capitalize">
                          {activity.type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {new Date(activity.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">No activities yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
