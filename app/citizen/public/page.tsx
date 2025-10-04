"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import useSWR from "swr"
import { getPublicIssues, type Issue } from "@/services/issues"
import IssueCard from "@/components/issue-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CATEGORY_LIST = [
  "All",
  "POTHOLE",
  "STREET_LIGHT",
  "GARBAGE",
  "WATER",
  "ROAD",
  "ELECTRICITY",
  "OTHER",
]

export default function PublicPostsPage() {
  const router = useRouter()
  const [category, setCategory] = useState<string>("All")
  const [visible, setVisible] = useState<number>(12)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const role = localStorage.getItem("role")
    if (!token || !role) router.replace("/login")
    else if (role !== "citizen") router.replace("/admin")
  }, [router])

  const { data } = useSWR(["public-issues"], () => getPublicIssues())
  const issues: (Issue & { category: string })[] = useMemo(
    () => (data || []).map((i) => ({ ...i, category: i.category || "Other" })),
    [data],
  )

  const filtered = useMemo(
    () => (category === "All" ? issues : issues.filter((i) => i.category === category)),
    [issues, category],
  )

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible((v) => Math.min(v + 9, filtered.length))
      }
    })
    obs.observe(node)
    return () => obs.disconnect()
  }, [filtered.length])

  useEffect(() => {
    // reset visible when filter changes
    setVisible(12)
  }, [category])

  return (
    <main className="min-h-dvh bg-neutral-50 dark:bg-neutral-900/95">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Public Issues</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-prose">Browse recently reported civic issues. Filter by category and open any card for full detail and activity.</p>
        </header>
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/70 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium text-neutral-700 dark:text-neutral-200">Category:</span>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-48 h-9 bg-white/80 dark:bg-neutral-900/60 border-neutral-300 dark:border-neutral-600 text-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {CATEGORY_LIST.map((c) => (
                  <SelectItem key={c} value={c} className="text-[13px]">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto text-[11px] text-neutral-500 dark:text-neutral-400">Showing {Math.min(visible, filtered.length)} of {filtered.length}</div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, visible).map((issue) => (
            <IssueCard key={issue.id} issue={issue} mode="citizen" />
          ))}
        </div>
        <div ref={sentinelRef} />
        {filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-100/60 dark:bg-neutral-800/40 p-8 text-center text-sm text-neutral-500 dark:text-neutral-400">No issues found for this category.</div>
        )}
      </section>
    </main>
  )
}
