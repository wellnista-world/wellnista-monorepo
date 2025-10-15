"use client"

import { useLanguage } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SoundHealingPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6 text-center">{t.services.soundHealing}</h1>

          <div className="mb-12 rounded-2xl overflow-hidden">
            <img
              src="/serene-wellness-meditation-in-thai-forest.jpg"
              alt="Sound Healing Therapy and Sound Bath Meditation in Thailand - Wellness and Longevity Experience"
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-foreground/80 leading-relaxed mb-6">{t.activities.soundHealing.description}</p>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">About Sound Healing Therapy & Wellness</h2>
            <p className="text-foreground/80 leading-relaxed">
              Sound healing therapy is an ancient wellness practice that uses therapeutic vibrational sound to reduce stress, promote longevity,
              alter consciousness, and create a deep sense of peace and well-being. We use traditional singing bowls, therapeutic gongs, healing chimes, and
              other sacred instruments to create transformative meditative soundscapes for optimal wellness and longevity.
            </p>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">Sound Healing Benefits for Longevity & Wellness</h2>
            <ul className="space-y-3 text-foreground/80">
              <li>Deep relaxation and therapeutic stress relief</li>
              <li>Improved sleep quality and restoration for longevity</li>
              <li>Enhanced mental clarity, focus, and cognitive wellness</li>
              <li>Emotional release and deep healing</li>
              <li>Reduced anxiety, depression, and mental stress</li>
              <li>Balanced energy, chakras, and vibrational wellness</li>
              <li>Supports cardiovascular health and longevity</li>
              <li>Promotes cellular regeneration through healing frequencies</li>
            </ul>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">The Sound Healing Experience</h2>
            <p className="text-foreground/80 leading-relaxed">
              During a transformative sound healing therapy session, you'll lie comfortably in Thailand's serene natural setting while our expert practitioners create therapeutic
              soundscapes using traditional healing instruments. The therapeutic vibrations wash over you, promoting deep relaxation, wellness, and
              longevity healing. Sessions last 60-90 minutes and are suitable for everyone seeking natural wellness and stress relief.
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
