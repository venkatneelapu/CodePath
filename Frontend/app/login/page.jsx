"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login with email:", email);

      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      console.log("[v0] Login successful");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.data, id: data.data.user_id }),
      );
      router.push("/dashboard");
    } catch (err) {
      console.error("[v0] Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] bg-gradient-to-br from-blue-600 via-cyan-500 to-transparent rounded-full blur-3xl opacity-20"
          style={{ top: "10%", left: "-200px", animation: "blob 7s infinite" }}
        ></div>
        <div
          className="absolute w-[500px] h-[500px] bg-gradient-to-br from-purple-600 via-blue-500 to-transparent rounded-full blur-3xl opacity-20"
          style={{
            bottom: "10%",
            right: "-200px",
            animation: "blob 9s infinite 2s",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full mb-4 shadow-lg shadow-cyan-500/50">
            <LogIn size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your LearnPath account</p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Mail size={16} className="text-cyan-400" />
                Email Address
              </label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Lock size={16} className="text-cyan-400" />
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="#"
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className="text-red-400 flex-shrink-0 mt-0.5"
                />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-cyan-500/30 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn size={18} />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link href="/signup">
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all py-3 rounded-lg font-semibold"
            >
              Create Account
            </Button>
          </Link>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-300 text-xs font-semibold mb-2 flex items-center gap-1">
            <CheckCircle2 size={14} />
            Demo Credentials Available
          </p>
          <p className="text-blue-300/80 text-xs">
            Test the platform with demo credentials provided on signup
          </p>
        </div>
      </div>
    </div>
  );
}
