"use client"

import { useLanguage } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ForestBathingPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6 text-center">{t.services.forestBathing}</h1>

          <div className="mb-12 rounded-2xl overflow-hidden">
            <img
              src="/peaceful-forest-bathing-scene-in-thailand.jpg"
              alt="Forest Bathing Shinrin-yoku Therapy in Thailand - Natural Wellness and Longevity Experience"
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-foreground/80 leading-relaxed mb-6">{t.activities.forestBathing.description}</p>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">What is Forest Bathing & Shinrin-yoku?</h2>
            <p className="text-foreground/80 leading-relaxed">
              Forest bathing, or Shinrin-yoku, is a therapeutic wellness practice that originated in Japan. It involves mindfully immersing
              yourself in the forest atmosphere through all your senses. This evidence-based longevity practice has been scientifically
              proven to reduce stress, lower blood pressure, boost immune function, and promote overall wellness and longevity. Experience authentic forest therapy in Thailand's pristine Khao Yai forests.
            </p>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">Forest Bathing Benefits for Longevity & Wellness</h2>
            <ul className="space-y-3 text-foreground/80">
              <li>Reduces stress and anxiety levels naturally</li>
              <li>Improves mood and emotional well-being</li>
              <li>Boosts immune system function for longevity</li>
              <li>Lowers blood pressure and heart rate</li>
              <li>Enhances creativity, focus, and mental clarity</li>
              <li>Promotes better sleep quality and restoration</li>
              <li>Increases NK cell activity for disease prevention</li>
              <li>Supports cardiovascular health and longevity</li>
            </ul>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">What to Expect</h2>
            <p className="text-foreground/80 leading-relaxed">
              Our certified forest therapy guides will lead you through a gentle, mindful walk in nature. You'll engage
              in sensory activities designed to deepen your connection with the natural world. Sessions typically last
              2-3 hours and are suitable for all fitness levels.
            </p>
          </div>

          <div className="text-center mt-12">
            <Link href="/#contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Book a Session
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
