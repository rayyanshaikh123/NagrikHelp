"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import LightRays from './LightRays'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-background min-h-[600px]">
      {/* Subtle dark overlay behind rays for contrast shaping */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/10 via-background/30 to-background/70 pointer-events-none" />
      {/* LightRays animated background toned down */}
      <LightRays
        raysOrigin="top-center"
        raysColor="#00ffff"
        raysSpeed={1.3}
        lightSpread={0.95}
        rayLength={1.9}
        followMouse
        mouseInfluence={0.05}
        noiseAmount={0.05}
        distortion={0.035}
        brightnessFloor={0.25}
        brightnessPower={1.05}
        intensity={1.2}
        className="absolute inset-0 z-[1] opacity-80 mix-blend-screen pointer-events-none transition-opacity duration-700"
      />
      {/* Gradient top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-7xl px-6 pt-14 pb-16 md:pt-20 md:pb-24 relative mt-20 z-10">
        <div className="grid gap-12 md:gap-16 md:grid-cols-2 items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary/50" /> Open civic collaboration
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight text-balance">
                A minimal platform to report & track civic issues
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-prose">
                Submit location‑aware reports with photos, follow transparent status updates, and help communities
                prioritize what matters—without UI noise.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="sm" className="sm:w-auto w-full">
                <Link href="/roles">Get Started</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="sm:w-auto w-full">
                <Link href="#features">View Features</Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="sm:w-auto w-full">
                <Link href="/citizen/public">Public Feed</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {FEATURE_PILLS.map(p => (
                <Badge key={p} variant="outline" className="border-border text-[10px] font-normal tracking-wide">
                  {p}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 pt-4 text-[11px] text-muted-foreground">
              <span>Low-friction • Accessible • Transparent</span>
              <span className="hidden sm:inline h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span className="hidden sm:inline">UI-only demo</span>
            </div>
          </div>

          {/* Right Column (Visual Placeholder / Future Illustration) */}
          <div className="relative hidden md:flex">
            <div className="relative w-full aspect-[4/3] rounded-xl border bg-card/50 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_35%,var(--color-primary)/10,transparent_70%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.03))] dark:bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.03))]" />
              <div className="p-6 text-center space-y-4 max-w-sm">
                <h2 className="text-sm font-medium tracking-wide text-foreground/90">Interface Preview</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This panel can showcase a map snapshot, an issue detail mock, or a short explainer animation.
                </p>
                <div className="grid gap-2 text-left text-[11px] rounded-lg border p-3 bg-background/60">
                  <Row label="Report" value="Pothole on Main St" />
                  <Row label="Status" value="Pending" />
                  <Row label="Votes" value="+12" />
                  <Row label="ETA" value="2–3 days" />
                </div>
              </div>
              <div className="absolute -inset-px rounded-xl pointer-events-none border border-border/60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground/70">{label}</span>
      <span className="font-medium text-foreground/80">{value}</span>
    </div>
  )
}

const FEATURE_PILLS = [
  "Structured reports",
  "Location-aware",
  "Photo evidence",
  "Status tracking",
  "Lightweight UI",
]
