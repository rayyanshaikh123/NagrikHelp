"use client"
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar'
import GlassPanel from '@/components/glass-panel'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import CitizenMyIssues from '@/components/citizen-my-issues'

export default function CitizenProfilePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('role')
    if (!token || !role) router.replace('/login')
    else if (role !== 'citizen') router.replace('/admin')
    try {
      setName(localStorage.getItem('name') || '')
      setEmail(localStorage.getItem('email') || '')
    } catch {}
  }, [router])

  const userId = useMemo(()=> localStorage.getItem('userId') || 'demo-user-1', [])

  return (
    <main className="min-h-dvh">
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 py-10 pb-32 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400">Profile</h1>
          <p className="text-sm text-muted-foreground max-w-prose">Manage your account context. (Authentication & editing wiring not implemented in UI-only phase.)</p>
        </div>
        <GlassPanel level={2} className="p-6 space-y-4">
          <div className="grid gap-2 text-sm">
            <div><span className="text-muted-foreground">Name:</span> {name || '-'} </div>
            <div><span className="text-muted-foreground">Email:</span> {email || '-'} </div>
            <div><span className="text-muted-foreground">Role:</span> Citizen</div>
          </div>
          <p className="text-xs text-muted-foreground">Feature roadmap: profile editing, notification preferences, and data export.</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild size="sm" variant="secondary"><Link href="/citizen/my-issues">My Issues</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href="/citizen/create">Report Issue</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href="/citizen/public">Public Feed</Link></Button>
          </div>
        </GlassPanel>
        <GlassPanel level={2} className="p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg font-medium">My Issues</h2>
            <Button asChild size="sm" variant="secondary"><Link href="/citizen/create">+ New Issue</Link></Button>
          </div>
          <CitizenMyIssues userId={userId} compact />
        </GlassPanel>
      </section>
    </main>
  )
}
