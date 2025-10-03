"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RoleCard } from "@/components/role-card"

export default function RolesPage() {
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    setRole(typeof window !== "undefined" ? localStorage.getItem("role") : null)
  }, [])

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-balance text-3xl font-semibold">Choose your role</h1>
        <p className="text-muted-foreground leading-relaxed">
          Continue as a Citizen to register and report issues, or as an Admin to log in and manage issues.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <RoleCard
          title="Citizen"
          description="Report civic issues and track their progress."
          onSelect={() => router.push("/register")}
        />
        <RoleCard
          title="Admin"
          description="Review, assign, and resolve reported issues."
          onSelect={() => router.push("/login")}
        />
      </div>

      <div className="mt-8 flex items-center gap-3">
        {!role ? (
          <>
            <Button onClick={() => router.push("/login")}>Login</Button>
            <Button variant="secondary" onClick={() => router.push("/register")}>Register</Button>
          </>
        ) : (
          <Button variant="ghost" onClick={() => router.push(role === "admin" ? "/admin" : "/citizen")}>
            Go to Dashboard
          </Button>
        )}
        <Button variant="ghost" onClick={() => router.push("/")}>Back to Landing</Button>
      </div>
    </main>
  )
}
