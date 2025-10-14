"use client"

import type React from "react"

import { useCallback, useMemo, useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useSWRConfig } from "swr"
import { createIssue, type Issue, type IssueCategory } from "@/services/issues"
import { validateIssueImage, type AIValidationResult } from "@/services/ai"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"
// NOTE: Do NOT import leaflet at the module top during SSR; it touches `window`.
// We'll lazy require it only in the browser.
let Leaflet: typeof import('leaflet') | null = null
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Lmod = require('leaflet') as typeof import('leaflet')
  Leaflet = Lmod
  Lmod.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  })
}
import { useRouter } from "next/navigation"

// Lazy-load map to avoid SSR issues (relax types for dynamic component)
const MapContainer = dynamic<any>(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false })
const TileLayer = dynamic<any>(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false })
const Marker = dynamic<any>(() => import("react-leaflet").then((m) => m.Marker), { ssr: false })
const Popup = dynamic<any>(() => import("react-leaflet").then((m) => m.Popup), { ssr: false })

// (Marker icon config moved into guarded block above)

const CATEGORIES: IssueCategory[] = ["POTHOLE", "GARBAGE", "STREETLIGHT", "WATER", "OTHER"]

export default function ReportIssueForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState<IssueCategory>("OTHER")
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined)
  const [preview, setPreview] = useState<string | undefined>(undefined)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState<AIValidationResult | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState<Issue | null>(null)
  const [votes, setVotes] = useState(0)
  const [comments, setComments] = useState<{ by: string; text: string; at: number }[]>([])
  const commentInput = useRef<HTMLInputElement | null>(null)

  const { toast } = useToast()
  const { mutate } = useSWRConfig()
  const router = useRouter()

  // Map state
  const center: [number, number] = useMemo(() => [20.5937, 78.9629], []) // India center
  const [pos, setPos] = useState<[number, number] | null>(null)

  const toLocString = (p: [number, number], addr?: string) => (addr ? `${p[0].toFixed(6)},${p[1].toFixed(6)} | ${addr}` : `${p[0].toFixed(6)},${p[1].toFixed(6)}`)

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) return toast({ title: "Location not available" })
    navigator.geolocation.getCurrentPosition(
      (res) => {
        const p: [number, number] = [res.coords.latitude, res.coords.longitude]
        setPos(p)
        setLocation(toLocString(p))
      },
      () => toast({ title: "Unable to get current location" }),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }, [toast])

  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([])
  const fetchAbort = useRef<AbortController | null>(null)

  // Debounced geocode suggestions
  useEffect(() => {
    const q = query.trim()
    if (q.length < 3) {
      setSuggestions([])
      return
    }
    const timer = setTimeout(async () => {
      try {
        fetchAbort.current?.abort()
        const ac = new AbortController()
        fetchAbort.current = ac
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=10&q=${encodeURIComponent(q)}`
        const res = await fetch(url, { headers: { "Accept-Language": "en" }, signal: ac.signal })
        const data: any[] = await res.json()
        setSuggestions(data.map((d) => ({ display_name: d.display_name, lat: d.lat, lon: d.lon })))
      } catch (e) {
        // ignore aborts
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const pickSuggestion = useCallback((s: { display_name: string; lat: string; lon: string }) => {
    const p: [number, number] = [parseFloat(s.lat), parseFloat(s.lon)]
    setPos(p)
    setLocation(`${p[0].toFixed(6)},${p[1].toFixed(6)} | ${s.display_name}`)
    setSuggestions([])
  }, [])

  const geocode = useCallback(async () => {
    if (!query.trim()) return
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=10&q=${encodeURIComponent(query)}`
      const res = await fetch(url, { headers: { "Accept-Language": "en" } })
      const data: any[] = await res.json()
      if (!data.length) return toast({ title: "No results found" })
      const mapped = data.map((d) => ({ display_name: d.display_name, lat: d.lat, lon: d.lon }))
      setSuggestions(mapped)
      if (mapped.length === 1) {
        // auto-select only if single match
        const single = mapped[0]
        const p: [number, number] = [parseFloat(single.lat), parseFloat(single.lon)]
        setPos(p)
        setLocation(`${p[0].toFixed(6)},${p[1].toFixed(6)} | ${single.display_name}`)
        setSuggestions([])
      } else {
        toast({ title: "Select a location", description: `Showing ${mapped.length} suggestions` })
      }
    } catch (e) {
      toast({ title: "Search failed" })
    }
  }, [query, toast])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const issue = await createIssue({ title, description, location, category, imageBase64, aiValidation: aiResult ? {
        isValid: aiResult.isValid,
        suggestedCategory: aiResult.suggestedCategory,
        confidence: aiResult.confidence,
        message: aiResult.message,
        provider: aiResult.provider,
      } : undefined })
      // Optimistically refresh lists
      mutate(["public-issues"])
      mutate(["my-issues", userId])
      toast({ title: "Issue reported", description: "Redirecting to issue..." })
      // Redirect to public issue detail page
      router.push(`/citizen/public/${issue.id}`)
      return
    } catch (err: any) {
      toast({ title: "Create failed", description: err?.message || "Unable to create issue" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <form onSubmit={onSubmit} className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as IssueCategory)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />

            {/* Location controls */}
            <div className="grid gap-2 relative">
              <Label>Location</Label>
              <div className="relative">
                <div className="flex gap-2 flex-wrap">
                  <Input
                    placeholder="Search address (OpenStreetMap)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 min-w-40"
                  />
                  <Button type="button" variant="secondary" onClick={geocode}>
                    Search
                  </Button>
                  <Button type="button" variant="secondary" onClick={useMyLocation}>
                    Use my location
                  </Button>
                </div>
                {suggestions.length > 0 ? (
                  <div className="absolute z-[10000] mt-1 w-full max-h-60 overflow-auto rounded-md border border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 text-popover-foreground shadow-lg isolation-auto">
                    {suggestions.map((s, idx) => (
                      <button
                        type="button"
                        key={idx}
                        className="w-full text-left px-3 py-2 hover:bg-accent/70 hover:text-accent-foreground text-sm transition-colors"
                        onClick={() => pickSuggestion(s)}
                      >
                        {s.display_name}
                      </button>
                    ))}
                    <div className="sticky bottom-0 px-3 py-1 text-[10px] text-muted-foreground bg-background/90 backdrop-blur-sm">Search by OpenStreetMap</div>
                  </div>
                ) : null}
              </div>
              <Input
                placeholder="Location string (auto-filled as lat,lng | address, or enter manually)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <div className="rounded-lg overflow-hidden border relative z-0">
                {/* Map */}
                <div className="h-64 w-full">
                  {typeof window !== "undefined" ? (
                    <MapContainer center={pos || center} zoom={pos ? 13 : 5} style={{ height: "100%", width: "100%" }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      {pos ? (
                        <Marker position={pos}>
                          <Popup>{location || `${pos[0].toFixed(6)}, ${pos[1].toFixed(6)}`}</Popup>
                        </Marker>
                      ) : null}
                    </MapContainer>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Image upload */}
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (!f) {
                    setPreview(undefined)
                    setImageBase64(undefined)
                    return
                  }
                  const reader = new FileReader()
                  reader.onload = async () => {
                    const dataUrl = reader.result as string
                    setPreview(dataUrl)
                    setImageBase64(dataUrl)
                    // Extract base64 portion only (strip data URL prefix)
                    const base64 = dataUrl.split(",")[1] || dataUrl
                    setAiLoading(true)
                    setAiResult(null)
                    setAiError(null)
                    try {
                      const r = await validateIssueImage(base64)
                      // Log AI validation result for debugging
                      // eslint-disable-next-line no-console
                      console.log('[AI] validation result', r)
                      setAiResult(r)
                      if (r?.suggestedCategory) {
                        setCategory(r.suggestedCategory as IssueCategory)
                      }
                      if (!r.isValid) {
                        toast({ title: "Image may not show a civic issue", description: r.message })
                      }
                    } catch (e: any) {
                      setAiError(e.message || 'AI validation error')
                    } finally {
                      setAiLoading(false)
                    }
                  }
                  reader.readAsDataURL(f)
                }}
              />
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview || "/placeholder.svg"} alt="Selected" className="h-16 w-16 object-cover rounded-md border" />
              ) : null}
            </div>

            {/* AI validation feedback */}
            {aiLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing image with AI...
              </div>
            ) : null}
            {aiError ? (
              <Alert variant="destructive">
                <AlertTitle>AI Error</AlertTitle>
                <AlertDescription>{aiError}</AlertDescription>
              </Alert>
            ) : null}
            {aiResult ? (
              <Alert variant={aiResult.isValid ? "default" : "destructive"} className="transition-all data-[state=closed]:opacity-0 animate-in fade-in slide-in-from-top-2">
                <AlertTitle>
                  {aiResult.isValid ? `Detected ${aiResult.suggestedCategory || 'issue'} (${Math.round(aiResult.confidence * 100)}%)` : 'Uncertain image'}
                </AlertTitle>
                <AlertDescription className="text-xs leading-relaxed">
                  {aiResult.message} {aiResult.provider ? <span className="opacity-60">[{aiResult.provider}]</span> : null}
                </AlertDescription>
              </Alert>
            ) : null}

            <div className="flex justify-end">
              <Button type="submit" disabled={submitting || !title || !description || aiLoading}>
                {submitting ? "Submitting..." : "Submit Issue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
