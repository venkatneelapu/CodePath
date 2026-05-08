import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"

const tracks = [
  {
    id: "js",
    title: "JavaScript Essentials (21 days)",
    topics: ["Syntax & Types", "Functions", "DOM Basics", "Async (Promises/Fetch)", "Modules", "Mini Project"],
  },
  {
    id: "react",
    title: "React Fundamentals (28 days)",
    topics: [
      "Components & Props",
      "Hooks (useState/useEffect)",
      "Forms",
      "Data Fetching with SWR",
      "Routing",
      "Project",
    ],
  },
  {
    id: "node",
    title: "Node + Express (28 days)",
    topics: ["HTTP & REST", "Express Router", "MongoDB Basics", "Auth Patterns", "Testing", "API Project"],
  },
  {
    id: "mongo",
    title: "MongoDB Practitioner (14 days)",
    topics: ["Data Modeling", "CRUD & Indexes", "Aggregation", "Mongoose Patterns", "Backups", "Performance"],
  },
]

export default function PredefinedRoadmaps() {
  return (
    <Card className="p-2 md:p-4">
      <Accordion type="single" collapsible className="w-full">
        {tracks.map((t) => (
          <AccordionItem key={t.id} value={t.id}>
            <AccordionTrigger className="text-left">{t.title}</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-1">
                {t.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  )
}
