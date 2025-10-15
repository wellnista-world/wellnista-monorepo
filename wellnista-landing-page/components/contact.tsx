"use client"

import type React from "react"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, Globe } from "lucide-react"

export function Contact() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

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

            <div className="bg-card rounded-3xl p-10 shadow-lg ring-1 ring-border/50">
              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-3 uppercase tracking-wider"
                  >
                    {t.contact.name}
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t.contact.name}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background border-border rounded-xl h-12 font-light"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-3 uppercase tracking-wider"
                  >
                    {t.contact.email}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.contact.email}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background border-border rounded-xl h-12 font-light"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-3 uppercase tracking-wider"
                  >
                    {t.contact.message}
                  </label>
                  <Textarea
                    id="message"
                    placeholder={t.contact.message}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-background border-border min-h-[180px] rounded-xl font-light"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6 uppercase tracking-widest shadow-lg hover:shadow-xl transition-all"
                >
                  {t.contact.send}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
