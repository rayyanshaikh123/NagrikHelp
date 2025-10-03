"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import ReportIssueForm from "@/components/report-issue-form"
import IssueCard from "@/components/issue-card"
import DashboardStats from "@/components/dashboard-stats"
import useSWR from "swr"
import { getIssuesByUser } from "@/services/issues"

export default function CitizenPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const role = localStorage.getItem("role")
    if (!token || !role) router.replace("/login")
    else if (role !== "citizen") router.replace("/admin")
  }, [router])

  const userId = useMemo(() => localStorage.getItem("userId") || "demo-user-1", [])

  return (
    <main className="min-h-dvh">
      <Navbar />
      <div className="flex">
        <Sidebar role="citizen" />
        <section className="flex-1 p-6 space-y-8">
          <h1 className="text-2xl font-semibold text-balance">Citizen Dashboard</h1>
          {/* Report Issue */}
          <div id="report" className="space-y-4">
            <h2 className="text-lg font-medium">Report an Issue</h2>
            <ReportIssueForm userId={userId} />
          </div>
          {/* My Issues */}
          <div id="my-issues" className="space-y-4">
            <h2 className="text-lg font-medium">My Issues</h2>
            <CitizenIssues userId={userId} />
          </div>
        </section>
      </div>
    </main>
  )
}

function CitizenIssues({ userId }: { userId: string }) {
  const { data } = useSWR(["my-issues", userId], () => getIssuesByUser(userId))
  const issues = data || []
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <DashboardStats issues={issues} />
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} mode="citizen" />
      ))}
    </div>
  )
}
