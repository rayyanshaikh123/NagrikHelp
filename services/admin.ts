import { API_BASE, authFetch } from "./auth"

export async function createAdmin(input: {
  name: string
  email: string
  password: string
  phone?: string
}) {
  const res = await authFetch(`${API_BASE}/api/admin/admins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`Failed to create admin: ${res.status}`)
  return res.json()
}
