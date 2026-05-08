import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="LearnFlow Home">
          <div className="h-7 w-7 rounded-md bg-primary" />
          <span className="text-lg font-semibold">LearnFlow</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#generate" className="hover:text-foreground/80">
            AI Roadmap
          </a>
          <a href="#roadmaps" className="hover:text-foreground/80">
            Tracks
          </a>
          <a href="#cta" className="hover:text-foreground/80">
            Get Started
          </a>
        </nav>

        <Button asChild className="ml-4">
          <a href="#generate">Create My Plan</a>
        </Button>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold text-balance">
              Master new skills with an AI roadmap tailored to you
            </h1>
            <p className="mt-4 text-muted-foreground text-pretty">
              Tell us your goal, time, and current level. We’ll organize the perfect learning path and keep you on
              track—no more guessing what to learn next.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Button asChild>
                <a href="#generate">Generate a Plan</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#roadmaps">Browse Tracks</a>
              </Button>
            </div>
            <p className="sr-only">Hero call to action buttons</p>
          </div>

          <div className="rounded-xl border bg-card p-3 md:p-4">
            <img
              src={"/placeholder.svg?height=420&width=720&query=AI%20roadmap%20dashboard%20wireframe"}
              alt="Preview of AI roadmap dashboard"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
