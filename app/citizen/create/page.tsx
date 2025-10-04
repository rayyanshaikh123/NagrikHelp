"use client"
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar'
import ReportIssueForm from '@/components/report-issue-form'
import GlassPanel from '@/components/glass-panel'

export default function CitizenCreateIssuePage() {
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('role')
    if (!token || !role) router.replace('/login')
    else if (role !== 'citizen') router.replace('/admin')
  }, [router])
  const userId = useMemo(() => localStorage.getItem('userId') || 'demo-user-1', [])

  return (
    <main className="min-h-dvh">
      <Navbar />
      <section className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <h1 className="text-3xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400">Report an Issue</h1>
        <p className="text-sm text-muted-foreground max-w-prose">Provide clear, concise details and an accurate location to help authorities prioritize and resolve the issue faster.</p>
        <GlassPanel level={2} className="p-6">
          <ReportIssueForm userId={userId} />
        </GlassPanel>
      </section>
    </main>
  )
}
