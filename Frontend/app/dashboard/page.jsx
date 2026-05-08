"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Flame,
  BookOpen,
  Target,
  Award,
  Brain,
  Code2,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState({
    problemsSolved: 0,
    quizzesPassed: 0,
    coursesCompleted: 0,
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [profileRes, statsRes, roadmapsRes] = await Promise.all([
          fetch("/api/users/profile", { credentials: "include" }),
          fetch("/api/gamification/stats", { credentials: "include" }),
          fetch("/api/roadmaps", { credentials: "include" }),
        ]);

        if (!profileRes.ok) {
          router.push("/login");
          return;
        }

        const profileJson = await profileRes.json();
        setUser(profileJson.data);

        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          setStreak(statsJson.data.streak?.current || 0);
          setStats({
            problemsSolved: statsJson.data.points || 0,
            quizzesPassed: statsJson.data.badges?.length || 0,
            coursesCompleted: statsJson.data.level || 1,
          });
        }

        if (roadmapsRes.ok) {
          const roadmapsJson = await roadmapsRes.json();
          setRoadmaps(roadmapsJson.data.roadmaps || []);
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (loading)
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
              style={{ top: "20%", left: "10%" }}
            ></div>
            <div
              className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
              style={{ bottom: "20%", right: "10%" }}
            ></div>
          </div>
          <div className="relative text-center">
            <div className="mb-4 inline-block">
              <Rocket className="w-16 h-16 text-cyan-400 animate-bounce" />
            </div>
            <p className="text-white text-xl font-semibold">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </>
    );

  return (
    <>
      <Header />
      <main className="relative min-h-screen bg-black overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          {/* Animated gradient blobs */}
          <div
            className="absolute w-[500px] h-[500px] bg-gradient-to-br from-blue-600 via-cyan-500 to-transparent rounded-full blur-3xl animate-blob opacity-20"
            style={{
              top: "10%",
              left: "-200px",
              animation: "blob 7s infinite",
            }}
          ></div>
          <div
            className="absolute w-[500px] h-[500px] bg-gradient-to-br from-purple-600 via-blue-500 to-transparent rounded-full blur-3xl animate-blob opacity-20"
            style={{
              top: "50%",
              right: "-200px",
              animation: "blob 9s infinite 2s",
            }}
          ></div>
          <div
            className="absolute w-[500px] h-[500px] bg-gradient-to-br from-cyan-500 via-purple-500 to-transparent rounded-full blur-3xl animate-blob opacity-20"
            style={{
              bottom: "10%",
              left: "50%",
              animation: "blob 11s infinite 4s",
            }}
          ></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="url(#gridGradient)"
                    strokeWidth="0.5"
                  />
                </pattern>
                <linearGradient
                  id="gridGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto max-w-7xl">
          {/* Animated Hero Section */}
          <div className="py-12 px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-16">
              <div className="flex-1">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white leading-tight">
                  Welcome back,
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                    {user?.name}
                  </span>
                </h1>
                <p className="text-lg text-gray-300 mb-2">
                  Track your learning progress and unlock your potential
                </p>
                <p className="text-sm text-gray-400">
                  Today is a perfect day to keep learning and growing
                </p>
              </div>
              <div className="flex-shrink-0 hidden lg:flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                  <div className="relative w-40 h-40 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Sparkles size={80} className="text-white animate-bounce" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {/* Streak Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/10 via-transparent to-transparent border border-red-500/30 hover:border-red-500/60 transition-all duration-500 p-6 hover:shadow-xl hover:shadow-red-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs font-bold tracking-widest mb-2">
                      STREAK
                    </p>
                    <p className="text-5xl font-black text-red-400 tabular-nums">
                      {streak}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Days Active</p>
                  </div>
                  <div className="bg-red-500/20 group-hover:bg-red-500/40 transition-all p-4 rounded-full">
                    <Flame size={32} className="text-red-400 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Problems Solved */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-transparent to-transparent border border-blue-500/30 hover:border-blue-500/60 transition-all duration-500 p-6 hover:shadow-xl hover:shadow-blue-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs font-bold tracking-widest mb-2">
                      PROBLEMS
                    </p>
                    <p className="text-5xl font-black text-blue-400 tabular-nums">
                      {stats.problemsSolved}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Solved</p>
                  </div>
                  <div className="bg-blue-500/20 group-hover:bg-blue-500/40 transition-all p-4 rounded-full">
                    <Target size={32} className="text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Quizzes Passed */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-500 p-6 hover:shadow-xl hover:shadow-emerald-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs font-bold tracking-widest mb-2">
                      QUIZZES
                    </p>
                    <p className="text-5xl font-black text-emerald-400 tabular-nums">
                      {stats.quizzesPassed}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Passed</p>
                  </div>
                  <div className="bg-emerald-500/20 group-hover:bg-emerald-500/40 transition-all p-4 rounded-full">
                    <Award size={32} className="text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Courses Completed */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-transparent border border-purple-500/30 hover:border-purple-500/60 transition-all duration-500 p-6 hover:shadow-xl hover:shadow-purple-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs font-bold tracking-widest mb-2">
                      COURSES
                    </p>
                    <p className="text-5xl font-black text-purple-400 tabular-nums">
                      {stats.coursesCompleted}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Completed</p>
                  </div>
                  <div className="bg-purple-500/20 group-hover:bg-purple-500/40 transition-all p-4 rounded-full">
                    <BookOpen size={32} className="text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Actions */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Zap size={32} className="text-cyan-400" />
              Explore Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/ai-learning-path" className="group">
                <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-500 p-6 hover:shadow-xl hover:shadow-cyan-500/30 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-600 to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="bg-cyan-500/20 group-hover:bg-cyan-500/40 transition-all w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                      <Brain size={28} className="text-cyan-400" />
                    </div>
                    <h3 className="font-bold text-white mb-2 text-lg">
                      AI Path Generator
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Generate personalized learning paths
                    </p>
                    <div className="flex items-center text-cyan-400 text-sm font-semibold group-hover:gap-2 gap-0 transition-all">
                      <span>Get Started</span>
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/ai-mentor" className="group">
                <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-500 p-6 hover:shadow-xl hover:shadow-purple-500/30 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="bg-purple-500/20 group-hover:bg-purple-500/40 transition-all w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                      <Sparkles size={28} className="text-purple-400" />
                    </div>
                    <h3 className="font-bold text-white mb-2 text-lg">
                      AI Mentor
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Get help from your AI mentor
                    </p>
                    <div className="flex items-center text-purple-400 text-sm font-semibold group-hover:gap-2 gap-0 transition-all">
                      <span>Get Started</span>
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/problems" className="group">
                <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 hover:border-blue-500/60 transition-all duration-500 p-6 hover:shadow-xl hover:shadow-blue-500/30 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="bg-blue-500/20 group-hover:bg-blue-500/40 transition-all w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                      <Code2 size={28} className="text-blue-400" />
                    </div>
                    <h3 className="font-bold text-white mb-2 text-lg">
                      Practice Problems
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Solve coding challenges
                    </p>
                    <div className="flex items-center text-blue-400 text-sm font-semibold group-hover:gap-2 gap-0 transition-all">
                      <span>Get Started</span>
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/gamification" className="group">
                <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-500 p-6 hover:shadow-xl hover:shadow-emerald-500/30 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="bg-emerald-500/20 group-hover:bg-emerald-500/40 transition-all w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                      <TrendingUp size={28} className="text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-white mb-2 text-lg">
                      Gamification
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Earn badges and rewards
                    </p>
                    <div className="flex items-center text-emerald-400 text-sm font-semibold group-hover:gap-2 gap-0 transition-all">
                      <span>Get Started</span>
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Generate New Roadmap Section */}
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-500 p-8">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 hover:opacity-5 transition-opacity duration-500"></div>
              <div className="relative flex items-center justify-between flex-wrap gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <Sparkles
                      size={28}
                      className="text-cyan-400 animate-pulse"
                    />
                    Generate Your AI Learning Roadmap
                  </h3>
                  <p className="text-gray-300">
                    Create a personalized learning path based on your goals and
                    skill level
                  </p>
                </div>
                <Link href="/ai-learning-path" className="flex-shrink-0">
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/50 flex items-center gap-2">
                    <Brain size={20} />
                    Generate Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Your Roadmaps Section */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <Rocket size={32} className="text-cyan-400" />
              Your Learning Roadmaps
            </h2>
            {roadmaps.length === 0 ? (
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 border border-cyan-500/30 hover:border-cyan-500/60 transition-all p-12 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-purple-600 opacity-0 hover:opacity-5 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="mb-6 inline-flex">
                    <div className="bg-cyan-500/20 p-6 rounded-full">
                      <BookOpen size={48} className="text-cyan-400" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-3">
                    No roadmaps yet
                  </p>
                  <p className="text-lg text-gray-300 mb-8">
                    Create your first learning roadmap to begin your journey
                  </p>
                  <Link href="/generate">
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg shadow-cyan-500/50">
                      Generate Roadmap
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {roadmaps.map((roadmap) => {
                  const completedPercentage = roadmap.progress || 0;
                  const isCompleted = completedPercentage === 100;
                  return (
                    <div
                      key={roadmap._id}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/40 via-gray-900/40 to-gray-900/40 border border-gray-700/50 hover:border-cyan-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2"
                    >
                      {/* Animated gradient border */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">
                              {roadmap.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {roadmap.description}
                            </p>
                          </div>
                          {isCompleted && (
                            <CheckCircle2
                              size={24}
                              className="text-emerald-400 flex-shrink-0 ml-2 animate-pulse"
                            />
                          )}
                        </div>

                        {/* Progress Section */}
                        <div className="space-y-3 pt-2 border-t border-gray-700/50">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400 tracking-widest">
                              PROGRESS
                            </span>
                            <span
                              className={`text-lg font-bold tabular-nums ${isCompleted ? "text-emerald-400" : "text-cyan-400"}`}
                            >
                              {completedPercentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-800/50 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-2.5 rounded-full transition-all duration-700 ${
                                isCompleted
                                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500"
                                  : "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
                              }`}
                              style={{ width: `${completedPercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <Link href={`/roadmap/${roadmap._id}`}>
                            <button className="w-full bg-gray-800/50 hover:bg-cyan-600/50 text-cyan-400 hover:text-white text-xs font-semibold py-2 px-2 rounded-lg transition-all duration-300">
                              <BookOpen size={14} className="mx-auto mb-1" />
                              <span className="block text-xs">Details</span>
                            </button>
                          </Link>
                          <Link href={`/quiz/${roadmap._id}`}>
                            <button className="w-full bg-gray-800/50 hover:bg-blue-600/50 text-blue-400 hover:text-white text-xs font-semibold py-2 px-2 rounded-lg transition-all duration-300">
                              <Award size={14} className="mx-auto mb-1" />
                              <span className="block text-xs">Quiz</span>
                            </button>
                          </Link>
                          <Link href={`/challenge/${roadmap._id}`}>
                            <button className="w-full bg-gray-800/50 hover:bg-purple-600/50 text-purple-400 hover:text-white text-xs font-semibold py-2 px-2 rounded-lg transition-all duration-300">
                              <Code2 size={14} className="mx-auto mb-1" />
                              <span className="block text-xs">Challenge</span>
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
