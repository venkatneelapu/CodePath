'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authStorage, roadmapStorage } from '@/lib/auth'
import { BookOpen, Code2, CheckCircle2, ArrowRight, Clock, Zap, Calendar } from 'lucide-react'
import ContentViewer from '@/components/learning/content-viewer'

export default function RoadmapDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [roadmap, setRoadmap] = useState(null)
  const [completedDays, setCompletedDays] = useState({})
  const [loading, setLoading] = useState(true)
  const [currentDay, setCurrentDay] = useState(1)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showLearning, setShowLearning] = useState(true)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [completedItems, setCompletedItems] = useState({})
  const [expandedDays, setExpandedDays] = useState({})

  useEffect(() => {
    async function loadRoadmap() {
      try {
        const authRes = await fetch('/api/users/profile')
        if (!authRes.ok) {
          router.push('/login')
          return
        }

        const res = await fetch(`/api/roadmaps/${params.id}`)
        if (!res.ok) {
          router.push('/dashboard')
          return
        }

        const json = await res.json()
        const data = json.data

        const formattedDays = data.modules.map((m, idx) => ({
          ...m,
          id: m._id,
          day: idx + 1,
          title: m.title || `Day ${idx + 1}`,
          topic: data.topic || 'Learning Path',
          concepts: m.topics || m.concepts || ['Introduction', 'Core Concepts', 'Practice'],
          codingAssignment: m.codingAssignment || {
            title: 'Practice Assignment',
            description: 'Apply what you learned today in a simple project.',
            difficulty: 'easy',
            language: 'python'
          },
          quiz: m.quiz || {
            questions: [
              {
                id: 1,
                question: 'What is the main concept discussed in this module?',
                options: ['a) Correct Concept', 'b) Wrong Answer', 'c) Another Wrong Answer', 'd) None of the above'],
                correctAnswer: 'a'
              }
            ]
          }
        }))

        setRoadmap({ ...data, days: formattedDays, progress: data.completed_count ? Math.round((data.completed_count / data.module_count) * 100) : 0 })

        const completedObj = {}
        data.modules.forEach((m, idx) => {
          if (m.progress?.completed) {
            completedObj[idx + 1] = true
          }
        })
        setCompletedDays(completedObj)

        const firstUncompletedDay = formattedDays.find((d) => !completedObj[d.day])
        if (firstUncompletedDay) {
          setCurrentDay(firstUncompletedDay.day)
        }

        setLoading(false)
      } catch (err) {
        console.error('Error loading roadmap:', err)
        router.push('/dashboard')
      }
    }
    
    loadRoadmap()
  }, [params.id, router])

  const toggleDayCompletion = async (dayNumber) => {
    const dayData = roadmap.days.find(d => d.day === dayNumber)
    if (!dayData) return

    try {
      const res = await fetch(`/api/modules/${dayData.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      if (res.ok) {
        const newCompleted = {
          ...completedDays,
          [dayNumber]: true,
        }
        setCompletedDays(newCompleted)

        // Update overall progress locally
        if (roadmap?.days) {
          const completedCount = Object.values(newCompleted).filter(Boolean).length
          const progress = Math.round((completedCount / roadmap.days.length) * 100)
          setRoadmap({ ...roadmap, progress })
        }
      }
    } catch (err) {
      console.error('Error completing module', err)
    }
  }

  const toggleItemCompletion = (itemId) => {
    const newCompletedItems = {
      ...completedItems,
      [itemId]: !completedItems[itemId],
    }
    setCompletedItems(newCompletedItems)
    localStorage.setItem(`completed_path_${params.id}`, JSON.stringify(newCompletedItems))
  }

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }))
  }

  const submitQuiz = () => {
    const dayData = roadmap.days.find((d) => d.day === currentDay)
    if (!dayData) return

    const totalQuestions = dayData.quiz.questions.length
    let correctCount = 0
    
    dayData.quiz.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++
      }
    })

    const percentage = Math.round((correctCount / totalQuestions) * 100)
    const message = `Quiz Score: ${percentage}% (${correctCount}/${totalQuestions} correct)`
    console.log('[v0]', message)
    alert(message)

    if (percentage >= 60) {
      toggleDayCompletion(currentDay)
      setShowQuiz(false)
      setQuizAnswers({})
      alert('Great job! Day marked as complete. Move to the next day.')
    } else {
      alert('You need 60% to pass. Try again!')
    }
  }

  const setLearningPath = (path) => {
    // Implementation for setLearningPath
  }

  if (loading)
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400 mb-4"></div>
            <p className="text-white">Loading roadmap...</p>
          </div>
        </div>
      </>
    )

  if (!roadmap)
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black flex items-center justify-center">
          <p className="text-white text-xl">Roadmap not found</p>
        </div>
      </>
    )

  // Support both old format (learningPath) and new format (days)
  const isDaywise = roadmap.days && roadmap.days.length > 0
  const days = isDaywise ? roadmap.days : []
  const completedCount = Object.values(completedDays).filter(Boolean).length
  const progress = isDaywise ? Math.round((completedCount / days.length) * 100) : roadmap.progress || 0

  const currentDayData = isDaywise ? days.find((d) => d.day === currentDay) : null

  return (
    <>
      <Header />
      <main className="relative min-h-screen bg-black overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <div
            className="absolute w-[500px] h-[500px] bg-gradient-to-br from-blue-600 via-cyan-500 to-transparent rounded-full blur-3xl opacity-20"
            style={{ top: '10%', left: '-200px', animation: 'blob 7s infinite' }}
          ></div>
          <div
            className="absolute w-[500px] h-[500px] bg-gradient-to-br from-purple-600 via-blue-500 to-transparent rounded-full blur-3xl opacity-20"
            style={{ top: '50%', right: '-200px', animation: 'blob 9s infinite 2s' }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mb-6 border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            ← Back
          </Button>

          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white mb-2">{roadmap.title}</h1>
            <p className="text-gray-400 text-lg mb-6">{roadmap.description}</p>

            {/* Progress Card */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm font-semibold">OVERALL PROGRESS</p>
                  <p className="text-4xl font-bold text-cyan-400 mt-1">{progress}%</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Days Completed</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {completedCount}/{days.length}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Day-wise Content */}
          {isDaywise ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Day Navigation Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-2xl p-4 max-h-[600px] overflow-y-auto">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Calendar size={20} />
                    Days
                  </h3>
                  <div className="space-y-2">
                    {days.map((day) => (
                      <button
                        key={day.day}
                        onClick={() => {
                          setCurrentDay(day.day)
                          setShowQuiz(false)
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between ${
                          currentDay === day.day
                            ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                            : completedDays[day.day]
                              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
                              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/30'
                        }`}
                      >
                        <span className="font-semibold">Day {day.day}</span>
                        {completedDays[day.day] && <CheckCircle2 size={18} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-3">
                {currentDayData && (
                  <div className="space-y-6">
                    {/* Learning Content Tab */}
                    {showLearning && !showQuiz && (
                      <>
                        {/* Tab Navigation */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowLearning(true)}
                            className="px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg flex items-center gap-2"
                          >
                            <BookOpen size={20} />
                            Learn
                          </button>
                          <button
                            onClick={() => setShowLearning(false)}
                            className="px-6 py-3 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 flex items-center gap-2"
                          >
                            <Code2 size={20} />
                            Assignment
                          </button>
                        </div>

                        {/* Learning Content */}
                        <ContentViewer
                          topic={roadmap.topic}
                          day={currentDayData.day}
                          concepts={currentDayData.concepts}
                          level={roadmap.level}
                        />
                      </>
                    )}

                    {/* Assignment Tab */}
                    {!showLearning && !showQuiz && (
                      <>
                        {/* Tab Navigation */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowLearning(true)}
                            className="px-6 py-3 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 flex items-center gap-2"
                          >
                            <BookOpen size={20} />
                            Learn
                          </button>
                          <button
                            onClick={() => setShowLearning(false)}
                            className="px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg flex items-center gap-2"
                          >
                            <Code2 size={20} />
                            Assignment
                          </button>
                        </div>

                        {/* Day Overview */}
                        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-cyan-500/30 rounded-2xl p-8">
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <p className="text-cyan-400 text-sm font-bold tracking-widest mb-2">DAY {currentDayData.day}</p>
                              <h2 className="text-4xl font-bold text-white">{currentDayData.title}</h2>
                            </div>
                            {completedDays[currentDayData.day] && (
                              <CheckCircle2 size={40} className="text-emerald-400" />
                            )}
                          </div>
                          <p className="text-gray-300 text-lg mb-6">{currentDayData.topic}</p>

                          {/* Key Concepts */}
                          <div className="mb-8">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                              <Zap size={20} className="text-yellow-400" />
                              Key Concepts
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                              {currentDayData.concepts.map((concept, idx) => (
                                <div
                                  key={idx}
                                  className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 text-blue-300 text-sm"
                                >
                                  ✓ {concept}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Coding Assignment */}
                          <div className="mb-8 bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/30 rounded-xl p-6">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                              <Code2 size={20} className="text-purple-400" />
                              Coding Assignment
                            </h3>
                            <div className="space-y-3">
                              <div>
                                <p className="text-gray-400 text-sm">TASK</p>
                                <p className="text-white font-semibold">{currentDayData.codingAssignment.title}</p>
                              </div>
                              <p className="text-gray-300">{currentDayData.codingAssignment.description}</p>
                              <div className="flex gap-4">
                                <div>
                                  <p className="text-gray-400 text-sm">Difficulty</p>
                                  <p className="text-purple-300 font-semibold capitalize">
                                    {currentDayData.codingAssignment.difficulty}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-sm">Language</p>
                                  <p className="text-purple-300 font-semibold capitalize">
                                    {currentDayData.codingAssignment.language}
                                  </p>
                                </div>
                              </div>
                              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4">
                                <Code2 size={18} className="mr-2" />
                                Open Code Editor
                              </Button>
                            </div>
                          </div>

                          {/* Quiz Button */}
                          <Button
                            onClick={() => setShowQuiz(true)}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-6 text-lg font-bold"
                          >
                            <BookOpen size={20} className="mr-2" />
                            Take Daily Quiz (15 Questions)
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Quiz Display */}
                    {showQuiz && currentDayData && (
                      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-blue-500/30 rounded-2xl p-8">
                        <h2 className="text-3xl font-bold text-white mb-8">Day {currentDayData.day} Quiz</h2>
                        <div className="space-y-6 max-h-[600px] overflow-y-auto">
                          {currentDayData.quiz.questions.map((question) => (
                            <div key={question.id} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                              <p className="text-white font-semibold mb-4">
                                Q{question.id}. {question.question}
                              </p>
                              <div className="space-y-3">
                                {question.options.map((option, idx) => {
                                  const optionLetter = option.split(')')[0].trim()
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => setQuizAnswers({ ...quizAnswers, [question.id]: optionLetter })}
                                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                                        quizAnswers[question.id] === optionLetter
                                          ? 'bg-cyan-600 border-cyan-600 text-white'
                                          : 'bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50'
                                      }`}
                                    >
                                      {option}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-4 mt-8">
                          <Button
                            onClick={() => setShowQuiz(false)}
                            variant="outline"
                            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            Back
                          </Button>
                          <Button
                            onClick={submitQuiz}
                            className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-bold"
                          >
                            Submit Quiz
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons - Only show when not on quiz and learning content is loaded */}
                    {!showQuiz && currentDayData && (
                      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-2xl p-6 mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Review Content Button */}
                          <Button
                            onClick={() => setShowLearning(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                          >
                            <BookOpen size={20} />
                            Review Content
                          </Button>

                          {/* Mark as Complete Button */}
                          <Button
                            onClick={() => {
                              toggleDayCompletion(currentDay)
                              console.log('[v0] Marked day', currentDay, 'as complete')
                            }}
                            className={`font-bold py-3 rounded-lg flex items-center justify-center gap-2 ${
                              completedDays[currentDay]
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                            }`}
                          >
                            <CheckCircle2 size={20} />
                            {completedDays[currentDay] ? 'Completed ✓' : 'Mark Complete'}
                          </Button>

                          {/* Next Day Button */}
                          <Button
                            onClick={() => {
                              const nextDay = currentDay + 1
                              const nextDayData = days.find((d) => d.day === nextDay)
                              if (nextDayData) {
                                setCurrentDay(nextDay)
                                setShowQuiz(false)
                                setShowLearning(true)
                                setQuizAnswers({})
                                console.log('[v0] Moving to day', nextDay)
                              }
                            }}
                            disabled={!days.find((d) => d.day === currentDay + 1)}
                            className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                          >
                            <ArrowRight size={20} />
                            Next Day
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-2xl p-8 text-center">
              <p className="text-gray-400 text-lg">This roadmap uses an older format. Please create a new day-wise roadmap.</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
