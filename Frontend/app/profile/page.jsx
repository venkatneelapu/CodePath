'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { authStorage, roadmapStorage, streakStorage, progressStorage } from '@/lib/auth'
import { Share2, Edit2, Check, X, Flame, Target, BookOpen, Award, Copy } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [streak, setStreak] = useState(0)
  const [stats, setStats] = useState({
    problemsSolved: 0,
    coursesCompleted: 1,
    quizzesPassed: 0,
  })
  const [progressData, setProgressData] = useState([])

  useEffect(() => {
    async function loadProfileData() {
      try {
        // Fetch user profile
        const profileRes = await fetch('/api/users/profile')
        if (!profileRes.ok) {
          router.push('/login')
          return
        }
        const profileJson = await profileRes.json()
        const currentUser = profileJson.data

        setUser(currentUser)
        setEditData(currentUser)
        setProfilePhoto(currentUser.avatar_url || currentUser.profilePhoto)

        // Fetch gamification stats
        const statsRes = await fetch('/api/gamification/stats')
        if (statsRes.ok) {
          const statsJson = await statsRes.json()
          setStreak(statsJson.data.streak.current)
          setStats({
            problemsSolved: statsJson.data.points || 0,
            coursesCompleted: statsJson.data.level || 1,
            quizzesPassed: statsJson.data.badges?.length || 0,
          })
        }

        // Fetch progress instead of local storage activities
        const progressRes = await fetch('/api/users/progress')
        if (progressRes.ok) {
          const progressJson = await progressRes.json()
          setProgressData(progressJson.data.roadmaps || [])
        }
      } catch (err) {
        console.error('Error loading profile:', err)
      }
    }
    
    loadProfileData()
  }, [router])

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const photoUrl = event.target?.result
        setProfilePhoto(photoUrl)
        setEditData((prev) => ({ ...prev, profilePhoto: photoUrl }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editData.name,
          bio: editData.bio,
          location: editData.location,
          phone: editData.phone,
          website: editData.website,
        })
      })
      if (res.ok) {
        const json = await res.json()
        setUser(json.data)
        setIsEditing(false)
      }
    } catch (err) {
      console.error('Failed to update profile:', err)
    }
  }

  const handleCancel = () => {
    setEditData(user)
    setProfilePhoto(user.profilePhoto)
    setIsEditing(false)
  }

  const copyProfileLink = () => {
    const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/public-profile/${user?.id}`
    navigator.clipboard.writeText(profileUrl)
  }



  if (!user) return <div>Loading...</div>

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="container mx-auto">
          {/* Profile Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-4xl font-bold text-white">My Profile</h1>
              <div className="flex gap-2">
                {!isEditing && (
                  <>
                    <Button onClick={copyProfileLink} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700">
                      <Share2 size={18} /> Share Profile
                    </Button>
                    <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                      <Edit2 size={18} /> Edit Profile
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Card */}
            <Card className="glass-card border border-violet-500/30 p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Photo Section */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center mb-4 overflow-hidden border-4 border-violet-500">
                    {profilePhoto ? (
                      <img src={profilePhoto || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-4xl text-white font-bold">{user.name?.charAt(0).toUpperCase()}</div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="cursor-pointer">
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      <Button className="bg-violet-600 hover:bg-violet-700 text-white text-sm">Change Photo</Button>
                    </label>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-slate-400 block mb-1">Name</label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => handleEditChange('name', e.target.value)}
                          className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-violet-500/30 focus:outline-none focus:border-violet-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 block mb-1">Bio</label>
                        <textarea
                          value={editData.bio || ''}
                          onChange={(e) => handleEditChange('bio', e.target.value)}
                          className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-violet-500/30 focus:outline-none focus:border-violet-500"
                          rows={3}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-slate-400 block mb-1">Location</label>
                          <input
                            type="text"
                            value={editData.location || ''}
                            onChange={(e) => handleEditChange('location', e.target.value)}
                            className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-violet-500/30 focus:outline-none focus:border-violet-500"
                            placeholder="City, Country"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 block mb-1">Phone</label>
                          <input
                            type="tel"
                            value={editData.phone || ''}
                            onChange={(e) => handleEditChange('phone', e.target.value)}
                            className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-violet-500/30 focus:outline-none focus:border-violet-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 block mb-1">Website</label>
                        <input
                          type="url"
                          value={editData.website || ''}
                          onChange={(e) => handleEditChange('website', e.target.value)}
                          className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-violet-500/30 focus:outline-none focus:border-violet-500"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                          <Check size={18} /> Save
                        </Button>
                        <Button onClick={handleCancel} variant="outline" className="border-violet-500/30 text-violet-300 hover:bg-violet-500/20 flex items-center gap-2 bg-transparent">
                          <X size={18} /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-3xl font-bold text-white">{user.name}</p>
                        <p className="text-violet-300">{user.email}</p>
                      </div>
                      {user.bio && <p className="text-slate-300">{user.bio}</p>}
                      <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
                        {user.location && <span>{user.location}</span>}
                        {user.phone && <span>{user.phone}</span>}
                        {user.website && (
                          <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-violet-300 hover:underline">
                            {user.website}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

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
                    <p className="text-slate-400 text-sm font-semibold">POINTS</p>
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
                    <p className="text-slate-400 text-sm font-semibold">BADGES</p>
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
                    <p className="text-slate-400 text-sm font-semibold">LEVEL</p>
                    <p className="text-4xl font-bold text-purple-400 mt-2">{stats.coursesCompleted}</p>
                  </div>
                  <Award className="text-purple-400" size={40} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Roadmap Progress */}
          <Card className="glass-card border border-violet-500/30">
            <CardHeader>
              <CardTitle className="text-white text-xl">Recent Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {progressData.length > 0 ? (
                <div className="space-y-4">
                  {progressData.map((progress) => (
                    <div key={progress.roadmap_id} className="flex items-center gap-4 pb-4 border-b border-violet-500/20 last:border-0 last:pb-0">
                      <div className="w-12 h-12 rounded-lg bg-violet-600/30 flex items-center justify-center flex-shrink-0">
                        <Target size={24} className="text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-white font-medium">{progress.title}</p>
                          <span className="text-xs text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded-full">
                            {progress.completion_percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${progress.completion_percentage}%` }}
                          />
                        </div>
                        <p className="text-slate-400 text-xs mt-2">
                          {progress.completed_modules} / {progress.total_modules} Modules Completed
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">No progress yet. Start learning to build your streak!</p>
              )}
            </CardContent>
          </Card>


        </div>
      </main>
    </>
  )
}
