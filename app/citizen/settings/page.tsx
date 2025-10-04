"use client"
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar'
import GlassPanel from '@/components/glass-panel'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

export default function CitizenSettingsPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  useEffect(()=>{
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('role')
    if(!token || !role) router.replace('/login')
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
      <section className="mx-auto max-w-4xl px-6 py-10 pb-32 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400">Settings</h1>
          <p className="text-sm text-muted-foreground max-w-prose">Manage civic participation preferences. (Pure UI – wiring not implemented.)</p>
        </div>

        <GlassPanel level={2} className="p-6 space-y-4">
          <h2 className="text-lg font-medium">Account</h2>
          <div className="grid gap-1 text-sm">
            <div><span className="text-muted-foreground">User ID:</span> {userId}</div>
            <div><span className="text-muted-foreground">Name:</span> {name || '-'} </div>
            <div><span className="text-muted-foreground">Email:</span> {email || '-'} </div>
            <div><span className="text-muted-foreground">Role:</span> Citizen</div>
          </div>
          <p className="text-xs text-muted-foreground">Profile editing and notification settings coming soon.</p>
        </GlassPanel>

        <GlassPanel level={2} className="p-6 space-y-5 border border-red-500/30 dark:border-red-500/40">
          <div>
            <h2 className="text-lg font-medium text-red-500">Danger Zone</h2>
            <p className="text-xs text-muted-foreground mt-1">Delete your account and all associated issues. This action is destructive and cannot be reversed. (Disabled in UI-only build.)</p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled>Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove your user record and reported issues permanently. There is no undo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction disabled>Confirm Delete (Disabled)</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </GlassPanel>
      </section>
    </main>
  )
}
