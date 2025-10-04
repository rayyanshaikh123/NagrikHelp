"use client"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MapPin, Camera, MessageSquare, ShieldCheck, ArrowRight, ArrowDown } from "lucide-react"
import { Hero } from "@/components/landing-hero"
import { cn } from "@/lib/utils"
import { PhoneFlowDemo } from "@/components/phone-flow-demo"
import SpotlightCard from '@/components/spotlight-card'
import { FloatingNav } from '@/components/ui/floating-navbar'
import { IconHome, IconListDetails, IconDeviceMobile, IconHelpCircle } from '@tabler/icons-react'
import LogoLoop from '@/components/LogoLoop'

export default function Home() {
  const router = useRouter()
  const howRef = useRef<HTMLElement | null>(null)
  const featuresRef = useRef<HTMLElement | null>(null)
  const faqRef = useRef<HTMLElement | null>(null)
  const [howActive, setHowActive] = useState(false)

  const govLogos = [
    { src: '/logo/India.png', alt: 'Government of India', title: 'Government of India', href: 'https://india.gov.in' },
    { src: '/logo/dept.png', alt: 'Civic Department', title: 'Civic Department', href: '#' },
    { src: '/logo/dept1.png', alt: 'Urban Development', title: 'Urban Development', href: '#' },
    { src: '/logo/disaster.png', alt: 'Disaster Management', title: 'Disaster Management', href: '#' },
    { src: '/logo/g20.png', alt: 'Health Ministry', title: 'Health Ministry', href: '#' },
  ]

  useEffect(() => {
    if (!howRef.current) return
    const el = howRef.current
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.intersectionRatio >= 0.60) {
          setHowActive(true)
        } else if (e.intersectionRatio === 0) {
          // fully out of view -> reset
          setHowActive(false)
        }
      })
    }, { threshold: [0, 0.60] })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const sectionRefs = { features: featuresRef, 'how-it-works': howRef, faq: faqRef }

  return (
    <main className="min-h-dvh flex flex-col">
      {/* Floating Navigation (replaces old header & pill nav) */}
      <FloatingNav
        navItems={[
          { name: 'Home', link: '/', icon: <IconHome className="h-4 w-4" /> },
          { name: 'Features', link: '#features', icon: <IconListDetails className="h-4 w-4" /> },
          { name: 'How It Works', link: '#how-it-works', icon: <IconListDetails className="h-4 w-4" /> },
          { name: 'Roles', link: '/roles', icon: <IconListDetails className="h-4 w-4" /> },
          { name: 'Get Started', link: '/roles', icon: <IconDeviceMobile className="h-4 w-4" /> },
        ]}
        hideOnScroll
        threshold={10}
        sectionRefs={sectionRefs}
      />

      {/* Hero with added top margin for spacing below floating nav */}
   
        <Hero />
      

      {/* Features ( concise ) */}
      <section id="features" ref={featuresRef} className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-10 flex flex-col gap-3">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Platform Capabilities</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-prose">Fast, transparent civic reporting. Larger cards highlight the core experience at a glance.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
          <FeatureCard
            size="lg"
            title="Location‑Aware Reports"
            icon={<MapPin className="h-8 w-8" />}
            bullets={["Manual entry or geocode assist","Structured location string","Future: map pin persistence"]}
          >
            Capture precise context so resolution teams dispatch effectively and reduce back‑and‑forth.
          </FeatureCard>
          <FeatureCard
            size="lg"
            title="Photo Evidence"
            icon={<Camera className="h-8 w-8" />}
            bullets={["Drag & drop upload","Instant preview","Optimizable pipeline"]}
          >
            Visual clarity accelerates triage decisions and improves accuracy in categorization.
          </FeatureCard>
          <FeatureCard
            size="lg"
            title="Conversation & Signals"
            icon={<MessageSquare className="h-8 w-8" />}
            bullets={["Comment threads","Community voting","Recent activity snapshot"]}
          >
            Encourage constructive collaboration while surfacing priority through transparent engagement.
          </FeatureCard>
          <FeatureCard
            size="lg"
            title="Admin Workflow"
            icon={<ShieldCheck className="h-8 w-8" />}
            bullets={["Structured statuses","Assignment ready","Resolution archive"]}
          >
            A lean progression model that scales from pilot deployments to full municipal adoption.
          </FeatureCard>
          <FeatureCard
            size="lg"
            title="Scalable Layout"
            icon={<ShieldCheck className="h-8 w-8" />}
            bullets={["Responsive grid","Accessible keyboard focus","Plain color adaptive themes"]}
          >
            Built with composability—easily extend sections without redesign overhead.
          </FeatureCard>
          <FeatureCard
            size="lg"
            title="Future Integrations"
            icon={<ShieldCheck className="h-8 w-8" />}
            bullets={["SSE / WebSockets","Geo heat clustering","Automated SLA metrics"]}
          >
            The UI anticipates data enrichment layers while remaining lightweight now.
          </FeatureCard>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" ref={howRef} className="bg-muted/30 border-y">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="mb-10 flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">How it works</h2>
            <p className="text-sm text-muted-foreground max-w-prose">A streamlined three‑step civic reporting loop.</p>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-8 md:gap-10">
            {/* Report */}
            <div className="flex flex-col items-center gap-4 flex-1">
              <PhoneFlowDemo staticStep="report" sectionActive={howActive} />
              <h3 className="text-sm font-medium tracking-wide">Report</h3>
              {/* Mobile downward arrow to next step */}
              <div className="md:hidden flex justify-center pt-1" aria-hidden>
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            {/* Desktop arrow */}
            <div className="hidden md:flex items-center justify-center" aria-hidden>
              <ArrowRight className="h-10 w-10 text-muted-foreground" />
            </div>
            {/* Track */}
            <div className="flex flex-col items-center gap-4 flex-1">
              <PhoneFlowDemo staticStep="track" sectionActive={howActive} />
              <h3 className="text-sm font-medium tracking-wide">Track</h3>
              <div className="md:hidden flex justify-center pt-1" aria-hidden>
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            {/* Desktop arrow */}
            <div className="hidden md:flex items-center justify-center" aria-hidden>
              <ArrowRight className="h-10 w-10 text-muted-foreground" />
            </div>
            {/* Resolve */}
            <div className="flex flex-col items-center gap-4 flex-1">
              <PhoneFlowDemo staticStep="resolve" sectionActive={howActive} />
              <h3 className="text-sm font-medium tracking-wide">Resolve</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos / Government Loop */}
      <section className="relative border-b bg-background/60 supports-[backdrop-filter]:bg-background/40">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 flex flex-col gap-8">
          <div className="flex flex-col gap-2 max-w-xl">
            <h3 className="text-sm font-medium tracking-wide text-primary/80">Trusted Pilots & Departments</h3>
            <p className="text-sm text-muted-foreground">Prototype ready for municipal innovation labs, public works teams, and smart city pilots.</p>
          </div>
          <div className="relative h-[120px]">
            <LogoLoop
              logos={govLogos}
              speed={90}
              direction="left"
              logoHeight={42}
              gap={56}
              pauseOnHover
              scaleOnHover
              fadeOut
              fadeOutColor="var(--background)"
              ariaLabel="Government & civic pilot partners"
              className="[--logoloop-fadeColor:var(--background)]"
            />
          </div>
        </div>
      </section>

      {/* FAQ (trimmed) */}
      <section id="faq" ref={faqRef} className="mx-auto w-full max-w-5xl px-6 py-16 md:py-20">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">FAQ</h2>
          <p className="text-sm text-muted-foreground">Quick answers about the demo.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="f1">
            <AccordionTrigger className="text-left">Is this production ready?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">This UI is a frontend demonstration. It is structured so a backend (e.g. Spring Boot) can be wired in easily.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="f2">
            <AccordionTrigger className="text-left">Does it support real-time updates?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">The architecture anticipates SSE / WebSocket integration; placeholders mimic the interaction model.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="f3">
            <AccordionTrigger className="text-left">Can I customize categories?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">Yes—category & status taxonomies can be adapted to local governance needs.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <footer className="mt-auto border-t bg-background/70 supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Civic Reporter</span>
          <div className="flex gap-4">
            <button onClick={()=>router.push('#features')} className="hover:text-foreground transition">Features</button>
            <button onClick={()=>router.push('#how-it-works')} className="hover:text-foreground transition">How It Works</button>
            <button onClick={()=>router.push('#faq')} className="hover:text-foreground transition">FAQ</button>
          </div>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ title, icon, children, bullets, size = 'md' }: { title: string; icon: React.ReactNode; children: React.ReactNode; bullets?: string[]; size?: 'md' | 'lg' }) {
  const large = size === 'lg'
  return (
    <SpotlightCard spotlightColor="rgba(5, 213, 255, 0.43)" className="h-full">
      <Card
        className={cn(
          'relative h-full flex flex-col overflow-hidden border border-border/70 bg-card rounded-xl',
          large && 'p-0',
          // Further decreased vertical sizing
          'min-h-[220px] md:min-h-[250px]'
        )}
      >
        <CardHeader className={cn('flex-1 pb-2', large && 'p-5 pb-3')}> 
          <div className="flex items-start justify-between gap-3 h-full">
            <div className="space-y-1.5 pr-1">
              <CardTitle className={cn('font-semibold tracking-tight', large ? 'text-lg leading-snug' : 'text-sm')}>{title}</CardTitle>
              {children ? (
                <p className={cn('text-muted-foreground line-clamp-2', large ? 'text-[13px] leading-snug' : 'text-[11px] leading-snug')}>
                  {children}
                </p>
              ) : null}
            </div>
            <span className={cn('shrink-0 rounded-md grid place-items-center bg-primary/10 border border-border/60', large ? 'h-12 w-12' : 'h-9 w-9')}>
              <span className="text-primary/90">{icon}</span>
            </span>
          </div>
        </CardHeader>
        {bullets && bullets.length ? (
          <CardContent className={cn('mt-auto w-full pt-0 pb-4', large && 'px-5 pt-0')}> 
            <ul className={cn('space-y-1.5', large ? 'mt-1' : 'mt-0.5')}>
              {bullets.slice(0,3).map((b,i)=>(
                <li key={i} className={cn('flex items-start gap-1.5 text-muted-foreground', large ? 'text-[11px]' : 'text-[10px]')}>
                  <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-primary/60" />
                  <span className="leading-snug line-clamp-1">{b}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        ) : null}
      </Card>
    </SpotlightCard>
  )
}
