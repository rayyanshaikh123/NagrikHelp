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
    // If the nav is horizontally scrollable, adjust for scrollLeft
    const scrollLeft = containerRef.current.scrollLeft || 0
    setRect({ x: iRect.left - cRect.left + scrollLeft, w: iRect.width })
  }, [active, hoverIndex, items])

  const Wrapper: any = glass ? GlassSurface : 'div'

  return (
    <Wrapper
      className={cn('mx-auto max-w-7xl w-full px-2 py-2', glass && 'backdrop-blur-md bg-background/80 border border-border/60 rounded-2xl', className)}
      height={undefined}
      width={undefined}
      borderRadius={glass ? 28 : undefined}
    >
      <div className="flex items-center gap-4" ref={containerRef}>
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={logoAlt} className="h-8 w-8 object-contain" />
          <span className="text-sm font-semibold tracking-tight" style={{ color: baseColor }}>{logoAlt}</span>
        </Link>
        <nav className="relative flex-1 overflow-x-auto scrollbar-hide">
          <div className="relative flex items-center gap-1 whitespace-nowrap px-2">
            {rect && (
              <div
                className="absolute top-0 bottom-0 my-[6px] rounded-full transition-all duration-300 shadow-md"
                style={{
                  transform: `translateX(${rect.x}px)`,
                  width: rect.w,
                  background: pillColor || 'rgba(255,255,255,0.06)',
                  color: pillTextColor || '#ffffff',
                  padding: '6px 8px'
                }}
              />
            )}
            {items.map((it, i) => {
              const isActive = active.startsWith(it.href)
              const on = hoverIndex === i || (hoverIndex === null && isActive)
              return (
                <Link key={it.href} href={it.href} className="relative">
                  <button
                    ref={el => { itemRefs.current[i] = el }}
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                    className={cn(
                      'relative z-10 px-4 h-10 rounded-full text-sm font-medium tracking-wide transition-colors inline-flex items-center justify-center',
                      on ? 'text-white' : 'text-slate-300 hover:text-white'
                    )}
                    style={on ? { color: pillTextColor || '#ffffff' } : undefined}
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
