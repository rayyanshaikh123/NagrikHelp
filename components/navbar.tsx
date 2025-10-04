"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { logout as authLogout, getAuthToken } from "@/services/auth"
import { Bell } from "lucide-react"
import { NotificationsDialog } from "@/components/notifications-dialog"
import { fetchUnreadCount } from "@/services/notifications"
import { useToast } from "@/hooks/use-toast"
import { useNotificationStream } from "@/hooks/use-notification-stream"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null)
  const [backendRole, setBackendRole] = useState<string | null>(null)
  const [notifOpen, setNotifOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    setRole(localStorage.getItem("role"))
    setBackendRole(localStorage.getItem("backendRole"))
  }, [])

  const isCitizen = backendRole === 'CITIZEN'

  // SSE integration (citizen only)
  const sse = useNotificationStream({
    enabled: isCitizen,
    getToken: () => getAuthToken(),
    onNotification: (n) => {
      setUnreadCount(c => c + 1)
      toast({ title: 'New notification', description: n.message })
    },
    onStatusChange: ({ live }) => {
      if (live) {
        fetchUnreadCount().then(c => setUnreadCount(c)).catch(() => { })
      }
    }
  })

  // Fallback polling only if citizen & SSE not live
  useEffect(() => {
    if (!isCitizen) return
    let id: any
    let cancelled = false
    async function pollOnce() {
      try { const c = await fetchUnreadCount(); if (!cancelled) setUnreadCount(c) } catch { }
    }
    if (!sse.live) {
      pollOnce()
      id = setInterval(pollOnce, 30000)
    }
    return () => { cancelled = true; if (id) clearInterval(id) }
  }, [isCitizen, sse.live])

  // Provide callback to dialog to decrement unread count when items opened
  function handleConsumed(unreadDelta: number) {
    if (unreadDelta > 0) setUnreadCount(c => Math.max(0, c - unreadDelta))
  }

  return (
    <>
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-end gap-3">
          {role ? (
            <>
              <span className="text-[11px] px-2 py-1 rounded-md bg-muted border border-border/50 tracking-wide">
                {backendRole || role}
              </span>
              <Button
                size="sm"
                onClick={() => {
                  authLogout()
                  try { localStorage.removeItem("userId") } catch {}
                  window.location.href = "/"
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="text-xs text-muted-foreground">Not authenticated</div>
          )}
        </div>
      </header>
      {isCitizen && (
        <NotificationsDialog open={notifOpen} onOpenChange={(v) => setNotifOpen(v)} onConsumeUnread={handleConsumed} />
      )}
    </>
  )
}
