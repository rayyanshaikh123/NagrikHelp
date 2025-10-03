"use client"

import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { getIssues, type Issue } from "@/services/issues"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

export default function ReportsPage() {
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
          <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
          <ReportsContent />
        </section>
      </div>
    </main>
  )
}

function ReportsContent() {
  const { data } = useSWR(["all-issues"], () => getIssues())
  const issues: Issue[] = data || []

  const statusData = [
    { status: "Pending", count: issues.filter((i) => i.status === "pending").length },
    { status: "In-Progress", count: issues.filter((i) => i.status === "in-progress").length },
    { status: "Resolved", count: issues.filter((i) => i.status === "resolved").length },
  ]

  const lastNDays = 14
  const today = new Date()
  const days: string[] = [...Array(lastNDays).keys()]
    .map((d) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - (lastNDays - 1 - d)))
    .map((d) => d.toISOString().slice(0, 10))

  const creationsByDay: Record<string, number> = Object.fromEntries(days.map((d) => [d, 0]))
  for (const i of issues) {
    const day = new Date(i.createdAt).toISOString().slice(0, 10)
    if (creationsByDay[day] !== undefined) creationsByDay[day]++
  }
  const timelineData = days.map((d) => ({ day: d.slice(5), created: creationsByDay[d] }))

  const assigneeCounts = new Map<string, number>()
  for (const i of issues) {
    const key = i.assignee || "Unassigned"
    assigneeCounts.set(key, (assigneeCounts.get(key) || 0) + 1)
  }
  const topAssignees = Array.from(assigneeCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }))

  const colors = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6"]

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="border rounded-lg p-4">
        <h2 className="font-medium mb-2">Issues by Status</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="font-medium mb-2">Issues Created (Last {lastNDays} Days)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="created" stroke="#10B981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-lg p-4 lg:col-span-2">
        <h2 className="font-medium mb-2">Top Assignees</h2>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie data={topAssignees} dataKey="count" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
              {topAssignees.map((_, idx) => (
                <Cell key={idx} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
