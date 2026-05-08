"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authStorage } from "@/lib/auth";
import { Trophy, Zap, Target, Award, TrendingUp, Star } from "lucide-react";

export default function GamificationPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    points: 2450,
    level: 24,
    badges: [1, 2, 3, 4, 5, 6],
    streak: 15,
    problemsSolved: 87,
    quizzesPassed: 24,
    coursesCompleted: 5,
  });

  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    async function loadGamification() {
      try {
        const authRes = await fetch("/api/users/profile", {
          credentials: "include",
        });
        if (!authRes.ok) {
          router.push("/login");
          return;
        }
        const profileJson = await authRes.json();
        setUser(profileJson.data);

        const statsRes = await fetch("/api/gamification/stats");
        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          setStats({
            points: statsJson.data.points || 0,
            level: statsJson.data.level || 1,
            badges: statsJson.data.badges?.map((b) => b.badge_id) || [],
            streak: statsJson.data.streak?.current || 0,
            problemsSolved: statsJson.data.points || 0,
            quizzesPassed: statsJson.data.badges?.length || 0,
            coursesCompleted: statsJson.data.level || 1,
          });
        }

        const leaderboardRes = await fetch("/api/leaderboard");
        if (leaderboardRes.ok) {
          const leaderboardJson = await leaderboardRes.json();
          setLeaderboardData(leaderboardJson.data.leaderboard || []);
        }
      } catch (err) {
        console.error("Error loading gamification:", err);
      }
    }

    loadGamification();
  }, [router]);

  const badges = [
    {
      id: 1,
      name: "First Step",
      description: "Complete your first problem",
      points: 10,
      icon: "🎯",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 2,
      name: "Problem Solver",
      description: "Solve 10 problems",
      points: 50,
      icon: "💡",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: 3,
      name: "Interview Ready",
      description: "Read 20 interview questions",
      points: 75,
      icon: "💼",
      color: "from-pink-500 to-pink-600",
    },
    {
      id: 4,
      name: "Coding Champion",
      description: "Solve 50 problems",
      points: 150,
      icon: "🏆",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: 5,
      name: "Master Learner",
      description: "Complete 5 roadmaps",
      points: 200,
      icon: "👑",
      color: "from-red-500 to-red-600",
    },
    {
      id: 6,
      name: "Community Helper",
      description: "Answer 5 forum questions",
      points: 100,
      icon: "🤝",
      color: "from-green-500 to-green-600",
    },
  ];

  if (!user) return <div className="text-white">Loading...</div>;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold text-white mb-2 gradient-text">
            Gamification Hub
          </h1>
          <p className="text-slate-300 mb-12 text-lg">
            Track your progress and compete with others
          </p>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="glass-card border border-indigo-500/30 hover:border-indigo-500/60 transition-all hover:shadow-lg hover:shadow-indigo-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-semibold">
                      TOTAL POINTS
                    </p>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mt-2">
                      {stats.points}
                    </p>
                  </div>
                  <Zap className="text-yellow-400" size={40} />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-semibold">
                      LEVEL
                    </p>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mt-2">
                      {stats.level}
                    </p>
                  </div>
                  <Trophy className="text-purple-400" size={40} />
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                    style={{ width: `${((stats.points % 100) * 100) / 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border border-cyan-500/30 hover:border-cyan-500/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-semibold">
                      STREAK DAYS
                    </p>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mt-2">
                      {stats.streak}
                    </p>
                  </div>
                  <TrendingUp className="text-cyan-400" size={40} />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border border-green-500/30 hover:border-green-500/60 transition-all hover:shadow-lg hover:shadow-green-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-semibold">
                      BADGES
                    </p>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mt-2">
                      {stats.badges.length}/6
                    </p>
                  </div>
                  <Award className="text-green-400" size={40} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="glass-card border border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="text-blue-400" size={24} />
                  Problems Solved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 h-40 bg-slate-900/50 p-4 rounded-lg">
                  {[65, 78, 45, 92, 68, 87, 75].map((val, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all hover:shadow-lg hover:shadow-indigo-500/50"
                      style={{ height: `${(val / 100) * 100}%` }}
                    />
                  ))}
                </div>
                <p className="text-white text-2xl font-bold mt-4">
                  {stats.problemsSolved} Total
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="text-purple-400" size={24} />
                  Quizzes Passed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-40 h-40 mx-auto mt-4">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full transform -rotate-90"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#purpleGrad)"
                      strokeWidth="8"
                      strokeDasharray={`${(stats.quizzesPassed / 50) * 251.2} 251.2`}
                      className="transition-all"
                    />
                    <defs>
                      <linearGradient
                        id="purpleGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">
                        {stats.quizzesPassed}
                      </p>
                      <p className="text-sm text-slate-400">of 50</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="text-green-400" size={24} />
                  Courses Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mt-4">
                  {[
                    { name: "Python Basics", progress: 100 },
                    { name: "JavaScript Pro", progress: 85 },
                    { name: "React Advanced", progress: 60 },
                    { name: "DSA Masterclass", progress: 40 },
                    { name: "Web Development", progress: 25 },
                  ].map((course, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm text-slate-300">{course.name}</p>
                        <p className="text-xs text-slate-400">
                          {course.progress}%
                        </p>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Badges and Leaderboard */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="glass-card border border-indigo-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Your Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {badges.map((badge) => (
                      <div
                        key={badge.id}
                        className={`p-3 rounded-lg text-center transition-all cursor-pointer hover:scale-110 ${
                          stats.badges.includes(badge.id)
                            ? `bg-gradient-to-br ${badge.color} shadow-lg`
                            : "bg-slate-800/50 opacity-50"
                        }`}
                        title={badge.name}
                      >
                        <div className="text-3xl">{badge.icon}</div>
                        <p className="text-xs text-white mt-1 font-semibold">
                          {badge.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="glass-card border border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Leaderboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {leaderboardData.map((entry) => (
                      <div
                        key={entry.rank}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                          entry.rank <= 3
                            ? "bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-yellow-500/30"
                            : "bg-slate-800/50 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                              entry.rank === 1
                                ? "bg-yellow-500/30 text-yellow-400"
                                : entry.rank === 2
                                  ? "bg-gray-400/30 text-gray-300"
                                  : entry.rank === 3
                                    ? "bg-orange-600/30 text-orange-400"
                                    : "bg-slate-700 text-slate-300"
                            }`}
                          >
                            #{entry.rank}
                          </div>
                          <div>
                            <p className="text-white font-semibold">
                              {entry.name || "Anonymous Learner"}
                            </p>
                            <p className="text-sm text-slate-400">
                              Level {Math.floor(entry.points / 100) + 1}
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                          {entry.points} pts
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
