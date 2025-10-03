"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Camera, MessageSquare, ShieldCheck } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [fbName, setFbName] = useState("")
  const [fbEmail, setFbEmail] = useState("")
  const [fbMsg, setFbMsg] = useState("")
  const [fbSent, setFbSent] = useState(false)

  return (
    <main className="min-h-dvh">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div aria-hidden className="h-6 w-6 rounded bg-primary" />
            <span className="font-semibold">Civic Reporter</span>
          </div>
          <nav className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push("/roles")}>
              Roles
            </Button>
            <Button onClick={() => router.push("/roles")}>Get Started</Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2">
        <div>
          <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
            Crowdsourced Civic Issue Reporting and Resolution
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Empower citizens to report issues and help admins resolve them faster. Simple forms, clear statuses, and an
            efficient workflow for healthier cities.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button onClick={() => router.push("/roles")}>Choose Your Role</Button>
            <Button variant="outline" onClick={() => router.push("/citizen")}>
              Explore Citizen
            </Button>
            <Button variant="outline" onClick={() => router.push("/admin")}>
              Explore Admin
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Report issues with title, description, location, and photos</li>
            <li>Track your submissions and receive status updates</li>
            <li>Admins view, filter, assign tasks, and update statuses</li>
            <li>Clean, minimal UI built with shadcn/ui components</li>
            <li>Frontend-only demo with dummy data (ready for Spring Boot)</li>
          </ul>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 pb-6 md:pb-10">
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Location-aware</CardTitle>
              <MapPin className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Pin exact locations to speed up routing and resolution.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Photo evidence</CardTitle>
              <Camera className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Attach images for context so admins can triage faster.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Comments & updates</CardTitle>
              <MessageSquare className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Discuss issues and track live progress in one place.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Admin workflow</CardTitle>
              <ShieldCheck className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Assign, prioritize, and resolve with a simple dashboard.
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-6 md:py-10">
        <h2 className="text-2xl font-semibold mb-4">How it works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">1. Report</CardTitle>
              <CardDescription>Fill a quick form with photos and a location.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Citizens can submit new issues in minutes from any device.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">2. Track</CardTitle>
              <CardDescription>Get status updates and comment as things progress.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Stay informed transparently through each step to resolution.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">3. Resolve</CardTitle>
              <CardDescription>Admins triage, assign, and close out issues.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              A lightweight workflow that fits small teams and busy cities.
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="feedback" className="mx-auto max-w-3xl px-6 py-6 md:py-10">
        <Card asChild>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              // In a real app, POST to an API route.
              setFbSent(true)
            }}
          >
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
              <CardDescription>Tell us what features you want next.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {!fbSent ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="fb-name">Name</Label>
                    <Input
                      id="fb-name"
                      value={fbName}
                      onChange={(e) => setFbName(e.target.value)}
                      placeholder="Jane Citizen"
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fb-email">Email</Label>
                    <Input
                      id="fb-email"
                      type="email"
                      value={fbEmail}
                      onChange={(e) => setFbEmail(e.target.value)}
                      placeholder="jane@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fb-msg">Message</Label>
                    <Textarea
                      id="fb-msg"
                      value={fbMsg}
                      onChange={(e) => setFbMsg(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={5}
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-brand hover:bg-brand/90 text-background">
                      Send feedback
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-sm text-brand">Thanks! Your feedback was recorded.</div>
              )}
            </CardContent>
          </form>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-lg border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium">Ready to try it?</h3>
            <p className="text-sm text-muted-foreground">Choose your role and explore the demo dashboards.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => router.push("/roles")} className="bg-brand hover:bg-brand/90 text-background">
              Get started
            </Button>
            <Button variant="outline" onClick={() => router.push("/#features")}>
              See features
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
