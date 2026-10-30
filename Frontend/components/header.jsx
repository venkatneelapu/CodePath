"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, Code2, Users, Zap } from "lucide-react";

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-2 group"
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            CodePath
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-slate-300 hover:text-violet-300 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <Zap className="w-4 h-4" /> Dashboard
              </Link>
              <Link
                href="/playground"
                className="text-slate-300 hover:text-violet-300 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <Code2 className="w-4 h-4" /> Playground
              </Link>
              <Link
                href="/gamification"
                className="text-slate-300 hover:text-violet-300 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-4 h-4" /> Achievements
              </Link>
              <Link
                href="/forum"
                className="text-slate-300 hover:text-violet-300 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <Users className="w-4 h-4" /> Community
              </Link>
            </>
          ) : (
            <>
              <Link
                href="#features"
                className="text-slate-300 hover:text-violet-300 text-sm font-medium transition-colors"
              >
                Features
              </Link>
              <Link
                href="/explore"
                className="text-slate-300 hover:text-violet-300 text-sm font-medium transition-colors"
              >
                Courses
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
                className="text-sm font-medium text-violet-300 hover:text-violet-100 transition-colors px-3 py-1 rounded-lg hover:bg-purple-500/20"
              >
                {user.name}
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-violet-400/30 text-violet-300 hover:bg-violet-500/20 hover:border-violet-400 bg-transparent"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-violet-400/30 text-violet-300 hover:bg-violet-500/20 bg-transparent"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
              >
                <Link href="/signup">Sign Up Free</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-violet-300 hover:text-violet-100 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-violet-200/10 bg-purple-900/50 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-slate-300 hover:text-violet-300 py-2 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/playground"
                  className="block text-slate-300 hover:text-violet-300 py-2 font-medium transition-colors"
                >
                  Playground
                </Link>
                <Link
                  href="/gamification"
                  className="block text-slate-300 hover:text-violet-300 py-2 font-medium transition-colors"
                >
                  Achievements
                </Link>
                <Link
                  href="/profile"
                  className="block text-slate-300 hover:text-violet-300 py-2 font-medium transition-colors"
                >
                  Profile
                </Link>
                <Button
                  onClick={handleLogout}
                  className="w-full mt-2 bg-transparent"
                  variant="outline"
                  size="sm"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
