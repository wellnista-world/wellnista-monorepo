import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Inter, Kanit } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LanguageProvider } from "@/lib/language-context"
import { Navigation } from "@/components/navigation"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-garet",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
})

const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Wellnista - Design Your Happier Wellness Life",
  description:
    "Promote well-being through natural and evidence-based approaches. Experience Forest Bathing, Sound Healing, and Wellness programs in Thailand.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${cormorant.variable} ${kanit.variable} antialiased`}>
        <LanguageProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Navigation />
            {children}
            <Analytics />
          </Suspense>
        </LanguageProvider>
      </body>
    </html>
  )
}
