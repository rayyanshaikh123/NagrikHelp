"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function RoleCard({
  title,
  description,
  onSelect,
}: {
  title: string
  description: string
  onSelect: () => void
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-pretty">{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Button onClick={onSelect} className="w-full">
          Continue as {title}
        </Button>
      </CardContent>
    </Card>
  )
}
