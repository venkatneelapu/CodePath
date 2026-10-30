"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authStorage } from "@/lib/auth";
import { predefinedRoadmaps } from "@/lib/predefined-roadmaps";
import {
  Compass,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  Code2,
  CheckCircle2,
  Filter,
} from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [enrollingId, setEnrollingId] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/users/profile", {
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          setUser(json.data);
        }
      } catch {
        // Logged-out users can still browse courses
      }
    }
    checkAuth();
  }, []);

  const addRoadmap = async (predefined) => {
    // If user is not logged in, redirect to signup
    if (!user) {
      router.push("/signup");
      return;
    }

    setEnrollingId(predefined.id);

    try {
      const res = await fetch("/api/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: predefined.title,
          description: predefined.description,
          topic: predefined.title,
          duration_days: predefined.steps?.length || 7,
          generateAI: true,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        router.push(`/roadmap/${json.data._id}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      router.push("/dashboard");
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredRoadmaps = predefinedRoadmaps.filter((roadmap) => {
    const matchesSearch =
      roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === "all" ||
      roadmap.level.toLowerCase() === selectedLevel.toLowerCase();
    return matchesSearch && matchesLevel;
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 relative overflow-hidden">
        {/* Background Ambient Mesh */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-15%,rgba(99,102,241,0.2),rgba(255,255,255,0))]" />
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>

        <div className="container mx-auto max-w-7xl">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-4">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              Curated Curriculum Catalog
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
              Explore Learning Paths
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Choose from production-tested roadmaps built to take you from foundational concepts to advanced engineering.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="max-w-4xl mx-auto mb-10 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search courses, skills, or frameworks (e.g. React, Python, Backend)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/[0.1] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 backdrop-blur-md transition-all"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {["all", "beginner", "intermediate", "advanced"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                    selectedLevel === lvl
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                      : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Course Grid */}
          {filteredRoadmaps.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-white/[0.08] max-w-xl mx-auto">
              <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <p className="text-white font-semibold">No roadmaps matched your search</p>
              <p className="text-slate-400 text-xs mt-1">Try adjusting your keyword filter or browse all levels.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRoadmaps.map((roadmap) => (
                <div
                  key={roadmap.id}
                  className="group rounded-2xl bg-slate-900/60 border border-white/[0.08] hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-300 p-6 flex flex-col justify-between backdrop-blur-xl shadow-xl hover:shadow-indigo-950/40 hover:-translate-y-1"
                >
                  <div>
                    {/* Tags Row */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                        {roadmap.level}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {roadmap.duration}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                      {roadmap.title}
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 mb-6 leading-relaxed">
                      {roadmap.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.08]">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                        {roadmap.steps?.length || 7} Daily Milestones
                      </span>
                      <span className="text-emerald-400 font-semibold">Self-Paced</span>
                    </div>

                    <Button
                      onClick={() => addRoadmap(roadmap)}
                      disabled={enrollingId === roadmap.id}
                      className="w-full h-10 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all border-0"
                    >
                      {enrollingId === roadmap.id ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Enrolling...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5">
                          Start Learning Path <ArrowRight size={14} />
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
