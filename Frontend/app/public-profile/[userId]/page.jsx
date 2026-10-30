'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/header'
import { authStorage, streakStorage } from '@/lib/auth'
import { 
  Flame, 
  Target, 
  Award, 
  BookOpen, 
  Calendar,
  Globe,
  MapPin,
  Sparkles,
  User,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export default function PublicProfilePage() {
  const params = useParams()
  const [user, setUser] = useState(null)
  const [streak, setStreak] = useState(0)
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = params?.userId
    if (!userId) return

    async function loadPublicUser() {
      try {
        // Try fetching from public API
        const res = await fetch(`/api/users/${userId}`)
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setUser(json.data)
            setStreak(json.data.streak || 1)
            setPoints(json.data.points || 120)
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.warn('API fetch error for public user:', err)
      }

      // Fallback to local storage if present
      const profileUser = authStorage.getUserById(userId) || authStorage.getUser()
      if (profileUser) {
        setUser(profileUser)
        setStreak(streakStorage.getStreak(profileUser.id || userId) || 1)
        setPoints(120)
      }
      setLoading(false)
    }

    loadPublicUser()
  }, [params?.userId])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Loading Developer Profile...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Profile Not Found</h1>
          <p className="text-slate-400 text-sm max-w-sm mb-6">
            The developer profile you are looking for does not exist or has been made private.
          </p>
          <Link
            href="/explore"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore Courses
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur shadow-xl shadow-indigo-950/10 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {/* Avatar */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden border-2 border-indigo-500/40 shadow-lg shadow-indigo-500/20 shrink-0">
              {user.avatar_url || user.profilePhoto ? (
                <img 
                  src={user.avatar_url || user.profilePhoto} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="text-4xl text-white font-extrabold">{user.name?.charAt(0).toUpperCase()}</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-2">
                <Sparkles className="w-3 h-3" />
                Verified CodePath Developer
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user.name}</h1>
              
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                {user.bio || 'Continuous learner studying data structures, modern full-stack web development, and AI engineering.'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 mt-4">
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
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-center">
            <Flame className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{streak} Days</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Active Streak</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-center">
            <Target className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{points}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Developer XP</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-center col-span-2 sm:col-span-1">
            <Award className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">Level {Math.max(1, Math.floor(points / 100) + 1)}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Current Rank</p>
          </div>
        </div>

        {/* Explore Prompt */}
        <div className="text-center pt-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/20 transition-all"
          >
            Join CodePath & Build Your Profile
          </Link>
        </div>
      </main>
    </div>
  )
}
