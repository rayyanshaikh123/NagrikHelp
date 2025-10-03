"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { Issue } from "@/services/issues"
import { voteIssue } from "@/services/issues"
import { useState } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { useSWRConfig } from "swr"

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

  // Backend-provided aggregate vote data (may be undefined for admin list legacy endpoint)
  const [upVotes, setUpVotes] = useState<number>(issue.upVotes ?? 0)
  const [downVotes, setDownVotes] = useState<number>(issue.downVotes ?? 0)
  const [userVote, setUserVote] = useState<"UP" | "DOWN" | null>(issue.userVote ?? null)
  const [voting, setVoting] = useState(false)
  const { mutate } = useSWRConfig()

  // Friendly status label
  const formatStatus = (s: string) => {
    const map: Record<string, string> = {
      pending: "Pending",
      "in-progress": "In Progress",
      resolved: "Resolved",
      open: "Open",
    }
    return map[s] || s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
  }

  async function handleVote(next: "UP" | "DOWN") {
    if (voting) return
    setVoting(true)
    // Optimistic snapshot
    const prev = { upVotes, downVotes, userVote }
    // Optimistic update logic
    let newUp = upVotes
    let newDown = downVotes
    let newUserVote: typeof userVote
    if (userVote === next) {
      // Toggle off
      if (next === "UP") newUp = Math.max(0, newUp - 1)
      else newDown = Math.max(0, newDown - 1)
      newUserVote = null
    } else {
      if (next === "UP") {
        newUp = userVote === "DOWN" ? newUp + 1 : newUp + 1
        if (userVote === "DOWN") newDown = Math.max(0, newDown - 1)
      } else {
        newDown = userVote === "UP" ? newDown + 1 : newDown + 1
        if (userVote === "UP") newUp = Math.max(0, newUp - 1)
      }
      newUserVote = next
    }
    setUpVotes(newUp)
    setDownVotes(newDown)
    setUserVote(newUserVote)
    try {
      const res = await voteIssue(issue.id, next)
      setUpVotes(res.upVotes)
      setDownVotes(res.downVotes)
      setUserVote(res.userVote)
      // Mutate potential caches (public list / detail)
      mutate(["public-issue", issue.id], (prevIssue: any) => prevIssue ? { ...prevIssue, upVotes: res.upVotes, downVotes: res.downVotes, userVote: res.userVote } : prevIssue, false)
      mutate(["public-issues"], (list: any) => Array.isArray(list) ? list.map((it) => it.id === issue.id ? { ...it, upVotes: res.upVotes, downVotes: res.downVotes, userVote: res.userVote } : it) : list, false)
    } catch {
      // Revert on failure
      setUpVotes(prev.upVotes)
      setDownVotes(prev.downVotes)
      setUserVote(prev.userVote)
    } finally {
      setVoting(false)
    }
  }

  const netVote = upVotes - downVotes
  const canManage = mode === "admin"
  return (
    <Card>
      <CardHeader className="pb-2">
        {mode === "citizen" ? (
          <CardTitle className="text-base font-semibold leading-snug">
            <Link href={`/citizen/public/${issue.id}`} className="hover:underline line-clamp-2">
              {issue.title}
            </Link>
          </CardTitle>
        ) : (
          <CardTitle className="text-base font-semibold leading-snug line-clamp-2">{issue.title}</CardTitle>
        )}
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {issue.category ? <span className="px-2 py-1 rounded bg-muted">{issue.category}</span> : null}
          <span className="px-2 py-1 rounded bg-muted">{formatStatus(issue.status)}</span>
          {(issue.commentsCount ?? 0) > 0 ? <span className="text-muted-foreground">{issue.commentsCount} comments</span> : null}
        </div>
        <div className="relative w-full h-36 overflow-hidden rounded-md border bg-muted/40">
          {issue.imageBase64 || issue.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={(issue.imageBase64 || issue.photoUrl) || "/placeholder.svg"}
              alt={issue.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/issue-placeholder.jpg"
              alt="No image"
              className="w-full h-full object-cover opacity-70"
              loading="lazy"
            />
          )}
          {mode === "citizen" ? (
            <div className="absolute top-2 right-2 flex items-center gap-2 rounded-md bg-background/85 backdrop-blur px-2 py-1 shadow-sm border">
              <button
                type="button"
                disabled={voting}
                onClick={() => handleVote("UP")}
                className={`text-xs px-2 py-1 rounded transition border ${userVote === "UP" ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
              >
                ▲ {upVotes}
              </button>
              <span className="text-xs font-medium tabular-nums">{netVote}</span>
              <button
                type="button"
                disabled={voting}
                onClick={() => handleVote("DOWN")}
                className={`text-xs px-2 py-1 rounded transition border ${userVote === "DOWN" ? "bg-destructive text-destructive-foreground border-destructive" : "hover:bg-muted"}`}
              >
                ▼ {downVotes}
              </button>
            </div>
          ) : null}
        </div>

        {canManage && (
          <div className="flex items-center gap-2 pt-1">
            <Select value={status} onValueChange={(v) => setStatus(v as Issue["status"]) }>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In-Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Assign..."
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="max-w-[150px] h-8 text-xs"
            />
            <Button
              size="sm"
              className="h-8"
              onClick={async () => {
                if (onUpdate) await onUpdate(issue.id, { status, assignee })
              }}
            >
              Save
            </Button>
          </div>
        )}

        {mode === "citizen" ? (
          <div className="pt-1 flex items-center justify-between">
            <Link href={`/citizen/public/${issue.id}`} className="text-xs font-medium text-primary hover:underline">
              View details →
            </Link>
            <span className="text-[10px] text-muted-foreground">Net votes: {netVote}</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
