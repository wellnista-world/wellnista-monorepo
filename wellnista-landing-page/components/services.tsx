"use client"

import { useLanguage } from "@/lib/language-context"
import { Leaf, Music, UtensilsCrossed, Activity, Flower } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"

const services = [
  {
    icon: Leaf,
    key: "forestBathing",
    href: "/services/forest-bathing",
  },
  {
    icon: Music,
    key: "soundHealing",
    href: "/services/sound-healing",
  },
  {
    icon: UtensilsCrossed,
    key: "wellnessCooking",
    href: "/services/wellness-cooking",
  },
  {
    icon: Activity,
    key: "pilates",
    href: "/services/pilates",
  },
  {
    icon: Flower,
    key: "herbalWorkshops",
    href: "/services/herbal-workshops",
  },
]

export function Services() {
  const { t } = useLanguage()

  return (
    <section id="services" className="py-32 md:py-40 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="font-serif text-5xl md:text-7xl font-light text-primary mb-8 tracking-tight">
            {t.services.title}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-accent" />
            <div className="h-1.5 w-1.5 rounded-full bg-accent" />
            <div className="h-px w-20 bg-accent" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service) => (
            <div
              key={service.key}
              className="group bg-card rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ring-1 ring-border/50 hover:ring-accent/30"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-light text-primary mb-4 tracking-wide">
                {t.services[service.key as keyof typeof t.services]}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8 font-light">
                {t.services[`${service.key}Description` as keyof typeof t.services]}
              </p>
              <Button
                variant="outline"
                className="mt-auto bg-transparent border-primary/20 hover:border-accent hover:bg-accent/5 rounded-full px-6"
                asChild
              >
                <Link href={service.href}>{t.services.learnMore}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
