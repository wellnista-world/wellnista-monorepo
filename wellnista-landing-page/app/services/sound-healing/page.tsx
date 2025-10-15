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
              alt="Sound Healing"
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-foreground/80 leading-relaxed mb-6">{t.activities.soundHealing.description}</p>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">About Sound Healing</h2>
            <p className="text-foreground/80 leading-relaxed">
              Sound healing is an ancient practice that uses vibrational sound to help reduce stress, alter
              consciousness, and create a deep sense of peace and well-being. We use singing bowls, gongs, chimes, and
              other therapeutic instruments to create a meditative soundscape.
            </p>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">Benefits</h2>
            <ul className="space-y-3 text-foreground/80">
              <li>Deep relaxation and stress relief</li>
              <li>Improved sleep quality</li>
              <li>Enhanced mental clarity and focus</li>
              <li>Emotional release and healing</li>
              <li>Reduced anxiety and depression</li>
              <li>Balanced energy and chakras</li>
            </ul>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">The Experience</h2>
            <p className="text-foreground/80 leading-relaxed">
              During a sound healing session, you'll lie comfortably while our practitioners create therapeutic
              soundscapes using traditional instruments. The vibrations wash over you, promoting deep relaxation and
              healing. Sessions last 60-90 minutes and are suitable for everyone.
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
