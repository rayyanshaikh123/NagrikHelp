"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import ReportIssueForm from "@/components/report-issue-form"
import IssueCard from "@/components/issue-card"
import DashboardStats from "@/components/dashboard-stats"
import useSWR from "swr"
import { getIssuesByUser } from "@/services/issues"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
      <section className="mx-auto max-w-6xl p-6 space-y-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-semibold text-balance">Citizen Dashboard</h1>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="create">Create Post</TabsTrigger>
            <TabsTrigger value="my-posts">My Posts</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <h2 className="text-lg font-medium">Report an Issue</h2>
            <ReportIssueForm userId={userId} />
          </TabsContent>

          <TabsContent value="my-posts" className="space-y-4">
            <MyIssues userId={userId} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <ProfilePanel />
            <MyIssues userId={userId} compact />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}

function MyIssues({ userId, compact = false }: { userId: string; compact?: boolean }) {
  const { data } = useSWR(["my-issues", userId], () => getIssuesByUser(userId))
  const issues = data || []
  return (
    <div className="space-y-4">
      {!compact ? <h2 className="text-lg font-medium">My Issues</h2> : null}
      <DashboardStats issues={issues} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} mode="citizen" />
        ))}
      </div>
    </div>
  )
}

function ProfilePanel() {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  useEffect(() => {
    try {
      setName(localStorage.getItem("name") || "")
      setEmail(localStorage.getItem("email") || "")
    } catch {}
  }, [])
  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-lg font-medium mb-2">Profile</h2>
      <div className="text-sm">Name: {name || "-"}</div>
      <div className="text-sm">Email: {email || "-"}</div>
      <p className="text-xs text-muted-foreground mt-2">
        Manage your posts in the tabs above. Public posts are available on the Public Posts page.
      </p>
    </div>
  )
}
