"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { Issue } from "@/services/issues"

export default function DashboardStats({ issues }: { issues: Issue[] }) {
  const pending = issues.filter((i) => i.status === "pending").length
  const inProgress = issues.filter((i) => i.status === "in-progress").length
  const resolved = issues.filter((i) => i.status === "resolved").length

  const stats = [
    { label: "Pending", value: pending },
    { label: "In-Progress", value: inProgress },
    { label: "Resolved", value: resolved },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="bg-card">
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">{s.label}</div>
            <div className="text-2xl font-semibold">{s.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
