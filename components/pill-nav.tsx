"use client"
import React, { useState, useRef, useLayoutEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import GlassSurface from './glass-surface'

interface PillNavItem {
  label: string
  href: string
}
interface PillNavProps {
  logo?: string
  logoAlt?: string
  items: PillNavItem[]
  activeHref?: string
  className?: string
  ease?: string
  baseColor?: string
  pillColor?: string
  hoveredPillTextColor?: string
  pillTextColor?: string
  glass?: boolean
}

/* Lightweight pill navigation bar.
 * - Moves a highlight pill under the active/hovered item using transforms.
 * - Falls back to current pathname if activeHref not supplied.
 * - Monochrome friendly; colors configurable via props.
 */
export default function PillNav({
  logo = '/placeholder-logo.svg',
  logoAlt = 'Logo',
  items,
  activeHref,
  className,
  baseColor = '#111111',
  pillColor = '#ffffff',
  hoveredPillTextColor = '#ffffff',
  pillTextColor = '#000000',
  glass = true,
}: PillNavProps) {
  const pathname = usePathname()
  const active = activeHref || pathname || '/'
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [rect, setRect] = useState<{ x: number; w: number } | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  useLayoutEffect(() => {
    const idx = hoverIndex !== null ? hoverIndex : items.findIndex(i => active.startsWith(i.href))
    if (idx < 0) { setRect(null); return }
    const el = itemRefs.current[idx]
    if (!el || !containerRef.current) { setRect(null); return }
    const cRect = containerRef.current.getBoundingClientRect()
    const iRect = el.getBoundingClientRect()
    setRect({ x: iRect.left - cRect.left, w: iRect.width })
  }, [active, hoverIndex, items])

  const Wrapper: any = glass ? GlassSurface : 'div'

  return (
    <Wrapper
      className={cn('mx-auto max-w-7xl w-full px-4 py-2', glass && 'backdrop-blur-md bg-background/60 border border-border/60 rounded-2xl', className)}
      height={undefined}
      width={undefined}
      borderRadius={glass ? 28 : undefined}
    >
      <div className="flex items-center gap-6" ref={containerRef}>
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={logoAlt} className="h-8 w-8 object-contain" />
          <span className="text-sm font-semibold tracking-tight" style={{ color: baseColor }}>{logoAlt}</span>
        </Link>
        <nav className="relative flex-1">
          <div className="relative flex items-center gap-1">
            {rect && (
              <div
                className="absolute top-0 bottom-0 my-[2px] rounded-full transition-all duration-300"
                style={{
                  transform: `translateX(${rect.x}px)`,
                  width: rect.w,
                  background: pillColor,
                  color: pillTextColor,
                }}
              />
            )}
            {items.map((it, i) => {
              const isActive = active.startsWith(it.href)
              const on = hoverIndex === i || (hoverIndex === null && isActive)
              return (
                <Link key={it.href} href={it.href} className="relative">
                  <button
                    ref={el => itemRefs.current[i] = el}
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                    className={cn(
                      'relative z-10 px-4 h-10 rounded-full text-xs font-medium tracking-wide transition-colors',
                      on ? 'text-black' : 'text-muted-foreground hover:text-foreground'
                    )}
                    style={on ? { color: pillTextColor } : undefined}
                  >
                    {it.label}
                  </button>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </Wrapper>
  )
}
