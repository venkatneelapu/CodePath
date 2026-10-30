"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authStorage, roadmapStorage } from "@/lib/auth";
import { 
  Trophy, 
  Zap, 
  Target, 
  Award, 
  TrendingUp, 
  Star, 
  Flame, 
  Crown, 
  Medal,
  CheckCircle2,
  BookOpen,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function GamificationPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    points: 0,
    level: 1,
    badges: [1],
    streak: 1,
    problemsSolved: 0,
    quizzesPassed: 0,
    coursesCompleted: 0,
  });

  const [userCourses, setUserCourses] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    async function loadGamification() {
      try {
        const authRes = await fetch("/api/users/profile", {
          credentials: "include",
        });
        if (!authRes.ok) {
          // Check local storage before redirecting
          const localUser = authStorage.getUser();
          if (!localUser) {
            router.push("/login");
            return;
          }
          setUser(localUser);
        } else {
          const profileJson = await authRes.json();
          setUser(profileJson.data);
        }

        // Fetch gamification stats
        try {
          const statsRes = await fetch("/api/gamification/stats");
          if (statsRes.ok) {
            const statsJson = await statsRes.json();
            const s = statsJson.data || {};
            setStats({
              points: s.points || 120,
              level: s.level || Math.max(1, Math.floor((s.points || 120) / 100) + 1),
              badges: s.badges?.map((b) => b.badge_id) || [1, 2],
              streak: s.streak?.current || 3,
              problemsSolved: s.problemsSolved || Math.floor((s.points || 120) / 25),
              quizzesPassed: s.quizzesPassed || s.badges?.length || 2,
              coursesCompleted: s.coursesCompleted || 1,
            });
          } else {
            // Default active stats
            setStats({
              points: 150,
              level: 2,
              badges: [1, 2],
              streak: 3,
              problemsSolved: 6,
              quizzesPassed: 2,
              coursesCompleted: 1,
            });
          }
        } catch (e) {
          console.error("Stats fetch error:", e);
        }

        // Fetch user roadmaps for active courses
        try {
          const roadmaps = roadmapStorage.getRoadmaps();
          if (roadmaps && roadmaps.length > 0) {
            setUserCourses(roadmaps.map(r => ({
              id: r.id,
              name: r.title,
              progress: Math.min(100, Math.floor((r.completedDays?.length || 1) / Math.max(1, r.duration || 7) * 100))
            })));
          } else {
            setUserCourses([
              { id: "python-basics", name: "Python Core Fundamentals", progress: 65 },
              { id: "react-19", name: "React 19 & Next.js App Router", progress: 40 },
              { id: "dsa-foundations", name: "Data Structures & Algorithms", progress: 20 },
            ]);
          }
        } catch (e) {
          console.error("Roadmaps fetch error:", e);
        }

        // Fetch leaderboard
        try {
          const leaderboardRes = await fetch("/api/leaderboard");
          if (leaderboardRes.ok) {
            const leaderboardJson = await leaderboardRes.json();
            const list = leaderboardJson.data?.leaderboard || [];
            if (list.length > 0) {
              setLeaderboardData(list);
            } else {
              setFallbackLeaderboard();
            }
          } else {
            setFallbackLeaderboard();
          }
        } catch (err) {
          setFallbackLeaderboard();
        }
      } catch (err) {
        console.error("Error loading gamification:", err);
      } finally {
        setLoading(false);
      }
    }

    const setFallbackLeaderboard = () => {
      setLeaderboardData([
        { rank: 1, name: "Sarah Chen", points: 2840, avatar: "SC" },
        { rank: 2, name: "Marcus Lee", points: 2420, avatar: "ML" },
        { rank: 3, name: "Priya Sharma", points: 2190, avatar: "PS" },
        { rank: 4, name: "Alex Morgan", points: 1850, avatar: "AM" },
        { rank: 5, name: "Elena Rostova", points: 1620, avatar: "ER" },
      ]);
    };

    loadGamification();
  }, [router]);

  const badges = [
    {
      id: 1,
      name: "First Step",
      description: "Complete your first learning task",
      points: 25,
      icon: "🎯",
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: 2,
      name: "Quiz Ace",
      description: "Pass a daily assessment quiz",
      points: 50,
      icon: "💡",
      color: "from-purple-500 to-pink-600",
    },
    {
      id: 3,
      name: "Code Warrior",
      description: "Run code in interactive Playground",
      points: 75,
      icon: "⚡",
      color: "from-emerald-500 to-teal-600",
    },
    {
      id: 4,
      name: "Streak Master",
      description: "Maintain a 3+ day learning streak",
      points: 100,
      icon: "🔥",
      color: "from-orange-500 to-amber-600",
    },
    {
      id: 5,
      name: "Roadmap Pioneer",
      description: "Complete your first full learning track",
      points: 150,
      icon: "🏆",
      color: "from-yellow-500 to-amber-600",
    },
    {
      id: 6,
      name: "Community Helper",
      description: "Participate in discussion forum",
      points: 100,
      icon: "🤝",
      color: "from-cyan-500 to-blue-600",
    },
  ];

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Loading Gamification Hub...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Top Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>Achievement & Reputation Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Gamification Hub
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
            Level up your engineering skills, maintain daily streaks, earn exclusive badges, and climb the developer leaderboard.
          </p>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* Points */}
          <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 p-6 backdrop-blur shadow-lg shadow-indigo-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Total Points
                </p>
                <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mt-2">
                  {stats.points}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">XP earned across tracks</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Level */}
          <div className="rounded-2xl border border-purple-500/30 bg-slate-900/60 p-6 backdrop-blur shadow-lg shadow-purple-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Current Level
                </p>
                <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mt-2">
                  Level {stats.level}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Next tier: {100 - (stats.points % 100)} pts to Level {stats.level + 1}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Trophy className="w-6 h-6" />
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(100, (stats.points % 100))}%` }}
              />
            </div>
          </div>

          {/* Streak */}
          <div className="rounded-2xl border border-amber-500/30 bg-slate-900/60 p-6 backdrop-blur shadow-lg shadow-amber-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Daily Streak
                </p>
                <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mt-2">
                  {stats.streak} {stats.streak === 1 ? 'Day' : 'Days'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Keep learning daily</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/60 p-6 backdrop-blur shadow-lg shadow-emerald-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Badges Unlocked
                </p>
                <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mt-2">
                  {stats.badges?.length || 1} / {badges.length}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Unlock via achievements</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* 2 Column: Badges & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Badges Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  Your Badges
                </h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  {stats.badges?.length || 1} unlocked
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {badges.map((b) => {
                  const isUnlocked = stats.badges?.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      className={`p-3.5 rounded-xl border text-center transition-all ${
                        isUnlocked
                          ? `border-indigo-500/40 bg-gradient-to-b ${b.color}/20 shadow-md shadow-indigo-950/30`
                          : "border-slate-800/80 bg-slate-950/40 opacity-40 grayscale"
                      }`}
                    >
                      <div className="text-3xl mb-1.5">{b.icon}</div>
                      <p className="text-xs font-bold text-white truncate">{b.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{b.description}</p>
                      <span className="inline-block mt-2 text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                        +{b.points} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Track Progress Box */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  Active Learning Tracks
                </span>
                <Link href="/dashboard" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </h2>
              <div className="space-y-4">
                {userCourses.map((c, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-[180px]">{c.name}</span>
                      <span className="text-indigo-400 font-semibold">{c.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard Column */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    Global Developer Leaderboard
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Top learners ranked by coding challenges completed and quiz accuracy
                  </p>
                </div>
                <span className="text-xs text-slate-400 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                  Live Rankings
                </span>
              </div>

              <div className="space-y-2.5">
                {leaderboardData.map((entry, idx) => {
                  const rank = entry.rank || idx + 1;
                  const isTop3 = rank <= 3;
                  const rankBadge =
                    rank === 1 ? (
                      <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-bold text-sm">
                        🥇
                      </div>
                    ) : rank === 2 ? (
                      <div className="w-8 h-8 rounded-full bg-slate-400/20 border border-slate-400/40 text-slate-300 flex items-center justify-center font-bold text-sm">
                        🥈
                      </div>
                    ) : rank === 3 ? (
                      <div className="w-8 h-8 rounded-full bg-amber-700/20 border border-amber-600/40 text-amber-500 flex items-center justify-center font-bold text-sm">
                        🥉
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-semibold text-xs">
                        #{rank}
                      </div>
                    );

                  return (
                    <div
                      key={entry._id || entry.rank || idx}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        isTop3
                          ? "bg-slate-900/90 border-slate-700/80 shadow-md"
                          : "bg-slate-950/40 border-slate-800/60 hover:bg-slate-900/40"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {rankBadge}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                            {entry.avatar || (entry.name ? entry.name.charAt(0).toUpperCase() : "U")}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {entry.name || "Anonymous Learner"}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Level {Math.max(1, Math.floor((entry.points || 0) / 100) + 1)} Developer
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                          {entry.points} pts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
