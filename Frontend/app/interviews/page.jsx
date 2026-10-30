"use client"

import { useState } from "react"
import Header from "@/components/header"
import { interviewQuestions } from "@/lib/interview-questions"
import { Search, HelpCircle, ChevronDown, ChevronUp, Sparkles } from "lucide-react"

export default function InterviewsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState(null)

  const filteredQuestions = interviewQuestions.filter((q) => {
    const matchesLanguage = selectedLanguage === "All" || q.language === selectedLanguage
    const matchesCategory = selectedCategory === "All" || q.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesLanguage && matchesCategory && matchesSearch
  })

  const languages = ["All", ...new Set(interviewQuestions.map((q) => q.language))]
  const categories = ["All", ...new Set(interviewQuestions.map((q) => q.category))]

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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interview Prep & Concepts</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Technical Interview Questions</h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Master the core concepts tested at top tech companies. Filter by language or topic, review comprehensive explanations, and test your knowledge.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search questions by title, keyword, or concept..."
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
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</label>
            <div className="flex gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id
            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:border-slate-700 overflow-hidden transition-all duration-200"
              >
                <div
                  onClick={() => toggleExpand(q.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                        {q.language}
                      </span>
                      <span className="text-xs text-indigo-400 font-medium">{q.category}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getDifficultyBadge(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white hover:text-indigo-400 transition-colors">
                      {q.title}
                    </h3>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 bg-slate-950/40 text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 font-sans">
                      {q.answer}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-slate-800 bg-slate-900/30">
            <p className="text-slate-400 text-sm">No interview questions match your filter.</p>
          </div>
        )}
      </main>
    </div>
  )
}
