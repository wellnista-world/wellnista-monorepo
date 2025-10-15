"use client"

import { useLanguage } from "@/lib/language-context"
import { Phone, Mail, Globe } from "lucide-react"

export function Contact() {
  const { t } = useLanguage()

  return (
    <section id="contact" className="py-32 md:py-40 bg-secondary/20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-5xl md:text-7xl font-light text-primary mb-8 tracking-tight">
              {t.contact.title}
            </h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-20 bg-accent" />
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
              <div className="h-px w-20 bg-accent" />
            </div>
            <p className="text-lg text-muted-foreground font-light">{t.contact.getInTouch}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-10">
              <div>
                <h3 className="font-serif text-3xl font-light text-primary mb-8 tracking-wide">{t.contact.info}</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-2">{t.contact.phone}</p>
                      <a
                        href="tel:+66918566163"
                        className="text-muted-foreground hover:text-primary transition-colors font-light"
                      >
                        +66 (0)91-856-6163
                      </a>
                      <p className="text-sm text-muted-foreground font-light">(Alice)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-2">{t.contact.email}</p>
                      <a
                        href="mailto:apicha.pinsakul@wellnista.world"
                        className="text-muted-foreground hover:text-primary transition-colors break-all font-light"
                      >
                        apicha.pinsakul@wellnista.world
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-2">{t.contact.location}</p>
                      <p className="text-muted-foreground font-light">Thailand</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-3xl p-10 shadow-lg ring-1 ring-border/50 flex flex-col items-center justify-center text-center space-y-8">
              <div className="space-y-4">
                <h3 className="font-serif text-3xl font-light text-primary tracking-wide">Get in Touch</h3>
                <p className="text-muted-foreground font-light max-w-md">
                  Ready to begin your wellness journey? Send us an email and we'll get back to you within 24 hours.
                </p>
              </div>
              
              <div className="space-y-4">
                <a
                  href="mailto:apicha.pinsakul@wellnista.world?subject=Wellness Program Inquiry&body=Hello Wellnista Team,%0D%0A%0D%0AI am interested in your wellness programs and would like to learn more about:%0D%0A%0D%0A- Forest Bathing Sessions%0D%0A- Sound Healing Therapy%0D%0A- Wellness Cooking Workshops%0D%0A- Pilates Classes%0D%0A- Herbal Medicine Workshops%0D%0A%0D%0APlease provide more information about:%0D%0A%0D%0A%0D%0AThank you!"
                  className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-12 py-6 uppercase tracking-widest shadow-lg hover:shadow-xl transition-all font-medium"
                >
                  <Mail className="w-5 h-5" />
                  {t.contact.send}
                </a>
                
                <p className="text-sm text-muted-foreground font-light">
                  Or call us directly at <a href="tel:+66918566163" className="text-primary hover:underline">+66 (0)91-856-6163</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
