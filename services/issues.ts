import { API_BASE, authFetch } from "./auth"

export type IssueStatus = "pending" | "in-progress" | "resolved"

export type Issue = {
  id: string
  title: string
  description: string
  location: string
  photoUrl?: string
  status: IssueStatus
  createdBy: string
  assignee?: string
  createdAt: number
  updatedAt: number
}

// Map backend enum (PENDING, IN_PROGRESS, RESOLVED) to FE status strings
function mapStatusFromApi(s: string): IssueStatus {
  const v = s.toUpperCase().replace(/-/g, "_")
  if (v === "PENDING") return "pending"
  if (v === "IN_PROGRESS") return "in-progress"
  if (v === "RESOLVED") return "resolved"
  return "pending"
}

function mapStatusToApi(s: IssueStatus): string {
  if (s === "pending") return "PENDING"
  if (s === "in-progress") return "IN_PROGRESS"
  if (s === "resolved") return "RESOLVED"
  return "PENDING"
}

function fromApi(i: any): Issue {
  return {
    id: i.id,
    title: i.title,
    description: i.description,
    location: i.location,
    photoUrl: i.photoUrl || undefined,
    status: mapStatusFromApi(i.status),
    createdBy: i.createdBy,
    assignee: i.assignee || undefined,
    createdAt: i.createdAt,
    updatedAt: i.updatedAt,
  }
}

export async function getIssues(): Promise<Issue[]> {
  const res = await authFetch(`${API_BASE}/api/admin/issues`)
  if (!res.ok) throw new Error(`Failed to fetch issues: ${res.status}`)
  const data = await res.json()
  return (data as any[]).map(fromApi)
}

export async function getIssuesByUser(_userId: string): Promise<Issue[]> {
  // userId inferred from token on backend
  const res = await authFetch(`${API_BASE}/api/citizen/issues`)
  if (!res.ok) throw new Error(`Failed to fetch my issues: ${res.status}`)
  const data = await res.json()
  return (data as any[]).map(fromApi)
}

export async function createIssue(input: {
  title: string
  description: string
  location: string
  photoUrl?: string
  createdBy: string // ignored; backend derives from token
}): Promise<Issue> {
  const { title, description, location, photoUrl } = input
  const res = await authFetch(`${API_BASE}/api/citizen/issues`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, location, photoUrl }),
  })
  if (!res.ok) throw new Error(`Failed to create issue: ${res.status}`)
  const data = await res.json()
  return fromApi(data)
}

export async function updateIssue(id: string, patch: Partial<Issue>): Promise<Issue | undefined> {
  const body: any = {}
  if (patch.status) body.status = mapStatusToApi(patch.status)
  if (patch.assignee !== undefined) body.assignee = patch.assignee
  const res = await authFetch(`${API_BASE}/api/admin/issues/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (res.status === 404) return undefined
  if (!res.ok) throw new Error(`Failed to update issue: ${res.status}`)
  const data = await res.json()
  return fromApi(data)
}
