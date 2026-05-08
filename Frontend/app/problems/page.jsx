"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { codingProblems } from "@/lib/coding-problems"

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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Coding Problems</h1>
          <p className="text-muted-foreground">
            Practice your coding skills with {filteredProblems.length} problems - arrange from easy to hard
          </p>
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search problems by title, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-4 mb-8 flex-wrap">
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <div className="flex gap-2 flex-wrap">
              {languages.map((lang) => (
                <Button
                  key={lang}
                  variant={selectedLanguage === lang ? "default" : "outline"}
                  onClick={() => setSelectedLanguage(lang)}
                  size="sm"
                >
                  {lang}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <div className="flex gap-2 flex-wrap">
              {difficulties.map((diff) => (
                <Button
                  key={diff}
                  variant={selectedDifficulty === diff ? "default" : "outline"}
                  onClick={() => setSelectedDifficulty(diff)}
                  size="sm"
                >
                  {diff}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProblems.map((problem) => (
            <Card key={problem.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <CardTitle className="text-lg">{problem.title}</CardTitle>
                    <CardDescription>{problem.category}</CardDescription>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{problem.description}</p>
                <div className="flex gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded">{problem.language}</span>
                  <Button asChild size="sm" className="ml-auto">
                    <Link href={`/problems/${problem.id}`}>Solve</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No problems found matching your filters.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  )
}
