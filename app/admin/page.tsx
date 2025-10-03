"use client"

import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import IssueCard from "@/components/issue-card"
import DashboardStats from "@/components/dashboard-stats"
import useSWR from "swr"
import { getIssues, type Issue, updateIssue } from "@/services/issues"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminMap from "@/components/admin-map"

export default function AdminPage() {
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const role = localStorage.getItem("role")
    if (!token || !role) router.replace("/login")
    else if (role !== "admin") router.replace("/citizen")
  }, [router])

  return (
    <main className="min-h-dvh">
      <Navbar />
      <div className="flex">
        <Sidebar role="admin" />
        <section className="flex-1 p-6 space-y-8">
          <h1 className="text-2xl font-semibold text-balance">Admin Dashboard</h1>
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Issues Map</h2>
            <AdminMap height={380} />
          </div>
          <AdminIssues />
        </section>
      </div>
    </main>
  )
}

function AdminIssues() {
  const { data, mutate } = useSWR(["all-issues"], () => getIssues())
  const issues: Issue[] = data || []
  const counts = {
    all: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    "in-progress": issues.filter((i) => i.status === "in-progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
  }

  const filter =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("status") || "all" : "all"
  const filtered = filter === "all" ? issues : issues.filter((i) => i.status === filter)

  async function handleUpdate(id: string, patch: Partial<Issue>) {
    await updateIssue(id, patch)
    mutate()
  }

  return (
    <div className="space-y-6">
      <DashboardStats issues={issues} />
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <a href="?status=all" className="text-sm underline-offset-2 hover:underline">
          All ({counts.all})
        </a>
        <a href="?status=pending" className="text-sm underline-offset-2 hover:underline">
          Pending ({counts.pending})
        </a>
        <a href="?status=in-progress" className="text-sm underline-offset-2 hover:underline">
          In-Progress ({counts["in-progress"]})
        </a>
        <a href="?status=resolved" className="text-sm underline-offset-2 hover:underline">
          Resolved ({counts.resolved})
        </a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((issue) => (
          <IssueCard key={issue.id} issue={issue} mode="admin" onUpdate={handleUpdate} />
        ))}
      </div>
    </div>
  )
}
