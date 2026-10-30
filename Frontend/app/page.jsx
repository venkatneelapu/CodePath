"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  Target,
  Award,
  Code2,
  BookOpen,
  Sparkles,
  Bot,
  Terminal,
  CheckCircle2,
  Compass,
  Cpu,
  Flame,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    let parsedUser = null;
    if (userData && userData !== "undefined") {
      try {
        parsedUser = JSON.parse(userData);
      } catch {
        parsedUser = null;
      }
    }
    setUser(parsedUser);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
        {/* Ambient Glows & Grid Mesh Background */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-15%,rgba(99,102,241,0.22),rgba(255,255,255,0))]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        {/* Hero Section */}
        <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Shimmering Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm font-medium text-slate-300 mb-8 backdrop-blur-xl shadow-inner hover:border-indigo-500/40 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Gen AI Learning Platform</span>
            <span className="text-white/20">|</span>
            <span className="text-indigo-300 font-semibold">Gemini 2.5 Flash Engine</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.1] mb-6">
            Master Any Codebase{" "}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              With AI-Powered Precision
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Generate tailored day-by-day curricula, practice in an interactive multi-language sandbox, get unblocked by a 24/7 AI tutor, and track your streaks.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-16">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 border-0 transition-all text-base"
            >
              <Link href="/signup" className="flex items-center gap-2">
                Start Learning Free <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-8 rounded-full border-white/10 hover:border-white/20 text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md transition-all text-base font-medium"
            >
              <Link href="/playground" className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" /> Open Code Playground
              </Link>
            </Button>
          </div>

          {/* Interactive Preview Mockup Card */}
          <div className="w-full max-w-4xl mx-auto rounded-2xl border border-white/[0.1] bg-slate-900/60 shadow-2xl shadow-indigo-950/40 backdrop-blur-2xl overflow-hidden text-left mb-16">
            {/* Window Topbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  codepath-curriculum-generator.tsx
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ● Gemini Active
                </span>
              </div>
            </div>

            {/* Mock Editor & Output Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
              {/* Left Code Editor Simulation */}
              <div className="p-5 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto bg-slate-950/40">
                <div className="text-slate-500">// Configure your learning goal</div>
                <div><span className="text-purple-400">const</span> goal = &#123;</div>
                <div className="pl-4">topic: <span className="text-emerald-300">&quot;Fullstack Next.js & AI&quot;</span>,</div>
                <div className="pl-4">level: <span className="text-emerald-300">&quot;Intermediate&quot;</span>,</div>
                <div className="pl-4">duration: <span className="text-cyan-300">14</span>, <span className="text-slate-500">// days</span></div>
                <div className="pl-4">includeQuizzes: <span className="text-amber-300">true</span>,</div>
                <div className="pl-4">includeChallenges: <span className="text-amber-300">true</span></div>
                <div>&#125;;</div>
                <div className="mt-3 text-slate-500">// AI builds personalized daily modules</div>
                <div><span className="text-purple-400">await</span> codePath.<span className="text-blue-400">generateRoadmap</span>(goal);</div>
              </div>

              {/* Right Output Curriculum Simulation */}
              <div className="p-5 bg-slate-900/40 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                    <span>Generated Roadmap Preview</span>
                    <span className="text-indigo-400 font-mono text-[11px]">Day 1 of 14</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs text-slate-200 font-medium">Next.js 15 App Router & Server Components</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Core</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs text-slate-200 font-medium">Interactive Playground: Server Actions</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Hands-on</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                        <span className="text-xs text-slate-300 font-medium">AI Knowledge Check (5 Adaptive Questions)</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">Quiz</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-amber-400" /> +50 XP on completion</span>
                  <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                    Try it out <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl mx-auto">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">50,000+</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Active Learners</div>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mb-1">100%</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Free & Open Access</div>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 mb-1">10+</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Supported Languages</div>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">24/7</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">AI Mentor Availability</div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Engineered For Rapid{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                Skill Mastery
              </span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Everything you need to go from beginner to software engineer in one cohesive workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-indigo-500/40 hover:bg-white/[0.04] transition-all group backdrop-blur-xl">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Adaptive Roadmaps</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Tell CodePath what you want to build and your timeframe. It calculates progressive milestones, key syntax, and concepts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-white/[0.04] transition-all group backdrop-blur-xl">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">In-Browser Code Sandbox</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Execute JavaScript, TypeScript, Python, and C++ right in your browser with real-time output preview, zero local installation required.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-purple-500/40 hover:bg-white/[0.04] transition-all group backdrop-blur-xl">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">24/7 AI Coding Mentor</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Stuck on a bug or unclear about a concept? Ask your floating AI tutor anytime for quick explanations and debugged code snippets.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-pink-500/40 hover:bg-white/[0.04] transition-all group backdrop-blur-xl">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Adaptive Quizzes & Exercises</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Verify knowledge retention after every single lesson with multiple choice quizzes and immediate feedback explanations.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-amber-500/40 hover:bg-white/[0.04] transition-all group backdrop-blur-xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Streaks, XP & Gamification</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Stay consistent and motivated. Earn XP points, unlock milestone badges, and climb the global community leaderboard.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/40 hover:bg-white/[0.04] transition-all group backdrop-blur-xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Comprehensive Curricula</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Explore pre-built professional roadmaps in React, Next.js, Node.js, Python Data Science, and Machine Learning.
              </p>
            </div>
          </div>
        </section>

        {/* Pre-built Popular Roadmaps Showcase */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                Popular Learning Roadmaps
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Jump straight into community-favorite curricula designed by top engineers.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-white/10 text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-full"
            >
              <Link href="/explore" className="flex items-center gap-1.5">
                View All Courses <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-indigo-500/50 hover:bg-white/[0.04] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                    Frontend Track
                  </span>
                  <Code2 className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Modern Frontend Mastery</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  HTML5, Modern CSS, Tailwind, JavaScript ES2024, React 19, and Next.js App Router.
                </p>
              </div>
              <Button asChild className="w-full bg-white/[0.06] hover:bg-indigo-600 text-white rounded-xl border border-white/10 hover:border-transparent transition-all">
                <Link href="/signup">Start Frontend Track</Link>
              </Button>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/50 hover:bg-white/[0.04] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                    Backend Track
                  </span>
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Cloud Backend & APIs</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Node.js, Express, MongoDB Atlas, RESTful APIs, JWT Auth, and Serverless Architecture.
                </p>
              </div>
              <Button asChild className="w-full bg-white/[0.06] hover:bg-emerald-600 text-white rounded-xl border border-white/10 hover:border-transparent transition-all">
                <Link href="/signup">Start Backend Track</Link>
              </Button>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-500/50 hover:bg-white/[0.04] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
                    Data & AI Track
                  </span>
                  <Cpu className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Python & Machine Learning</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Python fundamentals, Pandas, NumPy, Data Analysis, and Gemini Generative AI Integration.
                </p>
              </div>
              <Button asChild className="w-full bg-white/[0.06] hover:bg-cyan-600 text-white rounded-xl border border-white/10 hover:border-transparent transition-all">
                <Link href="/signup">Start Python Track</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* High-Impact CTA Banner */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-slate-900/80 border border-white/[0.12] text-center overflow-hidden backdrop-blur-2xl shadow-2xl">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Ready to Accelerate Your Career?
              </h2>
              <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
                Join thousands of students and developers mastering tech stacks the right way. Completely free.
              </p>
              <Button
                asChild
                size="lg"
                className="h-12 px-8 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold text-base shadow-xl shadow-indigo-500/30 border-0"
              >
                <Link href="/signup" className="flex items-center gap-2">
                  Create My Free Account <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.08] py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">CodePath</span>
              <span className="text-slate-500 text-sm ml-2">© 2026 CodePath. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="/explore" className="hover:text-white transition-colors">Courses</Link>
              <Link href="/playground" className="hover:text-white transition-colors">Playground</Link>
              <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
              <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
