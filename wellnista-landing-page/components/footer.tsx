"use client"

import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

export function Footer() {
  const { t } = useLanguage()

  const services = [
    { key: "forestBathing", href: "/services/forest-bathing" },
    { key: "soundHealing", href: "/services/sound-healing" },
    { key: "wellnessCooking", href: "/services/wellness-cooking" },
    { key: "pilates", href: "/services/pilates" },
    { key: "herbalWorkshops", href: "/services/herbal-workshops" },
  ]

  const values = ["wellness", "nature", "science", "calmness", "longevity"]

  return (
    <footer className="bg-primary text-primary-foreground py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div>
              <h3 className="brand-name font-serif text-4xl font-light mb-6 tracking-wide">Wellnista</h3>
              <p className="text-primary-foreground/70 leading-relaxed font-light">{t.footer.tagline}</p>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-6 uppercase tracking-widest">{t.footer.services}</h4>
              <ul className="space-y-3 text-primary-foreground/70 font-light">
                {services.map((service) => (
                  <li key={service.key}>
                    <Link href={service.href} className="hover:text-primary-foreground transition-colors">
                      {t.services[service.key as keyof typeof t.services]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-6 uppercase tracking-widest">{t.footer.values}</h4>
              <ul className="space-y-3 text-primary-foreground/70 font-light">
                {values.map((value) => (
                  <li key={value}>{t.footer[value as keyof typeof t.footer]}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-10 text-center text-primary-foreground/60 font-light">
            <p className="mb-3">
              © {new Date().getFullYear()} Wellnista. {t.footer.rights}
            </p>
            <p className="text-sm">{t.footer.description}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
