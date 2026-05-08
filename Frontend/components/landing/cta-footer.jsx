import { Button } from "@/components/ui/button"

export default function CTAFooter() {
  return (
    <footer id="cta" className="border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-balance">Ready to learn faster with clarity?</h2>
          <p className="mt-3 text-muted-foreground">
            Join the waitlist for adaptive AI learning, progress analytics, and mini‑projects.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button asChild>
              <a href="#generate">Start Free</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#roadmaps">Explore Tracks</a>
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">No credit card required.</p>
        </div>
      </div>
    </footer>
  )
}
