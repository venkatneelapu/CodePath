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
  CheckCircle2,
  Info,
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

    // Validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (passwordErrors.length > 0) {
      setError("Password does not meet requirements");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting signup with email:", email);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      console.log("[v0] Signup successful");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.data, id: data.data.user_id }),
      );
      router.push("/dashboard");
    } catch (err) {
      console.error("[v0] Signup error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] bg-gradient-to-br from-purple-600 via-blue-500 to-transparent rounded-full blur-3xl opacity-20"
          style={{ top: "20%", left: "-200px", animation: "blob 7s infinite" }}
        ></div>
        <div
          className="absolute w-[500px] h-[500px] bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-20"
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full mb-4 shadow-lg shadow-purple-500/50">
            <UserPlus size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Join LearnPath</h1>
          <p className="text-gray-400">
            Start your personalized learning journey today
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <User size={16} className="text-purple-400" />
                Full Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Mail size={16} className="text-purple-400" />
                Email Address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Lock size={16} className="text-purple-400" />
                Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                className="bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 space-y-2">
                <p className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                  <Info size={14} />
                  Password Requirements:
                </p>
                <div className="space-y-1">
                  {[
                    "At least 8 characters",
                    "One uppercase letter",
                    "One lowercase letter",
                    "One number",
                  ].map((requirement, idx) => {
                    const isMet =
                      !validatePasswordStrength(password).includes(requirement);
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full ${isMet ? "bg-emerald-500" : "bg-gray-700"}`}
                        ></div>
                        <span
                          className={`text-xs ${isMet ? "text-emerald-400" : "text-gray-500"}`}
                        >
                          {requirement}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Lock size={16} className="text-purple-400" />
                Confirm Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
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
              disabled={loading || passwordErrors.length > 0}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus size={18} />
                  Create Account
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
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <Link href="/login">
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all py-3 rounded-lg font-semibold"
            >
              Sign In
            </Button>
          </Link>
        </div>

        {/* Terms of Service */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By creating an account, you agree to our{" "}
          <Link href="#" className="text-cyan-400 hover:text-cyan-300">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-cyan-400 hover:text-cyan-300">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
