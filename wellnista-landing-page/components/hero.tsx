"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background pt-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 py-24 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h1 className="brand-name font-serif text-7xl md:text-9xl font-light text-primary tracking-tight">
              {t.hero.title}
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-accent" />
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
              <div className="h-px w-16 bg-accent" />
            </div>
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground font-light tracking-wide leading-relaxed max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>

          <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
            <img
              src="/peaceful-forest-bathing-scene-in-thailand.jpg"
              alt="Forest Bathing Shinrin-yoku Wellness Retreat in Thailand - Natural Healing and Longevity Experience"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
          </div>

          {/* Description */}
          <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed font-light">
            {t.hero.description}
          </p>

          <div className="pt-6">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-7 text-base uppercase tracking-widest rounded-full shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link href="#programs">{t.hero.cta}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
