"use client"

import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import LanguageSwitcher from "./language-switcher"

export function Navigation() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border/50 z-50 transition-all">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="group flex flex-col">
            <span className="brand-name font-serif text-3xl font-light tracking-wide text-primary">Wellnista</span>
            <span className="h-0.5 w-0 group-hover:w-full bg-accent transition-all duration-300" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/"
              className="text-sm uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors font-medium"
            >
              {t.nav.home}
            </Link>
            <Link
              href="#about"
              className="text-sm uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors font-medium"
            >
              {t.nav.about}
            </Link>
            <Link
              href="#services"
              className="text-sm uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors font-medium"
            >
              {t.nav.services}
            </Link>
            <Link
              href="/thailand-forest-bathing"
              className="text-sm uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors font-medium"
            >
              {t.nav.programs}
            </Link>
            <Link
              href="#contact"
              className="text-sm uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors font-medium"
            >
              {t.nav.contact}
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-border/50">
            <div className="flex flex-col gap-6">
              <Link
                href="/"
                className="text-sm uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors font-medium"
              >
                {t.nav.home}
              </Link>
              <Link
                href="#about"
                className="text-sm uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors font-medium"
              >
                {t.nav.about}
              </Link>
              <Link
                href="#services"
                className="text-sm uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors font-medium"
              >
                {t.nav.services}
              </Link>
              <Link
                href="/thailand-forest-bathing"
                className="text-sm uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors font-medium"
              >
                {t.nav.programs}
              </Link>
              <Link
                href="#contact"
                className="text-sm uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors font-medium"
              >
                {t.nav.contact}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
