"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import en from "@/messages/en.json"
import th from "@/messages/th.json"

type Language = "en" | "th"
type Messages = typeof en

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Messages
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [messages, setMessages] = useState<Messages>(en)

  useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem("language") as Language
    if (saved && (saved === "en" || saved === "th")) {
      setLanguage(saved)
      setMessages(saved === "th" ? th : en)
    }
  }, [])

  useEffect(() => {
    if (language === "th") {
      document.body.classList.add("lang-th")
    } else {
      document.body.classList.remove("lang-th")
    }
  }, [language])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    setMessages(lang === "th" ? th : en)
    localStorage.setItem("language", lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: messages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
