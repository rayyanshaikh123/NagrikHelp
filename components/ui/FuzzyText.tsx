"use client"
import React from 'react'

interface Props {
  children: React.ReactNode
  baseIntensity?: number
  hoverIntensity?: number
  enableHover?: boolean
  className?: string
}

/**
 * Minimal FuzzyText implementation inspired by the posted snippet.
 * Uses layered text shadows to create a soft fuzzy look. Lightweight and safe.
 */
export default function FuzzyText({ children, baseIntensity = 0.18, hoverIntensity = 0.45, enableHover = false, className }: Props) {
  const base = Math.max(0, Math.min(1, baseIntensity))
  const hover = Math.max(0, Math.min(1, hoverIntensity))

  const style: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    color: 'white',
    // layered text-shadow to emulate a fuzzy glow
    textShadow: `0 1px 2px rgba(0,0,0,${base}), 0 2px 6px rgba(0,0,0,${base}), 0 6px 18px rgba(0,0,0,${base * 0.6})`,
  }

  const hoverStyle: React.CSSProperties = enableHover ? {
    transition: 'text-shadow 180ms ease, transform 180ms ease',
    willChange: 'text-shadow, transform'
  } : {}

  const combined = { ...style, ...hoverStyle }

  return (
    <span className={className} style={combined}>
      {children}
    </span>
  )
}
