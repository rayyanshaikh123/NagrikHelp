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
    <main className="min-h-dvh">
      <Navbar />
      <section className="mx-auto max-w-6xl p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-semibold">Public Posts</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Category</span>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_LIST.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, visible).map((issue) => (
            <IssueCard key={issue.id} issue={issue} mode="citizen" />
          ))}
        </div>
        <div ref={sentinelRef} />
      </section>
    </main>
  )
}
