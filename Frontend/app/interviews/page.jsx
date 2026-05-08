"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { interviewQuestions } from "@/lib/interview-questions"
import { Search } from "lucide-react"

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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Interview Questions</h1>
          <p className="text-muted-foreground">
            {filteredQuestions.length} questions covering programming languages, data structures, algorithms, system
            design, and more
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search questions by title, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Language</label>
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
            <label className="block text-sm font-medium mb-2">Filter by Category</label>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                  size="sm"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="hover:shadow-lg transition-shadow">
              <CardHeader
                className="cursor-pointer"
                onClick={() => setExpandedId(expandedId === question.id ? null : question.id)}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{question.title}</CardTitle>
                    <CardDescription>
                      {question.language} • {question.category}
                    </CardDescription>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}
                  >
                    {question.difficulty}
                  </span>
                </div>
              </CardHeader>

              {expandedId === question.id && (
                <CardContent className="space-y-4 border-t pt-4">
                  <div>
                    <h3 className="font-semibold mb-2">Answer</h3>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded">
                      {question.answer}
                    </div>
                  </div>

                  {question.followUp && (
                    <div>
                      <h3 className="font-semibold mb-2">Follow-up Question</h3>
                      <p className="text-sm text-muted-foreground italic">{question.followUp}</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No questions found matching your filters.</p>
          </div>
        )}
      </main>
    </>
  )
}
