"use client"

import { useLanguage } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Thai Herbal Medicine Workshop - Natural Healing & Wellness Longevity | Wellnista",
  description: "Learn traditional Thai herbal medicine for natural healing and longevity. Hands-on workshops teaching herbal remedies, aromatherapy, healing balms, and wellness products. Ancient Thai herbal wisdom for modern health and longevity.",
  keywords: "Thai herbal medicine workshop, herbal wellness Thailand, natural healing herbs, Thai aromatherapy, herbal longevity, traditional Thai medicine, herbal remedies workshop, wellness herbs Thailand, Thai herbal compress",
  openGraph: {
    title: "Thai Herbal Medicine Workshop - Natural Healing & Longevity",
    description: "Discover ancient Thai herbal wisdom. Create natural wellness products and learn traditional healing practices for longevity.",
    images: [{ url: "/thai-herbal-medicine-workshop-natural-herbs.jpg", width: 1200, height: 630, alt: "Thai Herbal Medicine Workshop Natural Healing" }],
  },
}

export default function HerbalWorkshopsPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6 text-center">
            {t.services.herbalWorkshops}
          </h1>

          <div className="mb-12 rounded-2xl overflow-hidden">
            <img src="/thai-herbal-medicine-workshop-natural-herbs.jpg" alt="Herbal Workshops" className="w-full h-[400px] object-cover" />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-foreground/80 leading-relaxed mb-6">
              Discover the ancient wisdom of Thai herbal medicine and learn to create your own natural wellness products
              using traditional herbs and techniques.
            </p>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">Traditional Thai Herbal Medicine</h2>
            <p className="text-foreground/80 leading-relaxed">
              Thai herbal medicine has been practiced for centuries, using the healing properties of local plants and
              herbs. Our workshops teach you to identify, prepare, and use these natural remedies for health and
              wellness.
            </p>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">Workshop Topics</h2>
            <ul className="space-y-3 text-foreground/80">
              <li>Herbal sleep pillows and aromatherapy</li>
              <li>Thai herbal compress (Luk Pra Kob)</li>
              <li>Natural skincare and beauty products</li>
              <li>Herbal teas and wellness drinks</li>
              <li>Traditional Thai balms and oils</li>
              <li>Medicinal herb identification and uses</li>
            </ul>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">What You'll Create</h2>
            <p className="text-foreground/80 leading-relaxed">
              Each workshop is hands-on, allowing you to create your own herbal products to take home. You'll learn
              about the properties of different herbs, traditional preparation methods, and how to incorporate these
              natural remedies into your daily wellness routine. All materials and ingredients are provided.
            </p>
          </div>

          <div className="text-center mt-12">
            <Link href="/#contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Book a Workshop
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
