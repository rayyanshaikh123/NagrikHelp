"use client"

import { useMemo } from "react"
import useSWR from "swr"
import { getIssues, type Issue } from "@/services/issues"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"

// Fix default marker icons in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(L.Icon.Default.prototype as any)._getIconUrl = function () {
  return L.Icon.Default.imagePath
}
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

export default function AdminMap({ height = 400 }: { height?: number }) {
  const { data } = useSWR(["all-issues"], () => getIssues())
  const issues: Issue[] = data || []

  // Center on India
  const center: [number, number] = [20.5937, 78.9629]

  const points = useMemo(() => issues.map((i) => ({ issue: i, pos: locationToLatLng(i.location, center) })), [issues])

  return (
    <div className="w-full rounded-lg overflow-hidden border" style={{ height }}>
      <MapContainer center={center} zoom={5} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map(({ issue, pos }) => (
          <Marker key={issue.id} position={pos}>
            <Popup>
              <div className="space-y-1">
                <div className="font-medium">{issue.title}</div>
                <div className="text-xs text-muted-foreground">{issue.location}</div>
                <div className="text-xs">Status: {issue.status}</div>
                <div className="text-xs">Reported by: {issue.createdBy}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

function locationToLatLng(loc: string, base: [number, number]): [number, number] {
  // Deterministic pseudo-random spread around base
  let h1 = 0,
    h2 = 0
  for (let i = 0; i < loc.length; i++) {
    const c = loc.charCodeAt(i)
    h1 = (h1 * 31 + c) % 1000
    h2 = (h2 * 17 + c) % 1000
  }
  const lat = base[0] + ((h1 / 1000) * 6 - 3) // +/-3 deg
  const lng = base[1] + ((h2 / 1000) * 6 - 3) // +/-3 deg
  return [lat, lng]
}
