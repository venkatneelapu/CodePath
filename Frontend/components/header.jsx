"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, Code2, Users, Zap, Compass, LogOut } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  if (isLoading) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-slate-950/80 backdrop-blur-2xl transition-all">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-3 group"
        >
          <div className="relative p-2 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 shadow-md shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
              CodePath
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-full px-3 py-1 backdrop-blur-md">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full text-sm font-medium hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-amber-400" /> Dashboard
              </Link>
              <Link
                href="/playground"
                className="text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full text-sm font-medium hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
              >
                <Code2 className="w-4 h-4 text-cyan-400" /> Playground
              </Link>
              <Link
                href="/explore"
                className="text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full text-sm font-medium hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-emerald-400" /> Explore
              </Link>
              <Link
                href="/gamification"
                className="text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full text-sm font-medium hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-purple-400" /> Badges
              </Link>
              <Link
                href="/forum"
                className="text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full text-sm font-medium hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
              >
                <Users className="w-4 h-4 text-blue-400" /> Community
              </Link>
            </>
          ) : (
            <>
              <Link
                href="#features"
                className="text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full text-sm font-medium hover:bg-white/[0.06] transition-all"
              >
                Features
              </Link>
              <Link
                href="/explore"
                className="text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full text-sm font-medium hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-indigo-400" /> Courses & Roadmaps
              </Link>
            </>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/profile"
                className="text-sm font-medium text-slate-200 hover:text-white px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {user.name}
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] bg-transparent rounded-full px-3.5 h-8.5"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2.5">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-full px-4"
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium rounded-full px-4.5 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all border-0"
              >
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-slate-950/95 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 text-slate-200 hover:text-white p-2.5 rounded-lg hover:bg-white/[0.06] text-sm font-medium transition-colors"
                >
                  <Zap className="w-4 h-4 text-amber-400" /> Dashboard
                </Link>
                <Link
                  href="/playground"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 text-slate-200 hover:text-white p-2.5 rounded-lg hover:bg-white/[0.06] text-sm font-medium transition-colors"
                >
                  <Code2 className="w-4 h-4 text-cyan-400" /> Playground
                </Link>
                <Link
                  href="/explore"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 text-slate-200 hover:text-white p-2.5 rounded-lg hover:bg-white/[0.06] text-sm font-medium transition-colors"
                >
                  <Compass className="w-4 h-4 text-emerald-400" /> Explore
                </Link>
                <Link
                  href="/gamification"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 text-slate-200 hover:text-white p-2.5 rounded-lg hover:bg-white/[0.06] text-sm font-medium transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" /> Badges & Stats
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 text-slate-200 hover:text-white p-2.5 rounded-lg hover:bg-white/[0.06] text-sm font-medium transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400" /> Profile ({user.name})
                </Link>
                <div className="pt-2 border-t border-white/[0.08]">
                  <Button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    variant="outline"
                    className="w-full border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-200 hover:text-white p-2.5 rounded-lg hover:bg-white/[0.06] text-sm font-medium transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="/explore"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-200 hover:text-white p-2.5 rounded-lg hover:bg-white/[0.06] text-sm font-medium transition-colors"
                >
                  Courses & Roadmaps
                </Link>
                <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-white/10 text-slate-200 hover:bg-white/[0.06] rounded-xl"
                  >
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-medium border-0 shadow-md shadow-indigo-500/20"
                  >
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Get Started Free</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
