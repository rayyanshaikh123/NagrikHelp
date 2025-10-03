"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LampCeiling } from "lucide-react"
import Link from "next/link"
import { Spotlight } from "@/components/spotlight"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-transparent to-muted/30">
      <Spotlight />
      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 mb-4">
          <LampCeiling className="h-4 w-4 text-brand" />
          <span className="text-xs text-brand">Crowdsourced Civic Reporting</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-balance">
          Report, track, and resolve civic issues—together.
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl text-pretty">
          A simple, transparent way for citizens and city staff to collaborate on safer, better neighborhoods. Snap a
          photo, submit a report, and follow progress—all in one place.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link href="/roles" className="w-full sm:w-auto">
            <Button className="w-full bg-brand hover:bg-brand/90 text-background">Get started</Button>
          </Link>
          <Link href="#features" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full border-brand/40 text-brand hover:bg-brand/10 bg-transparent">
              Learn more
            </Button>
          </Link>
        </div>

        <div id="features" className="mt-8 inline-flex items-center gap-2">
          <Badge variant="outline" className="border-accent/40 text-accent">
            Photo uploads
          </Badge>
          <Badge variant="outline" className="border-accent/40 text-accent">
            Live status
          </Badge>
          <Badge variant="outline" className="border-accent/40 text-accent">
            Admin workflow
          </Badge>
        </div>
      </div>
    </section>
  )
}
