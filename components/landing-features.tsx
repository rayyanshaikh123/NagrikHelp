"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Camera, MessagesSquare, ShieldCheck, BarChart3 } from "lucide-react"

const FEATURES = [
  {
    title: "Location-aware",
    desc: "Pin exact locations of issues for precise resolution.",
    Icon: MapPin,
  },
  {
    title: "Photo evidence",
    desc: "Attach images for clearer context and faster triage.",
    Icon: Camera,
  },
  {
    title: "Comments & updates",
    desc: "Discuss issues and receive progress notifications.",
    Icon: MessagesSquare,
  },
  {
    title: "Admin tools",
    desc: "Assign, prioritize, and track completion with ease.",
    Icon: ShieldCheck,
  },
  {
    title: "Basic analytics",
    desc: "Spot trends and allocate resources effectively.",
    Icon: BarChart3,
  },
]

export function Features() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map(({ title, desc, Icon }) => (
        <Card key={title} className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{title}</CardTitle>
            <Icon className="h-5 w-5 text-brand" />
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{desc}</CardContent>
        </Card>
      ))}
    </div>
  )
}
