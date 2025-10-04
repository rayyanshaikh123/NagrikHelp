"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Issue } from "@/services/issues"
import { voteIssue, updateCitizenIssue, deleteCitizenIssue } from "@/services/issues"
import { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { useSWRConfig } from "swr"
import dynamic from "next/dynamic"

const ShareIssueDialog = dynamic(() => import("./share-issue-dialog"), { ssr: false })

export default function IssueCard({
  issue,
  mode,
  onUpdate,
  ownerMode = false,
}: {
  issue: Issue
  mode: "citizen" | "admin"
  onUpdate?: (id: string, patch: Partial<Issue>) => Promise<void> | void
  ownerMode?: boolean
}) {
  const [status, setStatus] = useState<Issue["status"]>(issue.status)
  const [savingStatus, setSavingStatus] = useState(false)

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

  async function applyStatus(newStatus: Issue["status"]) {
    if (newStatus === status) return
    const prev = status
    setStatus(newStatus)
    setSavingStatus(true)
    try {
      if (onUpdate) await onUpdate(issue.id, { status: newStatus })
    } catch {
      setStatus(prev)
    } finally {
      setSavingStatus(false)
    }
  }

  const [editOpen, setEditOpen] = useState(false)
  const [editSaving, setEditSaving] = useState(false)
  const [eTitle, setETitle] = useState(issue.title)
  const [eDesc, setEDesc] = useState(issue.description)
  const [eLoc, setELoc] = useState(issue.location)
  const [eCat, setECat] = useState(issue.category || 'OTHER')
  const [eImage, setEImage] = useState<string | undefined>(issue.imageBase64)

  const [isOwner, setIsOwner] = useState(ownerMode)
  const [shareOpen, setShareOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const email = localStorage.getItem('email')
      if (email && issue.createdBy && email.toLowerCase() === issue.createdBy.toLowerCase()) {
        setIsOwner(true)
      }
    } catch {}
  }, [issue.createdBy])

  async function saveEdits() {
    setEditSaving(true)
    try {
      const patch: any = { title: eTitle, description: eDesc, location: eLoc, category: eCat }
      if (eImage) patch.imageBase64 = eImage
      const updated = await updateCitizenIssue(issue.id, patch)
      // reflect local state
      setStatus(updated.status)
      setEditOpen(false)
      mutate(["my-issues", updated.createdBy])
    } catch (e) {
      // ignore
    } finally {
      setEditSaving(false)
    }
  }

  async function removeIssue() {
    if (!confirm("Delete this issue? This cannot be undone.")) return
    try {
      await deleteCitizenIssue(issue.id)
      mutate(["my-issues", issue.createdBy])
    } catch (e) {
      // ignore
    }
  }

  return (
    <Card className="relative overflow-hidden rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 shadow-sm transition hover:shadow-md hover:border-neutral-400 dark:hover:border-neutral-600">
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {mode === "citizen" ? (
            <CardTitle className="text-base font-semibold leading-snug">
              <Link href={`/citizen/public/${issue.id}`} className="hover:underline line-clamp-2">
                {issue.title}
              </Link>
            </CardTitle>
          ) : (
            <CardTitle className="text-base font-semibold leading-snug line-clamp-2">{issue.title}</CardTitle>
          )}
        </div>
        {issue.shareToken ? (
          <Button type="button" variant="outline" size="icon" className="h-7 w-7 shrink-0" onClick={() => setShareOpen(true)} title="Share">
            <span className="text-xs">↗</span>
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {issue.category ? <span className="px-2 py-1 rounded-md bg-neutral-300 dark:bg-neutral-600 text-neutral-800 dark:text-neutral-100 border border-neutral-400 dark:border-neutral-500">{issue.category}</span> : null}
          <span className="px-2 py-1 rounded-md bg-neutral-300 dark:bg-neutral-600 text-neutral-800 dark:text-neutral-100 border border-neutral-400 dark:border-neutral-500">{formatStatus(issue.status)}</span>
          {(issue.commentsCount ?? 0) > 0 ? <span className="text-muted-foreground">{issue.commentsCount} comments</span> : null}
        </div>
        <div className="relative w-full h-36 overflow-hidden rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-700/60">
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
            <div className="absolute top-2 right-2 flex items-center gap-2 rounded-md bg-neutral-900/80 dark:bg-neutral-950/70 text-neutral-50 px-2 py-1 shadow-xs border border-neutral-600 text-[11px]">
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
            <Select value={status} onValueChange={(v) => applyStatus(v as Issue["status"]) } disabled={savingStatus}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In-Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            {savingStatus ? <span className="text-[10px] text-muted-foreground">Saving...</span> : null}
          </div>
        )}

        {canManage ? (
          <div className="text-[11px] text-muted-foreground whitespace-pre-wrap line-clamp-6">
            {issue.description}
          </div>
        ) : null}

        {isOwner && mode === 'citizen' ? (
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-neutral-300 dark:border-neutral-700 mt-2 pt-3">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm">Edit</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Edit Issue</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                  <Input value={eTitle} onChange={e=>setETitle(e.target.value)} placeholder="Title" />
                  <Textarea value={eDesc} onChange={e=>setEDesc(e.target.value)} rows={4} placeholder="Description" />
                  <Input value={eLoc} onChange={e=>setELoc(e.target.value)} placeholder="Location" />
                  <Select value={eCat} onValueChange={v=>setECat(v as any)}>
                    <SelectTrigger className="w-full h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['POTHOLE','GARBAGE','STREETLIGHT','WATER','OTHER'].map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0]; if(!f){setEImage(undefined);return;} const r=new FileReader(); r.onload=()=> setEImage(r.result as string); r.readAsDataURL(f)}} />
                  {eImage ? <img src={eImage} alt="preview" className="h-24 w-full object-cover rounded border" /> : null}
                </div>
                <DialogFooter className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={()=>setEditOpen(false)} disabled={editSaving}>Cancel</Button>
                  <Button type="button" onClick={saveEdits} disabled={editSaving}>{editSaving? 'Saving...' : 'Save'}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="destructive" size="sm" onClick={removeIssue}>Delete</Button>
          </div>
        ) : null}

        {mode === "citizen" ? (
          <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-300">
            <Link href={`/citizen/public/${issue.id}`} className="text-xs font-medium text-primary hover:underline">
              View details →
            </Link>
            <span className="text-[10px] text-muted-foreground">Net votes: {netVote}</span>
          </div>
        ) : null}
      </CardContent>
      {issue.shareToken ? (
        <ShareIssueDialog issue={issue} open={shareOpen} onOpenChange={setShareOpen} />
      ) : null}
    </Card>
  )
}
