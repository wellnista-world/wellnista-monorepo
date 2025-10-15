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
  title: "Wellnista - Forest Bathing & Sound Healing Wellness Retreat Thailand | Longevity & Natural Health",
  description:
    "Experience transformative forest bathing (Shinrin-yoku), sound healing therapy, and wellness programs in Thailand's Khao Yai. Promote longevity, reduce stress, and enhance well-being through evidence-based natural approaches. Expert-guided wellness retreats for corporate groups, families, and health seekers.",
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  keywords: [
    "forest bathing Thailand",
    "sound healing retreat",
    "wellness tourism Thailand",
    "longevity wellness",
    "Shinrin-yoku Thailand",
    "Khao Yai wellness retreat",
    "forest therapy",
    "sound healing therapy",
    "wellness longevity programs",
    "natural healing Thailand",
    "holistic wellness retreat",
    "forest bathing Khao Yai",
    "therapeutic sound healing",
    "wellness forest experience",
    "longevity health retreat",
    "Thai wellness tourism",
    "meditation forest Thailand",
    "natural stress relief",
    "immune boost forest bathing",
    "healing retreat Thailand"
  ],
  authors: [{ name: "Wellnista", url: "https://wellnista.world" }],
  creator: "Wellnista",
  publisher: "Wellnista",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://wellnista.world'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'th': '/th',
    },
  },
  openGraph: {
    title: "Wellnista - Forest Bathing & Sound Healing Wellness Retreat Thailand",
    description: "Transform your health with forest bathing, sound healing, and longevity wellness programs in Thailand. Evidence-based natural healing in Khao Yai National Park.",
    url: 'https://wellnista.world',
    siteName: 'Wellnista',
    images: [
      {
        url: '/peaceful-forest-bathing-scene-in-thailand.jpg',
        width: 1200,
        height: 630,
        alt: 'Forest Bathing Wellness Retreat in Thailand - Natural Healing and Longevity',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wellnista - Forest Bathing & Sound Healing Thailand',
    description: 'Experience longevity wellness through forest bathing, sound healing, and natural therapies in Thailand.',
    images: ['/peaceful-forest-bathing-scene-in-thailand.jpg'],
    creator: '@wellnista',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: 'Wellnista',
    description: 'Forest bathing, sound healing, and wellness longevity programs in Thailand',
    url: 'https://wellnista.world',
    logo: 'https://wellnista.world/placeholder-logo.png',
    image: 'https://wellnista.world/peaceful-forest-bathing-scene-in-thailand.jpg',
    telephone: '+66-91-856-6163',
    email: 'apicha.pinsakul@wellnista.world',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TH',
      addressRegion: 'Khao Yai',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '14.4419',
      longitude: '101.3731',
    },
    priceRange: '$$',
    servesCuisine: 'Thai Wellness',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Wellness Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Forest Bathing (Shinrin-yoku)',
            description: 'Evidence-based forest therapy for stress reduction, immune boost, and longevity wellness',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sound Healing Therapy',
            description: 'Therapeutic sound vibrations for deep relaxation, mental clarity, and emotional healing',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Wellness Cooking Workshops',
            description: 'Learn Thai wellness cuisine for longevity and natural health',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pilates & Movement',
            description: 'Core strengthening and flexibility for wellness longevity',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Herbal Medicine Workshops',
            description: 'Traditional Thai herbal wisdom for natural healing',
          },
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
    },
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
