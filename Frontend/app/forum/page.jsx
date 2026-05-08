'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authStorage } from '@/lib/auth'

export default function ForumPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [threads, setThreads] = useState([])
  const [newThread, setNewThread] = useState({ title: '', category: 'general', content: '' })
  const [showNewThread, setShowNewThread] = useState(false)

  useEffect(() => {
    const currentUser = authStorage.getUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)
    loadThreads()
  }, [router])

  const loadThreads = () => {
    const saved = localStorage.getItem('forum-threads')
    if (saved) {
      setThreads(JSON.parse(saved))
    } else {
      const defaultThreads = [
        {
          id: 1,
          title: 'Best way to learn React?',
          author: 'John Doe',
          category: 'react',
          replies: 12,
          views: 256,
          createdAt: new Date(Date.now() - 2*24*60*60*1000).toLocaleDateString(),
        },
        {
          id: 2,
          title: 'Python vs JavaScript for beginners',
          author: 'Jane Smith',
          category: 'general',
          replies: 8,
          views: 189,
          createdAt: new Date(Date.now() - 1*24*60*60*1000).toLocaleDateString(),
        },
      ]
      setThreads(defaultThreads)
    }
  }

  const createThread = () => {
    if (!newThread.title.trim() || !newThread.content.trim()) return

    const thread = {
      id: Date.now(),
      title: newThread.title,
      author: user.name,
      category: newThread.category,
      replies: 0,
      views: 0,
      createdAt: new Date().toLocaleDateString(),
    }

    const updated = [thread, ...threads]
    setThreads(updated)
    localStorage.setItem('forum-threads', JSON.stringify(updated))
    setNewThread({ title: '', category: 'general', content: '' })
    setShowNewThread(false)
  }

  if (!user) return <div>Loading...</div>

  const categories = [
    { value: 'general', label: 'General Discussion' },
    { value: 'react', label: 'React & Frontend' },
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'data-structures', label: 'Data Structures' },
    { value: 'help', label: 'Help Wanted' },
  ]

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Community Forum</h1>
            <p className="text-muted-foreground mt-2">Share knowledge, ask questions, and help others learn</p>
          </div>
          <Button onClick={() => setShowNewThread(!showNewThread)}>
            {showNewThread ? 'Cancel' : 'New Thread'}
          </Button>
        </div>

        {showNewThread && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Discussion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="text"
                placeholder="Thread title..."
                value={newThread.title}
                onChange={e => setNewThread({ ...newThread, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <select
                value={newThread.category}
                onChange={e => setNewThread({ ...newThread, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <textarea
                placeholder="Your message..."
                value={newThread.content}
                onChange={e => setNewThread({ ...newThread, content: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg h-32"
              />
              <div className="flex gap-2">
                <Button onClick={createThread}>Post Thread</Button>
                <Button variant="outline" onClick={() => setShowNewThread(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {threads.map(thread => (
            <Card key={thread.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{thread.title}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>By {thread.author}</span>
                      <span>{thread.createdAt}</span>
                      <span className="bg-muted px-2 py-1 rounded text-xs">{thread.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{thread.replies} replies</div>
                    <div className="text-sm text-muted-foreground">{thread.views} views</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
