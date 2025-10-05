export type BackendRole = "CITIZEN" | "ADMIN" | "SUPER_ADMIN"

export type AuthResponse = {
  token: string
  role: BackendRole
  name: string
  email: string
}

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ""

async function handleHttpError(resp: Response): Promise<never> {
  // Try to parse JSON body for useful error messages, fall back to status text
  let body: any = null
  try {
    body = await resp.json()
  } catch {
    // ignore parse errors
  }
  const msg = body?.message || body?.errors || `${resp.status} ${resp.statusText}`
  const err = new Error(typeof msg === "string" ? `Request failed: ${msg}` : `Request failed: ${resp.status} ${resp.statusText}`)
  ;(err as any).status = resp.status
  ;(err as any).body = body
  throw err
}

export async function login(input: { email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) await handleHttpError(res)
  return (await res.json()) as AuthResponse
}

export async function register(input: {
  name: string
  email: string
  password: string
  phone?: string
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) await handleHttpError(res)
  return (await res.json()) as AuthResponse
}

export function mapRoleToFrontend(role: BackendRole): "citizen" | "admin" {
  return role === "ADMIN" || role === "SUPER_ADMIN" ? "admin" : "citizen"
}

export function persistAuth(auth: AuthResponse) {
  try {
    localStorage.setItem("authToken", auth.token)
    localStorage.setItem("role", mapRoleToFrontend(auth.role))
    localStorage.setItem("backendRole", auth.role)
    localStorage.setItem("name", auth.name)
    localStorage.setItem("email", auth.email)
    // Use email as a stable userId for demo data linkage
    localStorage.setItem("userId", auth.email)
  } catch {}
}

export function logout() {
  try {
    localStorage.removeItem("authToken")
    localStorage.removeItem("role")
    localStorage.removeItem("backendRole")
    localStorage.removeItem("name")
    localStorage.removeItem("email")
    // keep demo issues linkage optional
    // localStorage.removeItem("userId")
  } catch {}
}

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem("authToken")
  } catch {
    return null
  }
}

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = getAuthToken()
  const headers = new Headers(init.headers || {})
  if (token) headers.set("Authorization", `Bearer ${token}`)
  return fetch(input, { ...init, headers })
}