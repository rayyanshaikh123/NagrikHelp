"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { Issue } from "@/services/issues"
import { useState } from "react"

export default function IssueCard({
  issue,
  mode,
  onUpdate,
}: {
  issue: Issue
  mode: "citizen" | "admin"
  onUpdate?: (id: string, patch: Partial<Issue>) => Promise<void> | void
}) {
  const [status, setStatus] = useState<Issue["status"]>(issue.status)
  const [assignee, setAssignee] = useState<string>(issue.assignee || "")

  const canManage = mode === "admin"
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{issue.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{issue.description}</p>
        <p className="text-xs">Location: {issue.location}</p>
        {issue.photoUrl ? (
          <div className="relative w-full h-40 overflow-hidden rounded-md border">
            {/* Use Next Image only with known domains; for data URLs fallback to <img> */}
            {issue.photoUrl.startsWith("data:") || issue.photoUrl.startsWith("blob:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={issue.photoUrl || "/placeholder.svg"}
                alt="Issue photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <Image src={issue.photoUrl || "/placeholder.svg"} alt="Issue photo" fill className="object-cover" />
            )}
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/issue-placeholder.jpg"
            alt="No photo provided"
            className="w-full h-40 object-cover rounded-md border"
          />
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-1 rounded-md bg-muted">Status: {issue.status}</span>
          <span className="text-xs text-muted-foreground">Updated: {new Date(issue.updatedAt).toLocaleString()}</span>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={(v) => setStatus(v as Issue["status"])}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In-Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Assign to..."
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="max-w-[180px]"
            />
            <Button
              size="sm"
              onClick={async () => {
                if (onUpdate) await onUpdate(issue.id, { status, assignee })
              }}
            >
              Update
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
