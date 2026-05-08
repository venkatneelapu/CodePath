import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BrainCircuit, ListTodo, Trophy } from "lucide-react"

const features = [
  {
    title: "AI‑Powered Plans",
    desc: "Personalized roadmaps that adapt to your time and level.",
    Icon: BrainCircuit,
    badge: "Smart",
  },
  {
    title: "Structured Tracks",
    desc: "Curated sequences for JS, Python, React, Node, and more.",
    Icon: ListTodo,
    badge: "Focused",
  },
  {
    title: "Stay Motivated",
    desc: "Progress streaks, milestones, and mini‑projects.",
    Icon: Trophy,
    badge: "Gamified",
  },
]

export default function FeatureCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {features.map((f) => (
        <Card key={f.title} className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <f.Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <span>{f.title}</span>
            </CardTitle>
            <Badge variant="secondary">{f.badge}</Badge>
          </CardHeader>
          <CardContent className="text-muted-foreground">{f.desc}</CardContent>
        </Card>
      ))}
    </div>
  )
}
