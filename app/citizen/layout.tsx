"use client"
import React from 'react'
import CitizenDock from '@/components/citizen-dock'

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh pb-28">{/* global bottom space so content not hidden behind dock */}
      {children}
      <CitizenDock className="pointer-events-none [*]:pointer-events-auto" />
    </div>
  )
}
