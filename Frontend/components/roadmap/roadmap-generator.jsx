"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

const techs = ["JavaScript", "Python", "React", "Node.js", "MongoDB", "TypeScript", "Next.js"]

export default function RoadmapGenerator() {
  const [tech, setTech] = useState("JavaScript")
  const [days, setDays] = useState(14)
  const { toast } = useToast()

  function handleSubmit(e) {
    e.preventDefault()
    toast({
      title: "Plan requested",
      description: `Generating a ${days}-day ${tech} roadmap...`,
    })
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="tech">Technology</Label>
            <Select value={tech} onValueChange={setTech}>
              <SelectTrigger id="tech" aria-label="Choose a technology">
                <SelectValue placeholder="Select technology" />
              </SelectTrigger>
              <SelectContent>
                {techs.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="days">Number of days</Label>
            <Input
              id="days"
              type="number"
              min={3}
              max={120}
              value={days}
              onChange={(e) => setDays(Number.parseInt(e.target.value || "0", 10))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Aim for a realistic schedule that fits your life.</p>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <Button type="submit" className="grow sm:grow-0">
              Generate Plan
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTech("JavaScript")
                setDays(14)
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
