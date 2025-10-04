"use client"
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar'
import GlassPanel from '@/components/glass-panel'
import CitizenMyIssues from '@/components/citizen-my-issues'

export default function CitizenMyIssuesPage() {
  const router = useRouter()
  useEffect(()=>{
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('role')
    if(!token || !role) router.replace('/login')
    else if (role !== 'citizen') router.replace('/admin')
  }, [router])
  const userId = useMemo(()=> localStorage.getItem('userId') || 'demo-user-1', [])
  return (
    <main className="min-h-dvh">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 py-10 pb-32 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400">My Issues</h1>
          <p className="text-sm text-muted-foreground max-w-prose">Manage and monitor all the civic issues you have reported.</p>
        </div>
        <GlassPanel level={2} className="p-6">
          <CitizenMyIssues userId={userId} />
        </GlassPanel>
      </section>
    </main>
  )
}
