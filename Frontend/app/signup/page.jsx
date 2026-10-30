"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  Code2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validatePasswordStrength = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(pwd)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(pwd)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(pwd)) errors.push("One number");
    return errors;
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordErrors(validatePasswordStrength(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Full name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    if (passwordErrors.length > 0) {
      setError("Please ensure your password meets all requirements below");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || (data.errors && data.errors[0]?.message) || "Signup failed");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.data, id: data.data.user_id }),
      );
      router.push("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 shadow-md shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all">
              <Code2 size={24} className="text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
              CodePath
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Create Your Account</h1>
          <p className="text-sm text-slate-400 mt-1.5">Start your personalized AI learning journey today</p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-7 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-indigo-950/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User size={14} className="text-indigo-400" />
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-slate-950/60 border border-white/[0.1] text-white placeholder:text-slate-500 rounded-xl h-10.5 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={14} className="text-indigo-400" />
                Email Address
              </label>
              <Input
                type="email"
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-950/60 border border-white/[0.1] text-white placeholder:text-slate-500 rounded-xl h-10.5 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={14} className="text-indigo-400" />
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  className="bg-slate-950/60 border border-white/[0.1] text-white placeholder:text-slate-500 rounded-xl h-10.5 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={14} className="text-indigo-400" />
                Confirm Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-slate-950/60 border border-white/[0.1] text-white placeholder:text-slate-500 rounded-xl h-10.5 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Password Requirements Checklist */}
            {password && (
              <div className="p-3 rounded-xl bg-slate-950/50 border border-white/[0.08] space-y-1.5 text-xs">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Security Requirements:</span>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {[
                    "At least 8 characters",
                    "One uppercase letter",
                    "One lowercase letter",
                    "One number",
                  ].map((req, i) => {
                    const isMet = !passwordErrors.includes(req);
                    return (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} className={isMet ? "text-emerald-400 shrink-0" : "text-slate-600 shrink-0"} />
                        <span className={isMet ? "text-slate-200" : "text-slate-500"}>{req}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in duration-200">
                <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all border-0 text-sm mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Create Free Account</span>
                  <ArrowRight size={15} />
                </div>
              )}
            </Button>
          </form>

          {/* Footer Card */}
          <div className="mt-5 pt-4 border-t border-white/[0.08] text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
