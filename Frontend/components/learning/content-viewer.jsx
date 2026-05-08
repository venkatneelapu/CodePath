'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Code2, Lightbulb, CheckCircle2, ArrowRight, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContentViewer({ topic, day, concepts, level }) {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState(null)
  const [quotaExceeded, setQuotaExceeded] = useState(false)

  // Generate cache key
  const getCacheKey = () => `learning_content_${topic}_day${day}`

  // Load from cache or API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Check cache first
        const cacheKey = getCacheKey()
        const cachedContent = localStorage.getItem(cacheKey)
        
        if (cachedContent) {
          console.log('[v0] Loading content from cache for Day', day)
          setContent(JSON.parse(cachedContent))
          setLoading(false)
          return
        }

        // Fallback content for when API quota is exceeded
        const fallbackContent = generateFallbackContent(topic, day, concepts)

        console.log('[v0] Fetching learning content for Day', day)
        const response = await fetch('/api/gemini/generate-learning-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, day, concepts, level }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          
          // Check if it's a quota error (429)
          if (response.status === 429) {
            console.warn('[v0] API quota exceeded, using fallback content')
            setQuotaExceeded(true)
            setContent(fallbackContent)
            setLoading(false)
            return
          }

          throw new Error(errorData.error || 'Failed to fetch content')
        }

        const data = await response.json()
        
        // Cache the content
        localStorage.setItem(cacheKey, JSON.stringify(data.content))
        setContent(data.content)
      } catch (error) {
        console.error('[v0] Error fetching content:', error.message)
        // Use fallback content on any error
        setContent(generateFallbackContent(topic, day, concepts))
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [topic, day, concepts, level])

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Escape HTML entities in code to prevent React from interpreting them as JSX
  const escapeHTMLEntities = (str) => {
    if (typeof str !== 'string') return str
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }
    return str.replace(/[&<>"']/g, (char) => map[char])
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-8 animate-pulse">
          <div className="h-6 bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-600 rounded w-5/6"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-gray-600 rounded w-1/4 mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-600 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <p className="text-red-300">Unable to load learning content. Please try again later.</p>
      </div>
    )
  }

  // Show quota exceeded warning if applicable
  let quotaWarning = null
  if (quotaExceeded) {
    quotaWarning = (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6">
        <p className="text-yellow-300 text-sm">
          <strong>Note:</strong> Using pre-loaded content. API quota reset tomorrow. Content is still valid for learning!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Quota Warning */}
      {quotaWarning}

      {/* Introduction */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8">
        <div className="flex items-start gap-4">
          <BookOpen className="text-cyan-400 flex-shrink-0 mt-1" size={24} />
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">Today's Lesson</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{content.introduction}</p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      {content.sections && content.sections.length > 0 && (
        <div className="space-y-8">
          {content.sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="space-y-6">
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-700/50">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-600/30 border border-purple-500/30 rounded-lg">
                  <span className="text-purple-300 font-bold">{sectionIdx + 1}</span>
                </div>
                <h3 className="text-2xl font-bold text-white">{section.title}</h3>
              </div>

              {/* Explanation */}
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                <p className="text-gray-300 text-lg leading-relaxed">{section.explanation}</p>
              </div>

              {/* Examples */}
              {section.examples && section.examples.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Code2 size={20} className="text-orange-400" />
                    Examples
                  </h4>
                  <div className="grid gap-4">
                    {section.examples.map((example, exIdx) => (
                      <div
                        key={exIdx}
                        className="bg-gray-900/50 border border-gray-700/50 rounded-xl overflow-hidden"
                      >
                        {/* Example Title */}
                        <div className="bg-gray-800/50 border-b border-gray-700/50 px-6 py-3">
                          <p className="text-sm font-semibold text-orange-300">{example.title}</p>
                        </div>

                        {/* Code Block */}
                        {example.code && (
                          <div className="relative">
                            <div className="bg-gray-950 p-6 font-mono text-sm overflow-x-auto">
                              <pre className="text-gray-300 whitespace-pre-wrap break-words">
                                {escapeHTMLEntities(example.code)}
                              </pre>
                            </div>
                            <button
                              onClick={() => copyToClipboard(example.code, `code-${sectionIdx}-${exIdx}`)}
                              className="absolute top-2 right-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 p-2 rounded transition-all"
                              title="Copy code"
                            >
                              {copiedCode === `code-${sectionIdx}-${exIdx}` ? (
                                <CheckCircle2 size={18} className="text-emerald-400" />
                              ) : (
                                <Copy size={18} />
                              )}
                            </button>
                          </div>
                        )}

                        {/* Output */}
                        {example.output && (
                          <div className="bg-gray-800/30 border-t border-gray-700/50 px-6 py-4">
                            <p className="text-xs font-semibold text-gray-400 mb-2">OUTPUT:</p>
                            <pre className="text-emerald-300 font-mono text-sm whitespace-pre-wrap break-words">
                              {escapeHTMLEntities(example.output)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Points */}
              {section.keyPoints && section.keyPoints.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Lightbulb size={20} className="text-yellow-400" />
                    Key Points to Remember
                  </h4>
                  <div className="space-y-2">
                    {section.keyPoints.map((point, ptIdx) => (
                      <div
                        key={ptIdx}
                        className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4"
                      >
                        <CheckCircle2 size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-300">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {content.summary && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-4">Summary</h3>
          <p className="text-gray-300 text-lg leading-relaxed">{content.summary}</p>
        </div>
      )}

      {/* Practice Ideas */}
      {content.practiceIdeas && content.practiceIdeas.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Lightbulb size={24} className="text-emerald-400" />
            Practice Ideas
          </h3>
          <ul className="space-y-3">
            {content.practiceIdeas.map((idea, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-300 text-xs font-bold">{idx + 1}</span>
                </div>
                <span className="text-gray-300 text-base leading-relaxed">{idea}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}

// Generate fallback content when API quota is exceeded
function generateFallbackContent(topic, day, concepts) {
  // Safely escape HTML-like content to prevent React from interpreting it as JSX
  const escapeHTML = (str) => {
    if (typeof str !== 'string') return str
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  return {
    introduction: `Today you'll learn about ${concepts[0] || topic}. This is a fundamental concept that will help you understand ${topic} better. Let's explore this step by step.`,
    sections: (concepts || []).map((concept, idx) => ({
      title: `Concept ${idx + 1}: ${concept}`,
      explanation: `${concept} is an important part of ${topic}. It helps you ${topic.toLowerCase()} more effectively. Understanding this concept will give you a solid foundation.`,
      examples: [
        {
          title: `Example 1: Basic ${concept}`,
          code: escapeHTML(`// Learn about ${concept}\n// This is a placeholder example\n// Real API content will load when available`),
          output: 'Check the code above to understand how this works',
        },
        {
          title: `Example 2: Practical Use`,
          code: escapeHTML(`// Practical application of ${concept}\n// Try modifying this code\n// Experiment with different values`),
          output: 'See the results of your experiments',
        },
      ],
      keyPoints: [
        `${concept} is essential for ${topic}`,
        'Practice using this concept regularly',
        'Understand the core principles',
        'Apply it in real projects',
      ],
    })),
    summary: `You've learned about ${concepts.join(', ')} today. These are key concepts in ${topic}. Keep practicing these ideas to strengthen your understanding. The full content will be available when the API quota resets tomorrow.`,
    practiceIdeas: [
      `Create a simple project using ${concepts[0] || 'the concepts'} you learned`,
      'Write code examples to practice these concepts',
      'Explain these ideas to someone else',
      'Find real-world applications',
      'Review and refine your understanding',
    ],
  }
}
