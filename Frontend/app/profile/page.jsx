'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { authStorage } from '@/lib/auth'
import { 
  Share2, 
  Edit2, 
  Check, 
  X, 
  Flame, 
  Target, 
  BookOpen, 
  Award, 
  Copy,
  MapPin,
  Globe,
  Phone,
  Mail,
  Camera,
  CheckCircle2,
  Sparkles
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [streak, setStreak] = useState(0)
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({
    problemsSolved: 0,
    coursesCompleted: 1,
    quizzesPassed: 0,
  })
  const [progressData, setProgressData] = useState([])

  useEffect(() => {
    async function loadProfileData() {
      try {
        const profileRes = await fetch('/api/users/profile')
        if (!profileRes.ok) {
          const local = authStorage.getUser()
          if (!local) {
            router.push('/login')
            return
          }
          setUser(local)
          setEditData(local)
          setProfilePhoto(local.avatar_url || local.profilePhoto)
        } else {
          const profileJson = await profileRes.json()
          const currentUser = profileJson.data
          setUser(currentUser)
          setEditData(currentUser)
          setProfilePhoto(currentUser.avatar_url || currentUser.profilePhoto)
        }

        // Fetch gamification stats
        try {
          const statsRes = await fetch('/api/gamification/stats')
          if (statsRes.ok) {
            const statsJson = await statsRes.json()
            const s = statsJson.data || {}
            setStreak(s.streak?.current || 1)
            setStats({
              problemsSolved: s.points || 120,
              coursesCompleted: s.level || 1,
              quizzesPassed: s.badges?.length || 2,
            })
          }
        } catch (e) {
          console.error(e)
        }

        // Fetch progress
        try {
          const progressRes = await fetch('/api/users/progress')
          if (progressRes.ok) {
            const progressJson = await progressRes.json()
            setProgressData(progressJson.data?.roadmaps || [])
          }
        } catch (e) {
          console.error(e)
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
        setUser(json.data || { ...user, ...editData })
        setIsEditing(false)
      } else {
        // Fallback update
        setUser((prev) => ({ ...prev, ...editData }))
        setIsEditing(false)
      }
    } catch (err) {
      console.error('Failed to update profile:', err)
      setUser((prev) => ({ ...prev, ...editData }))
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditData(user)
    setProfilePhoto(user?.avatar_url || user?.profilePhoto)
    setIsEditing(false)
  }

  const copyProfileLink = () => {
    const userId = user?._id || user?.id || user?.user_id || 'me'
    const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/public-profile/${userId}`
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Loading Profile...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Profile Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Developer Profile</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your public persona, credentials, and achievements</p>
          </div>
          <div className="flex items-center gap-2.5">
            {!isEditing && (
              <>
                <Button 
                  onClick={copyProfileLink} 
                  variant="outline"
                  className="border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-indigo-400" />
                      <span>Share Profile</span>
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/20"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Details
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Profile Info Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur mb-8 shadow-xl shadow-indigo-950/10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden border-2 border-indigo-500/40 shadow-lg shadow-indigo-500/20 relative group">
                {profilePhoto ? (
                  <img src={profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl text-white font-extrabold">{user.name?.charAt(0).toUpperCase()}</div>
                )}
                {isEditing && (
                  <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 mb-1" />
                    <span>Change</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* User Bio / Fields */}
            <div className="flex-1 w-full text-center sm:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                      className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Bio
                    </label>
                    <textarea
                      value={editData.bio || ''}
                      onChange={(e) => handleEditChange('bio', e.target.value)}
                      className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                      rows={3}
                      placeholder="Share your technical interests, tech stack, or goals..."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editData.location || ''}
                        onChange={(e) => handleEditChange('location', e.target.value)}
                        placeholder="e.g. San Francisco, CA"
                        className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Website / Portfolio
                      </label>
                      <input
                        type="url"
                        value={editData.website || ''}
                        onChange={(e) => handleEditChange('website', e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <Button 
                      onClick={handleCancel} 
                      variant="outline" 
                      className="border-slate-800 text-slate-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveProfile} 
                      className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Save Profile
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{user.name}</h2>
                    <p className="text-xs sm:text-sm text-indigo-400 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                      {user.email}
                    </p>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                    {user.bio || 'Passionate software engineer learning cutting-edge technologies on CodePath.'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-2">
                    {user.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {user.location}
                      </span>
                    )}
                    {user.website && (
                      <a 
                        href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1.5 text-indigo-400 hover:underline"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        {user.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4 Quick Stat Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase">Daily Streak</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">{streak} Days</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase">Total XP</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1">{stats.problemsSolved}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase">Badges Earned</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">{stats.quizzesPassed}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase">Current Level</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 mt-1">Lvl {stats.coursesCompleted}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Learning Progress List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            Active Learning Progress
          </h3>
          {progressData.length > 0 ? (
            <div className="space-y-4">
              {progressData.map((progress) => (
                <div key={progress.roadmap_id} className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-white text-sm font-semibold">{progress.title}</p>
                    <span className="text-xs text-indigo-400 font-semibold">
                      {progress.completion_percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full"
                      style={{ width: `${progress.completion_percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              No recent course history. Start generating a personalized learning path to track modules here!
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
