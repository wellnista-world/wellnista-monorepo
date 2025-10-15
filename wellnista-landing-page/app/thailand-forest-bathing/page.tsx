"use client"

import { useLanguage } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

export default function ThailandForestBathingPage() {
  const { t } = useLanguage()

  const packages = [
    {
      key: "corporate",
      icon: "🏢",
    },
    {
      key: "elderly",
      icon: "👴",
    },
    {
      key: "family",
      icon: "👨‍👩‍👧‍👦",
    },
    {
      key: "foreigners",
      icon: "🌍",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl md:text-6xl text-primary mb-4">{t.programs.khaoyai}</h1>
            <p className="text-xl text-muted-foreground mb-2">{t.programs.location}</p>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">{t.programs.description}</p>
          </div>

          {/* Program Image */}
          <div className="mb-16 rounded-2xl overflow-hidden">
            <img
              src="/khao-yai-national-park-forest-wellness-retreat.jpg"
              alt="Khao Yai Forest Bathing"
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* Program Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">{t.programs.forestBathing}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">{t.programs.soundHealing}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">{t.programs.wellnessCooking}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">{t.programs.herbalMedicineAndPilates}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 px-4 bg-accent/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl text-center text-primary mb-12">{t.packages.title}</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {packages.map((pkg) => {
              const packageData = t.packages[pkg.key as keyof typeof t.packages] as {
                title: string
                description: string
                features: string[]
              }

              return (
                <Card key={pkg.key} className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader>
                    <div className="text-4xl mb-2">{pkg.icon}</div>
                    <CardTitle className="text-2xl">{packageData.title}</CardTitle>
                    <CardDescription className="text-base">{packageData.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {packageData.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/#contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                {t.contact.title}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
