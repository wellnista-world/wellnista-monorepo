"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Programs() {
  const { t } = useLanguage()

  return (
    <section id="programs" className="py-32 md:py-40 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-5xl md:text-7xl font-light text-primary mb-8 tracking-tight">
              {t.programs.title}
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-20 bg-accent" />
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
              <div className="h-px w-20 bg-accent" />
            </div>
          </div>

          <div className="bg-card rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-square md:aspect-auto">
                <img
                  src="/khao-yai-national-park-thailand-forest-landscape.jpg"
                  alt="Khao Yai Forest"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              </div>
              <div className="p-12 md:p-16 flex flex-col justify-center space-y-8">
                <div>
                  <span className="inline-block px-5 py-2 bg-accent/15 text-accent rounded-full text-xs font-medium uppercase tracking-widest mb-6">
                    Signature Experience
                  </span>
                  <h3 className="font-serif text-4xl md:text-5xl font-light text-primary mb-5 tracking-tight">
                    {t.programs.khaoyai}
                  </h3>
                  <p className="text-xl text-accent font-light mb-6 tracking-wide">{t.programs.location}</p>
                </div>

                <p className="text-foreground/70 leading-relaxed font-light text-lg">{t.programs.description}</p>

                <ul className="space-y-4 text-foreground/70">
                  <li className="flex items-start gap-4">
                    <span className="text-accent mt-1 text-lg">✓</span>
                    <span className="font-light">{t.programs.forestBathing}</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-accent mt-1 text-lg">✓</span>
                    <span className="font-light">{t.programs.soundHealing}</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-accent mt-1 text-lg">✓</span>
                    <span className="font-light">{t.programs.wellnessCooking}</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-accent mt-1 text-lg">✓</span>
                    <span className="font-light">{t.programs.herbalMedicineAndPilates}</span>
                  </li>
                </ul>

                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto rounded-full px-10 py-6 uppercase tracking-widest shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <Link href="/thailand-forest-bathing">{t.programs.viewPackages}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
