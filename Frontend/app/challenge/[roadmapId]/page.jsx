'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authStorage, progressStorage, streakStorage, roadmapStorage } from '@/lib/auth'
import { codingChallenges, enhancedRoadmaps } from '@/lib/roadmap-data'
import { executeCode, validateCode } from '@/lib/code-executor'
import Header from '@/components/header'
import { BookOpen, Code2, AlertCircle } from 'lucide-react'

export default function ChallengePage() {
  const router = useRouter()
  const params = useParams()
  const [challenges, setChallenges] = useState([])
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [completedChallenges, setCompletedChallenges] = useState([])
  const [user, setUser] = useState(null)
  const [language, setLanguage] = useState('python')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadChallenges = async () => {
      const currentUser = authStorage.getUser()
      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)

      // Try to load from static data first
      let roadmapChallenges = codingChallenges[params.roadmapId] || []
      
      // If no static challenges, generate using AI
      if (roadmapChallenges.length === 0) {
        try {
          console.log('[v0] Generating AI challenges for roadmap:', params.roadmapId)
          
          // Try to find in user's roadmaps first, then check enhanced roadmaps
          let roadmap = roadmapStorage.getRoadmap(params.roadmapId)
          if (!roadmap) {
            roadmap = enhancedRoadmaps.find((r) => r.id === params.roadmapId)
          }
          
          if (!roadmap) {
            throw new Error('Roadmap not found')
          }

          // Extract topics from either format
          const topicsCovered = Array.isArray(roadmap.topics)
            ? roadmap.topics.map((t) => (typeof t === 'string' ? t : t.title)).slice(0, 2)
            : [roadmap.title || 'General Topics']
          
          const langFromRoadmap = roadmap.language === 'Python' || roadmap.language === 'python' ? 'python' : 'javascript'
          
          const response = await fetch('/api/gemini/generate-challenge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roadmapId: params.roadmapId,
              topicsCovered,
              difficulty: roadmap.level || 'intermediate',
              language: langFromRoadmap,
            }),
          })

          if (response.ok) {
            const generatedChallenge = await response.json()
            roadmapChallenges = [generatedChallenge]
            console.log('[v0] AI challenge generated successfully')
          }
        } catch (error) {
          console.error('[v0] Error generating challenge:', error)
          // Fallback challenge
          roadmapChallenges = [
            {
              id: 'fallback-challenge',
              title: 'Hello World Challenge',
              description: 'Write a program that prints "Hello, World!"',
              problemStatement: 'Create a simple program that outputs "Hello, World!" to the console.',
              examples: [
                { input: 'None', output: 'Hello, World!', explanation: 'Print the greeting' },
              ],
              constraints: ['Output must be exactly "Hello, World!"'],
              hints: ['Use the print function'],
              starterCode: language === 'python' ? 'print("Hello, World!")' : 'console.log("Hello, World!")',
              difficulty: 'Easy',
            },
          ]
        }
      }

      setChallenges(roadmapChallenges)
      if (roadmapChallenges.length > 0) {
        setCode(roadmapChallenges[0].starterCode || '')
        setLanguage(params.roadmapId.includes('python') ? 'python' : 'javascript')
      }

      const completed = JSON.parse(localStorage.getItem(`completed_challenges_${currentUser.id}`) || '[]')
      setCompletedChallenges(completed)
      setIsLoading(false)
    }

    loadChallenges()
  }, [params.roadmapId, router])

  const handleRunCode = async () => {
    setIsRunning(true)
    try {
      const validation = validateCode(code, language)
      if (!validation.valid) {
        setOutput(`Validation Error: ${validation.error}`)
        setIsRunning(false)
        return
      }

      const result = await executeCode(code, language)
      setOutput(result.output)
    } catch (error) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = () => {
    if (!user) return

    const completed = JSON.parse(localStorage.getItem(`completed_challenges_${user.id}`) || '[]')
    if (!completed.includes(challenges[currentChallengeIdx].id)) {
      completed.push(challenges[currentChallengeIdx].id)
      localStorage.setItem(`completed_challenges_${user.id}`, JSON.stringify(completed))
      setCompletedChallenges(completed)

      progressStorage.saveChallengeCompletion(user.id, params.roadmapId, challenges[currentChallengeIdx].id, 5)
      streakStorage.recordActivity(user.id, 'problem_solved', {
        roadmapId: params.roadmapId,
        challengeId: challenges[currentChallengeIdx].id,
        title: challenges[currentChallengeIdx].title,
      })
    }

    if (currentChallengeIdx < challenges.length - 1) {
      setCurrentChallengeIdx(currentChallengeIdx + 1)
      setCode(challenges[currentChallengeIdx + 1].starterCode || '')
      setOutput('')
    } else {
      router.push('/dashboard')
    }
  }

  if (isLoading || !challenges.length) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
          <Card className="glass-card border border-violet-500/30 w-full max-w-md">
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-400 mx-auto mb-4"></div>
                <p className="text-white">Generating personalized challenges...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  if (!challenges[currentChallengeIdx]) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
          <Card className="glass-card border border-violet-500/30 w-full max-w-md">
            <CardContent className="pt-8">
              <div className="text-center">
                <AlertCircle className="mx-auto mb-4 text-yellow-400" size={32} />
                <p className="text-white">No challenges available</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Challenge Description */}
            <div className="space-y-4">
              <Card className="glass-card border border-violet-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center gap-2">
                    <BookOpen className="text-violet-400" size={24} />
                    {challenges[currentChallengeIdx].title}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Difficulty: <span className="font-semibold text-violet-300">{challenges[currentChallengeIdx].difficulty || 'Intermediate'}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">{challenges[currentChallengeIdx].description || challenges[currentChallengeIdx].problemStatement}</p>

                  {challenges[currentChallengeIdx].examples && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Examples:</h4>
                      <div className="space-y-2">
                        {challenges[currentChallengeIdx].examples.map((example, idx) => (
                          <div key={idx} className="bg-slate-800/50 border border-violet-500/20 p-3 rounded text-sm">
                            <p className="text-slate-400">Input: <span className="text-violet-300">{example.input}</span></p>
                            <p className="text-slate-400">Output: <span className="text-green-400">{example.output}</span></p>
                            {example.explanation && <p className="text-slate-500 text-xs mt-1">{example.explanation}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {challenges[currentChallengeIdx].testCases && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Test Cases:</h4>
                      <div className="space-y-2">
                        {challenges[currentChallengeIdx].testCases.map((testCase, idx) => (
                          <div key={idx} className="bg-slate-800/50 border border-violet-500/20 p-3 rounded text-sm">
                            <p className="text-slate-400">Input: {testCase.input || 'None'}</p>
                            <p className="text-slate-400">Expected: {testCase.expected}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {challenges[currentChallengeIdx].hints && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Hints:</h4>
                      <ul className="space-y-1">
                        {challenges[currentChallengeIdx].hints.map((hint, idx) => (
                          <li key={idx} className="text-sm text-slate-400">
                            • {hint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {currentChallengeIdx > 0 && (
                      <Button
                        onClick={() => {
                          setCurrentChallengeIdx(currentChallengeIdx - 1)
                          setCode(challenges[currentChallengeIdx - 1].starterCode || '')
                          setOutput('')
                        }}
                        variant="outline"
                        className="border-violet-500/30 text-violet-300 hover:bg-violet-500/20"
                      >
                        Previous
                      </Button>
                    )}
                    {currentChallengeIdx < challenges.length - 1 && (
                      <Button
                        onClick={() => {
                          setCurrentChallengeIdx(currentChallengeIdx + 1)
                          setCode(challenges[currentChallengeIdx + 1].starterCode || '')
                          setOutput('')
                        }}
                        variant="outline"
                        className="border-violet-500/30 text-violet-300 hover:bg-violet-500/20"
                      >
                        Skip
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Code Editor */}
            <div className="space-y-4">
              <Card className="glass-card border border-violet-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center gap-2">
                    <Code2 className="text-violet-400" size={24} />
                    Code Editor
                  </CardTitle>
                  <CardDescription className="text-slate-400">Language: <span className="text-violet-300 font-semibold">{language}</span></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-64 p-4 bg-slate-800 border border-violet-500/20 rounded font-mono text-sm text-slate-100 focus:outline-none focus:border-violet-500"
                    placeholder="Write your code here..."
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isRunning ? 'Running...' : 'Run Code'}
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      Submit Solution
                    </Button>
                  </div>

                  {output && (
                    <div className="bg-slate-800 border border-violet-500/20 p-4 rounded">
                      <h4 className="font-semibold text-white mb-2">Output:</h4>
                      <pre className="text-sm whitespace-pre-wrap font-mono text-slate-300">{output}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Challenge Progress */}
          {challenges.length > 1 && (
            <Card className="mt-6 glass-card border border-violet-500/30">
              <CardHeader>
                <CardTitle className="text-white">Challenge Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {challenges.map((challenge, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentChallengeIdx(idx)
                        setCode(challenge.starterCode || '')
                        setOutput('')
                      }}
                      className={`px-4 py-2 rounded border transition-all ${
                        idx === currentChallengeIdx
                          ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/50'
                          : completedChallenges.includes(challenge.id)
                            ? 'bg-green-600/30 text-green-300 border-green-500/30'
                            : 'border-violet-500/30 text-slate-300 hover:bg-violet-500/20'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
