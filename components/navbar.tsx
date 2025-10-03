"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { logout as authLogout } from "@/services/auth"

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null)
  const [backendRole, setBackendRole] = useState<string | null>(null)

  useEffect(() => {
    setRole(localStorage.getItem("role"))
    setBackendRole(localStorage.getItem("backendRole"))
  }, [])

  return (
    <header className="border-b bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="font-medium">
          Civic Issue Reporter
        </Link>
        <div className="flex items-center gap-3">
          {/* Dynamic, role-based nav */}
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
              <span className="text-xs px-2 py-1 rounded-md bg-muted">Role: {backendRole || role}</span>
              {role === "citizen" ? (
                <>
                  <Button asChild size="sm" variant="secondary">
                    <Link href="/citizen/public">Public Posts</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href="/citizen">Dashboard</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="sm" variant="secondary">
                    <Link href="/admin">Dashboard</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href="/admin/reports">Reports</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href="/admin/map">Map</Link>
                  </Button>
                  {backendRole === "SUPER_ADMIN" ? (
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/admin/management">Management</Link>
                    </Button>
                  ) : null}
                </>
              )}
              <Button
                size="sm"
                onClick={() => {
                  authLogout()
                  try {
                    localStorage.removeItem("userId")
                  } catch {}
                  window.location.href = "/" // redirect to landing page after logout
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
