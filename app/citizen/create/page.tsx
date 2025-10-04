"use client"
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar'
import ReportIssueForm from '@/components/report-issue-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
      <section className="mx-auto max-w-5xl px-6 py-10 space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Report an Issue</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-prose">Provide clear, concise details and an accurate location to help authorities prioritize and resolve the issue faster.</p>
        </div>
        <Card className="border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-neutral-800 dark:text-neutral-100">Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ReportIssueForm userId={userId} />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
