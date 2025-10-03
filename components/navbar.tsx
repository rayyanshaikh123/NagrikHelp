"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { logout as authLogout } from "@/services/auth"

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    setRole(localStorage.getItem("role"))
  }, [])

  return (
    <header className="border-b bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="font-medium">
          Civic Issue Reporter
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/#features"
            className="hidden sm:inline-block text-sm text-muted-foreground hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/#feedback"
            className="hidden sm:inline-block text-sm text-muted-foreground hover:text-foreground"
          >
            Feedback
          </Link>
          {!role ? (
            <>
              <Button asChild size="sm" variant="secondary">
                <Link href="/register">Register</Link>
              </Button>
              <Button asChild size="sm" variant="default">
                <Link href="/login">Login</Link>
              </Button>
            </>
          ) : (
            <>
              <span className="text-xs px-2 py-1 rounded-md bg-muted">Role: {role}</span>
              <Button asChild size="sm" variant="secondary">
                <Link href={role === "admin" ? "/admin" : "/citizen"}>Dashboard</Link>
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  authLogout()
                  try { localStorage.removeItem("userId") } catch {}
                  window.location.href = "/login"
                }}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
