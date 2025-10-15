"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex gap-2">
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("en")}
        className="text-sm"
      >
        EN
      </Button>
      <Button
        variant={language === "th" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("th")}
        className="text-sm"
      >
        TH
      </Button>
    </div>
  )
}
