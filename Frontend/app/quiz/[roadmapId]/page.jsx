'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { authStorage, streakStorage, progressStorage, roadmapStorage } from '@/lib/auth'
import { quizzes, enhancedRoadmaps } from '@/lib/roadmap-data'
import Header from '@/components/header'

export default function QuizPage() {
  const router = useRouter()
  const params = useParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [quiz, setQuiz] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadQuiz = async () => {
      const currentUser = authStorage.getUser()
      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)

      // Try to load from static data first
      const roadmapQuizzes = quizzes[params.roadmapId]
      if (roadmapQuizzes && roadmapQuizzes.length > 0) {
        console.log('[v0] Loading quiz from static data')
        setQuiz(roadmapQuizzes[0])
        setSelectedAnswers(new Array(roadmapQuizzes[0].questions.length).fill(undefined))
        setIsLoading(false)
        return
      }

      // Generate quiz using AI based on roadmap topics
      try {
        console.log('[v0] Generating AI quiz for roadmap:', params.roadmapId)
        
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
          ? roadmap.topics.map((t) => (typeof t === 'string' ? t : t.title)).slice(0, 3)
          : [roadmap.title || 'General Topics']
        
        const response = await fetch('/api/gemini/generate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roadmapId: params.roadmapId,
            topicsCovered,
            difficulty: roadmap.level || roadmap.difficulty || 'intermediate',
          }),
        })

        if (!response.ok) throw new Error('Failed to generate quiz')

        const generatedQuiz = await response.json()
        console.log('[v0] AI quiz generated successfully')
        setQuiz(generatedQuiz)
        setSelectedAnswers(new Array(generatedQuiz.questions.length).fill(undefined))
      } catch (error) {
        console.error('[v0] Error generating quiz:', error)
        // Fallback quiz if generation fails
        setQuiz({
          id: 'fallback-quiz',
          title: 'Quick Assessment',
          questions: [
            {
              id: 'q1',
              question: 'What did you learn from this roadmap?',
              options: ['Fundamentals', 'Intermediate concepts', 'Advanced techniques', 'All of the above'],
              correct: 3,
              explanation: 'Great job! You should have learned concepts at all levels.',
            },
          ],
        })
        setSelectedAnswers([undefined])
      } finally {
        setIsLoading(false)
      }
    }

    loadQuiz()
  }, [params.roadmapId, router])

  if (isLoading || !quiz) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
          <Card className="glass-card border border-violet-500/30 w-full max-w-md">
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-400 mx-auto mb-4"></div>
                <p className="text-white">Generating personalized quiz...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = optionIndex
    setSelectedAnswers(newAnswers)

    if (optionIndex === quiz.questions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const handleQuizComplete = () => {
    if (user) {
      const percentage = Math.round((score / quiz.questions.length) * 100)
      progressStorage.saveQuizScore(user.id, params.roadmapId, quiz.id, score, quiz.questions.length)
      streakStorage.recordActivity(user.id, 'quiz_passed', {
        roadmapId: params.roadmapId,
        score: percentage,
      })
    }
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleQuizComplete()
      setShowResults(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResults(false)
    setSelectedAnswers(new Array(quiz.questions.length).fill(undefined))
  }

  if (showResults) {
    const percentage = Math.round((score / quiz.questions.length) * 100)
    const isPassed = percentage >= 60
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card border border-violet-500/30">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Quiz Results</CardTitle>
                <CardDescription className="text-slate-400">{quiz.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className={`text-6xl font-bold mb-2 ${isPassed ? 'text-green-400' : 'text-yellow-400'}`}>
                    {percentage}%
                  </div>
                  <div className="text-lg text-slate-300">
                    You scored {score} out of {quiz.questions.length}
                  </div>
                  <div className={`text-sm font-semibold mt-2 ${isPassed ? 'text-green-400' : 'text-yellow-400'}`}>
                    {isPassed ? '🎉 Great job! You passed!' : '📚 Keep learning and try again!'}
                  </div>
                </div>

                <div className="space-y-4">
                  {quiz.questions.map((question, idx) => (
                    <div key={idx} className="border border-violet-500/20 rounded-lg p-4 bg-slate-800/50">
                      <p className="font-semibold text-white mb-2">{question.question}</p>
                      <p className="text-sm text-slate-400 mb-2">
                        Your answer: {question.options[selectedAnswers[idx]]}
                      </p>
                      {selectedAnswers[idx] !== question.correct && (
                        <p className="text-sm text-green-400">Correct answer: {question.options[question.correct]}</p>
                      )}
                      <p className="text-sm text-slate-300 mt-2">{question.explanation}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleRestart} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white">
                    Retake Quiz
                  </Button>
                  <Button onClick={() => router.push('/dashboard')} variant="outline" className="flex-1 border-violet-500/30 text-violet-300 hover:bg-violet-500/20">
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="glass-card border border-violet-500/30">
            <CardHeader>
              <CardTitle className="text-white text-2xl">{quiz.title}</CardTitle>
              <CardDescription className="text-slate-400">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </CardDescription>
              <Progress value={progress} className="mt-4 bg-slate-700" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">{question.question}</h3>
                <div className="space-y-3">
                  {question.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full p-4 text-left border rounded-lg transition-all ${
                        selectedAnswers[currentQuestion] === idx
                          ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/50'
                          : 'border-violet-500/20 text-slate-300 hover:bg-violet-500/20 hover:border-violet-500/40'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleNext}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                disabled={selectedAnswers[currentQuestion] === undefined}
              >
                {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
