"use client"

import { useLanguage } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function WellnessCookingPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6 text-center">
            {t.services.wellnessCooking}
          </h1>

          <div className="mb-12 rounded-2xl overflow-hidden">
            <img src="/thai-wellness-cooking-workshop-healthy-food.jpg" alt="Wellness Cooking" className="w-full h-[400px] object-cover" />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-foreground/80 leading-relaxed mb-6">{t.activities.wellnessFood.description}</p>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">About Our Workshops</h2>
            <p className="text-foreground/80 leading-relaxed">
              Learn to prepare delicious and nutritious Thai wellness cuisine using fresh, local ingredients. Our
              workshops combine traditional Thai cooking techniques with modern nutritional science to create meals that
              nourish both body and soul.
            </p>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">What You'll Learn</h2>
            <ul className="space-y-3 text-foreground/80">
              <li>Traditional Thai wellness recipes</li>
              <li>Nutritional benefits of local herbs and ingredients</li>
              <li>Cooking techniques for maximum nutrient retention</li>
              <li>Meal planning for optimal health</li>
              <li>Using Thai herbs for healing</li>
              <li>Creating balanced, flavorful dishes</li>
            </ul>

            <h2 className="font-serif text-3xl text-primary mt-12 mb-4">Workshop Details</h2>
            <p className="text-foreground/80 leading-relaxed">
              Our hands-on cooking workshops are led by experienced Thai chefs and nutritionists. You'll prepare a
              complete wellness meal from scratch, learn about ingredient selection, and enjoy your creations together.
              Workshops last 3-4 hours and include all ingredients and recipes to take home.
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
