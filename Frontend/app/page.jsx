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
      <main className="min-h-screen overflow-hidden">
        {/* Animated gradient background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-slate-950" />
          <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute top-40 -right-40 w-80 h-80 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-80 h-80 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-10 relative">
          <div className="max-w-6xl mx-auto text-center animate-slide-in-up">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">
                Welcome to CodePath - Your AI Learning Companion
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-100 mb-6 leading-tight">
              Master Code
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                The Right Way
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Personalized AI-powered learning paths tailored to your goals.
              Learn coding, data science, web development, and more at your own
              pace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 text-base h-12 animate-glow"
              >
                <Link href="/signup" className="flex items-center gap-2">
                  Start Learning Now <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gray-600 text-gray-200 hover:bg-gray-800/50 text-base h-12"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-blue-400">5K+</div>
                <div className="text-sm text-gray-400">Learning Paths</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-green-400">50K+</div>
                <div className="text-sm text-gray-400">Learners</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-blue-300">99%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4">
                Everything You Need to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                  Learn & Grow
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Comprehensive tools and resources to accelerate your learning
                journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="group bg-gray-800/40 border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 hover:bg-gray-800/60 transition-all duration-300 backdrop-blur-sm">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  AI-Powered Paths
                </h3>
                <p className="text-gray-400">
                  Get personalized learning roadmaps designed specifically for
                  your skill level and goals
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-gray-800/40 border border-gray-700 rounded-2xl p-8 hover:border-green-500/50 hover:bg-gray-800/60 transition-all duration-300 backdrop-blur-sm">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  Interactive Lessons
                </h3>
                <p className="text-gray-400">
                  Learn through interactive code examples, quizzes, and hands-on
                  challenges
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-gray-800/40 border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 hover:bg-gray-800/60 transition-all duration-300 backdrop-blur-sm">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  Track Progress
                </h3>
                <p className="text-gray-400">
                  Monitor your progress with detailed analytics and earn badges
                  for achievements
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group bg-gray-800/40 border border-gray-700 rounded-2xl p-8 hover:border-green-500/50 hover:bg-gray-800/60 transition-all duration-300 backdrop-blur-sm">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  Real-Time Feedback
                </h3>
                <p className="text-gray-400">
                  Get instant feedback on your code and learn from detailed
                  explanations
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group bg-gray-800/40 border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 hover:bg-gray-800/60 transition-all duration-300 backdrop-blur-sm">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  Curated Content
                </h3>
                <p className="text-gray-400">
                  Expert-curated content covering everything from basics to
                  advanced topics
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group bg-gray-800/40 border border-gray-700 rounded-2xl p-8 hover:border-green-500/50 hover:bg-gray-800/60 transition-all duration-300 backdrop-blur-sm">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  Community Support
                </h3>
                <p className="text-gray-400">
                  Connect with other learners, share knowledge, and grow
                  together
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Your Learning Roadmaps Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4">
                Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                  Learning Roadmaps
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                AI-generated, personalized learning paths tailored to your goals
                and skill level. Start with any roadmap and track your progress.
              </p>
            </div>

            {/* Roadmap Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Frontend Development Roadmap */}
              <div className="group bg-gray-800/40 border border-gray-700 rounded-2xl p-6 hover:border-blue-500/60 hover:bg-gray-800/60 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-100 mb-1">
                      Frontend Development
                    </h3>
                    <p className="text-sm text-gray-400">
                      HTML, CSS, JavaScript, React
                    </p>
                  </div>
                  <div className="bg-blue-600/20 p-3 rounded-lg">
                    <Code2 className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="space-y-3 mb-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-400">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-blue-400">45%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    12 of 24 modules completed
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-500/60"
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2"
                  >
                    Continue Learning <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {/* Backend Development Roadmap */}
              <div className="group bg-gray-800/40 border border-gray-700 rounded-2xl p-6 hover:border-green-500/60 hover:bg-gray-800/60 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-100 mb-1">
                      Backend Development
                    </h3>
                    <p className="text-sm text-gray-400">
                      Node.js, Databases, APIs
                    </p>
                  </div>
                  <div className="bg-green-600/20 p-3 rounded-lg">
                    <Zap className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div className="space-y-3 mb-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-400">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-green-400">
                      28%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "28%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    7 of 20 modules completed
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-green-600/20 hover:text-green-400 hover:border-green-500/60"
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2"
                  >
                    Continue Learning <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {/* Data Science Roadmap */}
              <div className="group bg-gray-800/40 border border-gray-700 rounded-2xl p-6 hover:border-cyan-500/60 hover:bg-gray-800/60 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-100 mb-1">
                      Data Science Basics
                    </h3>
                    <p className="text-sm text-gray-400">
                      Python, Statistics, ML
                    </p>
                  </div>
                  <div className="bg-cyan-600/20 p-3 rounded-lg">
                    <Target className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <div className="space-y-3 mb-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-400">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-cyan-400">12%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "12%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    3 of 22 modules completed
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-cyan-600/20 hover:text-cyan-400 hover:border-cyan-500/60"
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2"
                  >
                    Continue Learning <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Generate New Roadmap CTA */}
            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 text-base h-12"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate Your Custom Roadmap
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/40 border border-gray-700 rounded-3xl p-12 text-center backdrop-blur-sm">
              <h2 className="text-4xl font-bold text-gray-100 mb-4">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of learners who are mastering coding with
                CodePath today
              </p>
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 text-base h-12"
              >
                <Link href="/signup" className="flex items-center gap-2">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-700 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <h3 className="font-bold text-gray-100 text-lg mb-4">
                  CodePath
                </h3>
                <p className="text-gray-400 text-sm">
                  Master coding the right way with AI-powered learning paths
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-100 mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link
                      href="/login"
                      className="hover:text-gray-200 transition"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="hover:text-gray-200 transition"
                    >
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-100 mb-4">Learn</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-gray-200 transition">
                      Explore Paths
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-gray-200 transition">
                      Resources
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-100 mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-gray-200 transition">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-gray-200 transition">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 CodePath. All rights reserved.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-gray-200 text-sm transition"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-gray-200 text-sm transition"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}
