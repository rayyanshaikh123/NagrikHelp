"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { createIssue } from "@/services/issues"
import { useToast } from "@/hooks/use-toast"
import { useSWRConfig } from "swr"

export default function ReportIssueForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined)
  const { toast } = useToast()
  const { mutate } = useSWRConfig()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    await createIssue({
      title,
      description,
      location,
      photoUrl,
      createdBy: userId,
    })
    setTitle("")
    setDescription("")
    setLocation("")
    setPhotoUrl(undefined)
    toast({ title: "Issue reported", description: "Your issue was submitted." })
    mutate(["my-issues", userId])
    mutate(["all-issues"])
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={onSubmit} className="grid gap-3">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
          />
          <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
          <div className="flex items-center gap-3">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (!f) return setPhotoUrl(undefined)
                const reader = new FileReader()
                reader.onload = () => setPhotoUrl(reader.result as string)
                reader.readAsDataURL(f)
              }}
            />
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl || "/placeholder.svg"}
                alt="Selected"
                className="h-16 w-16 object-cover rounded-md border"
              />
            ) : null}
          </div>
          <div className="flex justify-end">
            <Button type="submit">Submit Issue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
