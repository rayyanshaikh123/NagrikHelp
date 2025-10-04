import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "leaflet/dist/leaflet.css"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SmoothCursor } from "@/components/ui/smooth-cursor"
import ThemeHotkey from "@/components/theme-hotkey"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: "Civic Issue Reporter",
  description: "Crowdsourced Civic Issue Reporting & Resolution UI",
  generator: "v0.app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} ${GeistSans.variable} ${GeistMono.variable} min-h-dvh antialiased`}>
        {/* Custom smooth cursor */}
        <ThemeProvider attribute="class" enableSystem defaultTheme="system" disableTransitionOnChange>
          <div className="cursor-none">
            <SmoothCursor zIndex={2147483647} />
            <ThemeHotkey />
            <div className="min-h-dvh">{children}</div>
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
