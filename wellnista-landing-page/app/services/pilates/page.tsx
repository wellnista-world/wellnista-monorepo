"use client"

import { useLanguage } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PilatesPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6 text-center">{t.services.pilates}</h1>

          <div className="mb-12 rounded-2xl overflow-hidden">
            <img src="/pilates-class-in-nature-wellness-retreat.jpg" alt="Pilates" className="w-full h-[400px] object-cover" />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-foreground/80 leading-relaxed mb-6">
              Strengthen your core, improve flexibility, and enhance body awareness through our Pilates sessions set in
              the peaceful natural surroundings of Thailand.
            </p>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">About Pilates</h2>
            <p className="text-foreground/80 leading-relaxed">
              Pilates is a low-impact exercise method that focuses on strengthening muscles while improving postural
              alignment and flexibility. Our sessions combine traditional Pilates principles with the healing energy of
              nature, creating a unique wellness experience.
            </p>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">Benefits</h2>
            <ul className="space-y-3 text-foreground/80">
              <li>Improved core strength and stability</li>
              <li>Enhanced flexibility and range of motion</li>
              <li>Better posture and body alignment</li>
              <li>Increased muscle tone and definition</li>
              <li>Reduced back pain and tension</li>
              <li>Mind-body connection and awareness</li>
            </ul>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">Our Classes</h2>
            <p className="text-foreground/80 leading-relaxed">
              We offer both mat Pilates and equipment-based sessions led by certified instructors. Classes are suitable
              for all levels, from beginners to advanced practitioners. Each session is designed to challenge your body
              while respecting its limits, promoting strength, flexibility, and overall well-being.
            </p>
          </div>

          <div className="text-center mt-12">
            <Link href="/#contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Book a Class
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
