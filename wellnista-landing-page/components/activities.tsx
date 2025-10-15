"use client"

import { useLanguage } from "@/lib/language-context"
import Image from "next/image"

const activities = [
  {
    key: "forestBathing",
    image: "/people-walking-peacefully-in-lush-green-forest.jpg",
  },
  {
    key: "soundHealing",
    image: "/people-lying-down-in-peaceful-meditation-with-sing.jpg",
  },
  {
    key: "sleepPillows",
    image: "/people-in-green-shirts-making-herbal-sleep-pillows.jpg",
  },
  {
    key: "thaiMassage",
    image: "/traditional-thai-massage-therapy-session.jpg",
  },
  {
    key: "wellnessFood",
    image: "/cooking-class-with-fresh-vegetables-and-herbs.jpg",
  },
]

export function Activities() {
  const { t } = useLanguage()

  return (
    <section className="py-32 md:py-40 bg-secondary/20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-5xl md:text-7xl font-light text-primary mb-8 tracking-tight">
              {t.activities.title}
            </h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-20 bg-accent" />
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
              <div className="h-px w-20 bg-accent" />
            </div>
            <p className="text-lg text-muted-foreground font-light">{t.activities.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {activities.map((activity) => (
              <div
                key={activity.key}
                className="group bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ring-1 ring-border/50"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={activity.image || "/placeholder.svg"}
                    alt={t.activities[activity.key as keyof typeof t.activities].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-8">
                  <h3 className="font-serif text-2xl font-light text-primary mb-4 tracking-wide">
                    {t.activities[activity.key as keyof typeof t.activities].title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed font-light">
                    {t.activities[activity.key as keyof typeof t.activities].description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
