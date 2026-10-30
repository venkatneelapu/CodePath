"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { codingProblems } from "@/lib/coding-problems"
import { Search, Code2, Sparkles, ArrowRight, Filter } from "lucide-react"

export default function ProblemsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProblems = codingProblems
    .filter((problem) => {
      const languageMatch = selectedLanguage === "All" || problem.language === selectedLanguage
      const difficultyMatch = selectedDifficulty === "All" || problem.difficulty === selectedDifficulty
      const searchMatch =
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.category.toLowerCase().includes(searchQuery.toLowerCase())
      return languageMatch && difficultyMatch && searchMatch
    })
    .sort((a, b) => {
      const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 }
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
    })

  const languages = ["All", ...new Set(codingProblems.map((p) => p.language))]
  const difficulties = ["All", "Easy", "Medium", "Hard"]

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30"
      case "Hard":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30"
      default:
        return "bg-slate-800 text-slate-400 border-slate-700"
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-3">
            <Code2 className="w-3.5 h-3.5" />
            <span>Problem Bank & Practice</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Coding Problems</h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Sharpen your algorithmic thinking with {filteredProblems.length} curated problems across JavaScript, Python, TypeScript, and DSA.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search problems by title, category, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-6 mb-8 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Language</label>
            <div className="flex gap-1.5 flex-wrap">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedLanguage === lang
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Difficulty</label>
            <div className="flex gap-1.5 flex-wrap">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedDifficulty === diff
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid of Problems */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700 p-5 flex flex-col justify-between transition-all duration-200 group"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {problem.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getDifficultyBadge(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <p className="text-xs text-indigo-400/90 font-medium mb-2">{problem.category}</p>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {problem.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 mt-auto">
                <span className="text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60 font-mono">
                  {problem.language}
                </span>
                <Link
                  href={`/problems/${problem.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Solve Problem <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-slate-800 bg-slate-900/30">
            <p className="text-slate-400 text-sm">No problems found matching your current filter.</p>
          </div>
        )}
      </main>
    </div>
  )
}
