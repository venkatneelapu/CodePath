"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { topicsContent } from "@/lib/topics-content"

export default function TopicsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("Python")
  const [expandedId, setExpandedId] = useState(null)

  const filteredTopics = topicsContent.filter((t) => t.language === selectedLanguage)
  const languages = [...new Set(topicsContent.map((t) => t.language))]

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Learning Topics</h1>
          <p className="text-muted-foreground">Comprehensive learning materials for each programming language</p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Select Language</label>
          <div className="flex gap-2 flex-wrap">
            {languages.map((lang) => (
              <Button
                key={lang}
                variant={selectedLanguage === lang ? "default" : "outline"}
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredTopics.map((topic) => (
            <Card key={topic.id} className="hover:shadow-lg transition-shadow">
              <CardHeader
                className="cursor-pointer"
                onClick={() => setExpandedId(expandedId === topic.id ? null : topic.id)}
              >
                <div>
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  <CardDescription>{topic.category}</CardDescription>
                </div>
              </CardHeader>

              {expandedId === topic.id && (
                <CardContent className="border-t pt-4">
                  <div className="prose prose-sm max-w-none">
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">{topic.content}</div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
