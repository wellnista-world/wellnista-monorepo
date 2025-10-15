"use client"

import { useLanguage } from "@/lib/language-context"

export function About() {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-32 md:py-40 bg-secondary/30">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-5xl md:text-7xl font-light text-primary mb-8 tracking-tight">
              {t.about.title}
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-20 bg-accent" />
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
              <div className="h-px w-20 bg-accent" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div>
                <h3 className="font-serif text-3xl font-light text-primary mb-4 tracking-wide">{t.about.mission}</h3>
                <p className="text-lg leading-relaxed text-foreground/70 font-light">{t.about.missionText}</p>
              </div>
              <div>
                <h3 className="font-serif text-3xl font-light text-primary mb-4 tracking-wide">{t.about.vision}</h3>
                <p className="text-lg leading-relaxed text-foreground/70 font-light">{t.about.visionText}</p>
              </div>
            </div>

            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
              <img
                src="/serene-wellness-meditation-in-thai-forest.jpg"
                alt="Wellness and Meditation in Thai Forest - Sound Healing and Longevity Retreat"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
